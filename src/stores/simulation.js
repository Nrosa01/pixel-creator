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
    const debug = ref(false)

    // Surprinsingly this works, it seems I can do anything on setup pinia stores
    // This only gets called once as every other call to useSimulationStore will return the same instance (memoized store)
    wasm_exports.select_particle(js_object(selected_particle.value.toString()));

    const addParticle = (particle) => {
        particle_array.value.push(particle)
    }

    const removeParticle = (index) => {
        wasm_exports.remove_plugin(js_object(index.toString()));
        particle_array.value.splice(index, 1)
        selected_particle.value = Math.min(selected_particle.value, particle_array.value.length - 1);
    }

    const removeSelectedParticle = () => {
        removeParticle(selected_particle.value)
    }

    const selectParticle = (index) => {
        wasm_exports.select_particle(js_object(index.toString()));
        selected_particle.value = index
    }

    const loadFromJSON = (json) => {
        particle_array.value = json.map((particle) => new ParticleModel(particle.display_name, particle.data, particle.blockly_workspace));
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
                // console.log("Selected particle changed", selection);
                if (prevSelection !== undefined && prevSelection < particleArrayLength) saveWorkspace(prevSelection);
                if (selection !== undefined) loadWorkspace(selection);
            } else if (particleArrayLength !== prevParticleArrayLength) {
                // console.log("Particle array length changed", particleArrayLength);

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