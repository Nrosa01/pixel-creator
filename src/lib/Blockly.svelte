<script>
  import { onMount } from "svelte";
  import ParticleModel from "../assets/models/particle.js";
  export let particle_array = [];
  export let is_editor_open = false;

  onMount(async () => {
    console.log("Blockly mounted");
  });
</script>

<div class="h-full {is_editor_open ? "" : "hidden"}">
  <p>Blocky</p>
</div>
