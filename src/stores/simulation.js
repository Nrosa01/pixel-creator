import { defineStore } from 'pinia'
import { ref, watch, computed } from 'vue'
import { loadFile, saveToFile as save } from "../assets/utils.js";
import * as Blockly from "blockly";
import { jsonGenerator } from "../assets/blockly/generator";
import ParticleModel from "../assets/models/particle";

// Having to import this here is ugly, this will be fixed once 
// whe get a default array preconfigured to load from Blockly component, but well, for now this is.
import empty from "../assets/particles/empty.json";
// import sand from "../assets/particles/sand.json";
// import replicant from "../assets/particles/replicant.json";
// import simplest from "../assets/particles/simplest.json";
// import test from "../assets/particles/test.json";

export const useSimulationStore = defineStore("simulation", () => {
    const particle_array = ref([
        new ParticleModel("Empty", empty),
    ])
    const selected_particle = ref(0)
    const generated_code = ref("")
    const particle_array_length = computed(() => particle_array.value.length)
    const canvas_size = ref(150)
    const blocklyLoaded = ref(false)
    const debug = ref(false)

    // Surprinsingly this works, it seems I can do anything on setup pinia stores
    // This only gets called once as every other call to useSimulationStore will return the same instance (memoized store)
    wasm_exports.select_particle(js_object(selected_particle.value.toString()));

    const addParticle = (particle) => {
        particle_array.value.push(particle)
    }

    // This function is pretty damn slow....
    // But it can't be optimized more
    const removeParticle = (index) => {
        let previous_selected = selected_particle.value;

        // Because we are removing a particle, all fields in the dropdowns that function with indexes will be shifted
        // For example, let's say we have 4 particles, A B, C and D. 
        // Currently the dropdown options are [A, B, C, D], let's say C has a block with a dropdown that selects D
        // The value of that dropdown will be 3, because it is the index of D in the dropdown.
        // If we now remove B, the dropdown will be [A, C, D], Blockly will see that and change the value of the dropdown to 0. Before that happens
        // We want to remove one value to each field on the dropdown that is greater than the index of the removed particle

        // And that's what we are doing here. For each workspace, we are shifting the dropdowns that have a value greater than the index of the removed particle

        // We have to do this BEFORE removing the particle from the array because if we do so, when loading a workspace with a dropdown referencing the last value
        // Blockly will shift it to 0 and I want to avoi that.

        // Doing all of this is quite slow as we are parsing lots of strings, searching, modifying etc...
        // Not doing all of this would result in code being much much faster at the cost of user experience
        // Anyways, removing particles is not something that will be done frequently so I think it is worth it.
        // And thankfuly adding particles doesn't have this problem.

        let cache = {};

        // Memoization of the id to string conversion
        const mapOfIdToString = (id) => {
            if (cache[id] === undefined) {
                cache[id] = id.toString();
            }
            return cache[id];
        };

        const workspace = Blockly.getMainWorkspace();

        for (let i = 0; i < particle_array.value.length; i++) {
            const data = particle_array.value[i]?.blockly_workspace;
            if (!data) continue;

            Blockly.serialization.workspaces.load(data, workspace);

            let blocks = workspace.getBlocksByType("particle");
            blocks.map((block) => {
                let value = parseInt(block.getFieldValue("PARTICLE"));
                if (value >= index) {
                    block.setFieldValue(mapOfIdToString(value - 1), "PARTICLE");
                }
            })

            saveWorkspace(i);
            const particle_base = workspace.getBlocksByType("particle_base")[0];
            let code = jsonGenerator.blockToCode(particle_base);
            particle_array.value[i].update_data(JSON.parse(code));
        }

        wasm_exports.remove_plugin(js_object(index.toString()));
        particle_array.value.splice(index, 1)

        selected_particle.value = Math.min(previous_selected, particle_array.value.length - 1);
    }

    const removeSelectedParticle = () => {
        removeParticle(selected_particle.value)
    }

    const selectParticle = (index) => {
        wasm_exports.select_particle(js_object(index.toString()));
        selected_particle.value = index
    }

    const loadFromJSON = (json) => {
        // We have to make sure to remove the old particles from the wasm memory

        // Print how many particles are being removed
        for (let i = 1; i < particle_array.value.length; i++) {
            wasm_exports.remove_plugin(js_object("1")); // We remove the first particle every time, we are removing all of them anyway
        }

        ParticleModel.used_names.clear();
        particle_array.value = json.map((particle) => new ParticleModel(particle.display_name, particle.data, particle.blockly_workspace));

        // We need to send all the behaviour to wasm, for that we need to load everyworkspace
        // Because regenerate code inside loadworkspace loads the current selected particle
        // I have to select particle and then load workspace
        // One would think that because of reactiviy, just selecting the particle would trigger the load workspace
        // But nop, so we have to manually do it this way.

        // Tbh just having to do this makes me question all this store reactivy. Maybe I should enfornce a more imperative approach
        // But for now this reactive approach is working, so I will keep it.
        let previous_selected = selected_particle.value;
        for (let i = 0; i < particle_array.value.length; i++) {
            selectParticle(i);
            loadWorkspace(i);
        }

        selectParticle(Math.min(previous_selected, particle_array.value.length - 1));
        loadWorkspace(selected_particle.value);
    }

    const loadFromFile = () => {
        loadFile(".json").then((file) => {
            loadFromJSON(JSON.parse(file));
        });
    }

    const saveToFile = (fileName) => {
        saveWorkspace(selected_particle.value);
        save(fileName, JSON.stringify(particle_array.value))
    }

    const loadWorkspace = (index) => {
        Blockly.Events.disable();
        const workspace = Blockly.getMainWorkspace();
        const data = particle_array.value[index]?.blockly_workspace;
        if (data) {
            Blockly.serialization.workspaces.load(data, workspace);
        } else {
            workspace.clear();

            const block = workspace.newBlock("particle_base");
            block.setFieldValue(particle_array.value[index]?.display_name, "NAME");
            const color = particle_array.value[index]?.data.color;
            const colorToHex = (color) => {
                return "#" + color.map((c) => c.toString(16).padStart(2, "0")).join("");
            };
            block.setFieldValue(colorToHex(color), "COLOR");
            block.setFieldValue(particle_array.value[index]?.data.alpha[0], "MIN_ALPHA");
            block.setFieldValue(particle_array.value[index]?.data.alpha[1], "MAX_ALPHA");
            block.initSvg();
            block.render();
        }
        Blockly.Events.enable();
        regenerateCode();
    }

    const regenerateCode = () => {
        const ws = Blockly.getMainWorkspace();
        const particle_base = ws.getBlocksByType("particle_base")[0];
        generated_code.value = jsonGenerator.blockToCode(particle_base);
        particle_array.value[selected_particle.value].update_data(JSON.parse(generated_code.value));
    }

    const saveWorkspace = (index) => {
        const json = Blockly.serialization.workspaces.save(Blockly.getMainWorkspace());
        particle_array.value[index].blockly_workspace = json;
    }


    // This should be particle_array.length as dependency but that gives a warning error
    watch(
        [selected_particle, particle_array_length],
        ([selection, particleArrayLength], [prevSelection, prevParticleArrayLength]) => {

            if (selection !== prevSelection) {
                if (prevSelection !== undefined && prevSelection < particleArrayLength) saveWorkspace(prevSelection);
                if (selection !== undefined) loadWorkspace(selection);
            } else if (particleArrayLength !== prevParticleArrayLength) {
                // This is needed for when a particle is added, as it modifies the particle id blocks that can get lost if not saved
                // Sure I could also save the workspace everytime is edited but that would be too much
                if (prevParticleArrayLength < particleArrayLength) saveWorkspace(selection);

                // If the particle was deleted, the index keeps the same, but the particle is different so we need to reload the workspace
                if (selection !== undefined) loadWorkspace(selection);
            }
        }
    );

    return {
        particle_array,
        selected_particle,
        generated_code,
        debug,
        canvas_size,
        particle_array_length,
        blocklyLoaded,
        addParticle,
        removeParticle,
        removeSelectedParticle,
        selectParticle,
        saveToFile,
        loadFromFile,
        loadWorkspace,
        saveWorkspace,
        regenerateCode,
        loadFromJSON
    }
})