<script setup>
import { onMounted, ref } from "vue";
import ParticleModel from "../assets/models/particle.js";
import * as Blockly from "blockly";
import { watch } from "vue";
import { blocks } from "../assets/blockly/blocks/json";
import { jsonGenerator } from "../assets/blockly/generators/json";
import { save, load } from "../assets/blockly/serialization";
import { toolbox } from "../assets/blockly/toolbox";
import "../assets/blockly/renderers/renderer.js";

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
      if (prevSelection !== undefined && prevSelection <  particleArrayLength) saveWorkspace(prevSelection);
      if (selection !== undefined) loadWorkspace(selection);
    }
    else if (particleArrayLength !== prevParticleArrayLength) {
      // console.log("Particle array length changed", particleArrayLength);
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

function update_particle(index, data)
{
  props.particle_array[index].update_data(JSON.parse(data));
}

onMounted(() => {
  console.log("Blockly mounted");

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
  if (e.isUiEvent || e.type == Blockly.Events.FINISHED_LOADING ||
    ws.isDragging()) {
    return;
  }

  console.log("Workspace changed");
  const code = jsonGenerator.workspaceToCode(ws);
  // To parse the data we first need to use JSON.parse, but we have to be careful, there can be a trailing comma at the last element of the object
  const sanitized_data = code.replace(/,\s*([\]}])/g, "$1");
  generatedCode.value = sanitized_data;
  update_particle(props.selected_particle, sanitized_data);
});

  loadWorkspace(props.selected_particle);
});

const generatedCode = ref(""); // For debugging purposes
</script>

<template>
  <!-- <pre>{{ generatedCode }}</pre> -->
  <div class="w-full m-4 bg-slate-600/50 rounded-xl box-content overflow-clip">
    <div class="w-full h-full" id="blocklyDiv"></div>
  </div>
</template>
