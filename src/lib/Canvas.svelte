<script>
  import { onMount } from "svelte";
  import wasm from "../assets/app.wasm?url";
  import loader from "../assets/wasm_helpers/mq_gl.js?url";
  import sapp_utils from "../assets/wasm_helpers/sapp_jsutils.js?url";
  import { loadScript } from "../assets/utils.js";
  import sand from "../assets/particles/sand.json";
  import replicant from "../assets/particles/replicant.json";
  import empty from "../assets/particles/empty.json";

  onMount(async () => {
    await loadScript(loader);
    await loadScript(sapp_utils);
    await load(wasm);
    consume_js_object(wasm_exports.receive_json_plugin(js_object(JSON.stringify(sand))))
    consume_js_object(wasm_exports.receive_json_plugin(js_object(JSON.stringify(replicant))))
    consume_js_object(wasm_exports.receive_json_plugin(js_object(JSON.stringify(empty))))
  });

  let paused = false;
  var current_size = 300;
  var performance_mode = false;

  function toggle_pause() {
    console.log('Pause button clicked');
    paused = !paused;
    wasm_exports.pause(js_object(paused.toString()));
  }

  function clear() {
    console.log('Clear button clicked');
    wasm_exports.clear();
  }

  function load_state() {
    console.log('Load button clicked');
  }

  function save() {
    console.log('Save button clicked');
  }

  function openEditor() {
    console.log('Open editor button clicked');
  }

  function lerp(a, b, t) {
    return a + (b - a) * t;
  }

  // Resizes the simulation to the given size during the given duration interpolating between the current size and the target size.
  async function resize_simulation(previous_size, new_size, duration) {
    console.log('Resizing simulation to:', new_size, 'during:', duration);

    var start = Date.now();
    var end = start + duration;
    var current = previous_size;

    while (Date.now() < end) {
      var t = (Date.now() - start) / duration;
      var value = lerp(current, new_size, t);
      wasm_exports.resize_simulation(js_object(Math.round(value).toString()));
      await new Promise(r => setTimeout(r, 1000 / 60));
    }
    
    wasm_exports.resize_simulation(js_object(Math.round(new_size).toString()));
    current_size = new_size;
  }

  function handleNewSizeChange(event) {
    if (!performance_mode) {
      var new_size = parseInt(event.target.value);
      resize_simulation(current_size, new_size, 1000);
    }
    else{
      wasm_exports.resize_simulation(js_object(event.target.value));
    }
  }

  function toggle_performance_mode() {
    console.log('Performance button clicked');
    performance_mode = !performance_mode;
  }
</script>

<div class="place-items-center h-[100vh] justify-center bg-slate-600 grid grid-cols-2">
  <div class="aspect-square h-[95%] bg-black">
    <canvas class="w-full h-full cursor-none" id="glcanvas"></canvas>
  </div>

  <div class="grid grid-rows-2 w-full h-[95%] py-4 bg-white">
    <div class="flex justify-around items-center bg-slate-400 pr-4">
      <button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" on:click={toggle_pause}>
        {paused ? "Play" : "Pause"}
      </button>
      <button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" on:click={clear}>Clear</button>
      <button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" on:click={load_state}>Load</button>
      <button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" on:click={save}>Save</button>
      <button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" on:click={openEditor}>Open editor</button>
      <button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" on:click={toggle_performance_mode}>Performance</button>

      <select class="dropdown" on:change={handleNewSizeChange}>
        <option value="75">Tiny</option>
        <option value="150">Normal</option>
        <option value="300" selected>Big</option>
      </select>
    </div>

    <div class="flex justify-around items-center h-max bg-yellow-100">
      <p>texto</p>
        
    </div>
  </div>
</div>