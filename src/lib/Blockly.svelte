<script>
  import { onMount } from "svelte";
  import ParticleModel from "../assets/models/particle.js";
  export let particle_array = [];
  export let is_editor_open = false;
  import * as Blockly from "blockly";

  import { blocks } from "../assets/blockly/blocks/json";
  import { jsonGenerator } from "../assets/blockly/generators/json";
  import { save, load } from "../assets/blockly/serialization";
  import { toolbox } from "../assets/blockly/toolbox";
  import "../assets/blockly/renderers/renderer.js";

  //let blockly_div = null;

  onMount(() => {
    console.log("Blockly mounted");

    Blockly.common.defineBlocks(blocks);

    const blocklyDiv = document.getElementById("blocklyDiv");
    const ws = Blockly.inject(blocklyDiv, {
      renderer: "Zelos",
      toolbox,
    });

    // load(ws);
  });
</script>

<div class="flex w-full flex-wrap gap-2 items-start bg-slate-600/50 rounded-xl content-start {is_editor_open ? "" : "hidden"} overflow-clip">
    <div class="w-full h-full {is_editor_open ? '' : 'hidden'}" id="blocklyDiv"></div>
</div>  