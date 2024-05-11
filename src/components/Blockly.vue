<script setup>
import { onMounted, ref } from "vue";
import * as Blockly from "blockly";
import { blocks } from "../assets/blockly/blocks";
import { toolbox } from "../assets/blockly/toolbox";
import "../assets/blockly/renderer.js";
import { useSimulationStore } from "../stores/simulation";
import { jsonGenerator } from "../assets/blockly/generator";

import failJSON from "../assets/jsons/fails.json"
import niceJSON from "../assets/jsons/nice.json"
import baseParticles from "../assets/particles/base.json";

const store = useSimulationStore();

onMounted(() => {

  if (Blockly.Extensions.isRegistered('particle_list_extension')) {
    Blockly.Extensions.unregister('particle_list_extension');
  }

  Blockly.Extensions.register("particle_list_extension", function () {
    this.getInput("DUMMY").appendField(
      new Blockly.FieldDropdown(function () {
        return store.particle_array.map((particle, i) => [particle.display_name, i.toString()]);
      }),
      "PARTICLE"
    );

    this.setOnChange(function (changeEvent) {
      if (changeEvent.type !== 'block_field_intermediate_change' || changeEvent.name !== 'NAME') {
        return;
      }

      let block_selection = this.getField('PARTICLE').selectedOption[1];
      let current_particle = store.selected_particle.toString();
      let display_name = store.particle_array[store.selected_particle].display_name;
      if (block_selection === current_particle) {
        this.getField('PARTICLE').setValue(current_particle);
        this.getField('PARTICLE').selectedOption[0] = display_name
        this.initSvg();
        this.render();
      }
    })
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
      wheel: true,
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

    store.regenerateCode();
    store.generated_code = jsonGenerator.workspaceToCode(Blockly.getMainWorkspace())
  });

  store.loadWorkspace(store.selected_particle);
  store.blocklyLoaded = true;
  store.loadFromJSON(baseParticles);
  // store.loadFromJSON(failJSON);
  // store.loadFromJSON(niceJSON);

  // Because blockly is reeeeeally special we need to wait a frame and trick it into re render by a resize event
});

</script>

<template>
    <div class="w-full m-4 bg-slate-600/50 rounded-xl box-content overflow-clip">
      <div class="w-full h-full" id="blocklyDiv"></div>
    </div>
</template>
