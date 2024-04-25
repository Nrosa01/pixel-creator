<script>
  import { onMount } from "svelte";
  import wasm from "../assets/app.wasm?url";
  import loader from "../assets/wasm_helpers/mq_gl.js?url";
  import sapp_utils from "../assets/wasm_helpers/sapp_jsutils.js?url";
  import { loadScript } from "../assets/utils.js";
  import sand from "../assets/particles/sand.json";
  import replicant from "../assets/particles/replicant.json";
  import empty from "../assets/particles/empty.json";
  import ParticleModel from "../assets/models/particle.js";
  import ParticleButtons from "./ParticleButtons.svelte";
  import Blockly from "./Blockly.svelte";

  onMount(async () => {
    await loadScript(loader);
    await loadScript(sapp_utils);
    await load(wasm);
    add_particle(new ParticleModel("Empty", empty));
    add_particle(new ParticleModel("Sand", sand));
    add_particle(new ParticleModel("Replicant", replicant));
    wasm_exports.resize_simulation(js_object(Math.round(current_size).toString()));
    console.log(particle_array);
  });

  function add_particle(particle) {
    consume_js_object(wasm_exports.receive_json_plugin(js_object(JSON.stringify(particle.data))));
    particle_array = [...particle_array, particle];
  }

  let paused = false;
  var current_size = 150;
  let performance_mode = false;
  let is_editor_open = false;

  let button_class = "bg-slate-200 border-2 border-black  hover:bg-slate-300 hover:scale-105  font-semibold py-1 px-2 rounded sm:grow-0 grow";
  let dropdown = "bg-slate-200 border-2 border-black  hover:bg-slate-300 hover:scale-105  font-semibold py-1 px-2 rounded sm:grow-0 grow";

  let particle_array = [];

  function toggle_pause() {
    console.log("Pause button clicked");
    paused = !paused;
    wasm_exports.pause(js_object(paused.toString()));
  }

  function clear() {
    console.log("Clear button clicked");
    wasm_exports.clear();
  }

  function load_state() {
    console.log("Load button clicked");
  }

  function save() {
    console.log("Save button clicked");
  }

  function openEditor() {
    console.log("Open editor button clicked");
    is_editor_open = !is_editor_open;
  }

  function lerp(a, b, t) {
    return a + (b - a) * t;
  }

  // Resizes the simulation to the given size during the given duration interpolating between the current size and the target size.
  async function resize_simulation(previous_size, new_size, duration) {
    console.log("Resizing simulation to:", new_size, "during:", duration);

    var start = Date.now();
    var end = start + duration;
    var current = previous_size;

    while (Date.now() < end) {
      var t = (Date.now() - start) / duration;
      var value = lerp(current, new_size, t);
      wasm_exports.resize_simulation(js_object(Math.round(value).toString()));
      await new Promise((r) => setTimeout(r, 1000 / 60));
    }

    wasm_exports.resize_simulation(js_object(Math.round(new_size).toString()));
    current_size = new_size;
  }

  function handleNewSizeChange(event) {
    if (!performance_mode) {
      var new_size = parseInt(event.target.value);
      resize_simulation(current_size, new_size, 1000);
    } else {
      wasm_exports.resize_simulation(js_object(event.target.value));
    }
  }

  function toggle_performance_mode() {
    console.log("Performance button clicked");
    performance_mode = !performance_mode;
  }
</script>

<div class="flex flex-row">
  <div class="h-screen w-screen flex {is_editor_open ? 'flex-row lg:flex-col' : 'flex-col lg:flex-row '} justify-center items-center py-8 gap-8">
    <div class="aspect-square {is_editor_open ? 'max-w-[40vmin]' : 'w-[90vmin]'} lg:ml-8 bg-slate-600 border-2 border-black">
      <canvas class="w-full h-full cursor-none" id="glcanvas"></canvas>
    </div>

    <div class="flex flex-col h-full lg:w-[40vw] w-[98vw] px-8 lg:px-0 lg:pr-8">
      <div class="flex gap-2 flex-wrap justify-between items-center bg-slate-600/50 rounded-xl mb-4 p-2">
        <div class="flex gap-2 flex-wrap justify-start items-center grow">
          <button class="{button_class}" on:click="{toggle_pause}">
            {#if paused}
              <i class="ph-duotone ph-play"></i>
            {:else}
              <i class="ph-duotone ph-pause"></i>
            {/if}
          </button>
          <button class="{button_class}" title="Clear all the particles" on:click="{clear}"><i class="ph-duotone ph-broom"></i></button>
          <button class="{button_class}" title="Save the current state of the simulation as a file" on:click="{save}"><i class="ph-duotone ph-floppy-disk"></i></button>
          <button class="{button_class}" title="Load a state from disk" on:click="{load_state}"><i class="ph-duotone ph-upload"></i></button>
          <button class="{button_class} transition-colors {!performance_mode ? 'text-red-500' : ''}" title="Toggle performance mode. Performance mode disables realtime particle editing updates and animations when resizing the world" on:click="{toggle_performance_mode}"
            ><i class="ph-duotone ph-fire"></i></button>

          <select title="Change the simulation size. Tiny is 75*75, normal 150*150 and big is 300*300" class="{dropdown}" on:change="{handleNewSizeChange}">
            <option value="75">Tiny</option>
            <option value="150" selected>Normal</option>
            <option value="300">Big</option>
          </select>
        </div>

        <button title="Open particle editor" class="{button_class} whitespace-nowrap sm:grow-0 grow" on:click="{openEditor}">Open editor</button>
      </div>
      <ParticleButtons {particle_array} {is_editor_open} />
      <!-- <Blockly {particle_array} {is_editor_open} /> -->
    </div>
  </div>

  <Blockly {particle_array} {is_editor_open}></Blockly>
</div>
