<script setup>
import { onMounted, ref } from "vue";
import ParticleModel from "../assets/models/particle.js";
import * as Blockly from "blockly";
import { watch } from "vue";
import { blocks } from "../assets/blockly/blocks";
import { jsonGenerator } from "../assets/blockly/generator";
import { save, load } from "../assets/blockly/serialization";
import { toolbox } from "../assets/blockly/toolbox";
import "../assets/blockly/renderer.js";

const props = defineProps({
  particle_array: Array,
  selected_particle: Number,
});

// computed property to handle the selected particle
watch(
  () => [props.selected_particle, props.particle_array.length],
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
function loadWorkspace(index) {
  Blockly.Events.disable();
  const workspace = Blockly.getMainWorkspace();
  const data = props.particle_array[index]?.blockly_workspace;
  if (data) {
    Blockly.serialization.workspaces.load(data, workspace);
  } else {
    workspace.clear();

    const block = workspace.newBlock("particle_base");
    console.log("Loading index", index, props.particle_array[index]?.display_name);
    block.setFieldValue(props.particle_array[index]?.display_name, "NAME");
    const color = props.particle_array[index]?.data.color;
    const colorToHex = (color) => {
      return "#" + color.map((c) => c.toString(16).padStart(2, "0")).join("");
    };
    block.setFieldValue(colorToHex(color), "COLOR");
    block.setFieldValue(props.particle_array[index]?.data.alpha[0], "MIN_ALPHA");
    block.setFieldValue(props.particle_array[index]?.data.alpha[1], "MAX_ALPHA");
    block.initSvg();
    block.render();
  }
  Blockly.Events.enable();
}

function saveWorkspace(index) {
  const json = Blockly.serialization.workspaces.save(Blockly.getMainWorkspace());
  props.particle_array[index].blockly_workspace = json;
}

function update_particle(index, data) {
  props.particle_array[index].update_data(JSON.parse(data));
}

onMounted(() => {
  console.log("Blockly mounted");

  Blockly.Extensions.register("particle_list_extension", function () {
    this.getInput("DUMMY").appendField(
      new Blockly.FieldDropdown(function () {
        return props.particle_array.map((particle) => [particle.display_name, particle.data.name]);
      }), "PARTICLE"
    );
    if (this.rendered) {
  this.render();
  // This may not be necessary, but no harm in adding it.
  this.bumpNeighbours();
}
  });

  // Check if blocks are already defined
  if (!Blockly.Blocks["particle"]) {
    Blockly.common.defineBlocks(blocks);
  }

  const blocklyDiv = document.getElementById("blocklyDiv");
  const ws = Blockly.inject(blocklyDiv, {
    renderer: "Zelos",
    scrollbars: false,
    grid: {
      spacing: 20,
      length: 3,
      colour: "#ccc",
      snap: true,
    },
    maxInstances: {
      particle_base: 1,
    },
    move: {
      scrollbars: true,
      drag: true,
      wheel: true,
    },
    zoom: {
      controls: true,
      wheel: false,
      startScale: 1.0,
      maxScale: 1.5,
      minScale: 0.5,
      scaleSpeed: 1.2,
    },
    toolbox,
  });

  ws.addChangeListener((e) => {
    // Don't run the code when the workspace finishes loading; we're
    // already running it once when the application starts.
    // Don't run the code during drags; we might have invalid state.
    if (e.isUiEvent || e.type == Blockly.Events.FINISHED_LOADING || ws.isDragging()) {
      return;
    }

    // Modify workspace so only particle_base block and its children stay
    console.log("Workspace changed");

    const particle_base = ws.getBlocksByType("particle_base")[0];
    const code = jsonGenerator.blockToCode(particle_base);
    generatedCode.value = code;
    update_particle(props.selected_particle, code);

    console.log(Blockly.serialization.workspaces.save(Blockly.getMainWorkspace()));
  });

  loadWorkspace(props.selected_particle);
});

const generatedCode = ref(""); // For debugging purposes
</script>

<template>
  <pre class="absolute top-0 left-0 z-10 m-4 p-4 bg-slate-400 rounded-xl">{{ generatedCode }}</pre>
  <div class="w-full m-4 bg-slate-600/50 rounded-xl box-content overflow-clip">
    <div class="w-full h-full" id="blocklyDiv"></div>
  </div>
</template>
