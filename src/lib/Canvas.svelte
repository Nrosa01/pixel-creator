<script>
  import { onMount } from "svelte";
  import wasm from "../assets/app.wasm?url";
  import loader from "../assets/wasm_helpers/mq_gl.js?url";
  import sapp_utils from "../assets/wasm_helpers/sapp_jsutils.js?url";
  import { loadScript } from "../assets/utils.js";
  import sand from "../assets/particles/sand.json";
  import replicant from "../assets/particles/replicant.json";

  onMount(async () => {
    await loadScript(loader);
    await loadScript(sapp_utils);
    await load(wasm);
    consume_js_object(wasm_exports.receive_json_plugin(js_object(JSON.stringify(sand))))
    consume_js_object(wasm_exports.receive_json_plugin(js_object(JSON.stringify(replicant))))
  });

  function pause() {
    console.log('Pause button clicked');
  }

  function clear() {
    console.log('Clear button clicked');
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

  function handleSelectChange(event) {
    console.log('User selected:', event.target.value);
  }
</script>

<div class="place-items-center h-[100vh] justify-center bg-slate-600 grid grid-cols-2">
  <div class="aspect-square h-[95%] bg-black">
    <canvas class="w-full h-full cursor-none" id="glcanvas"></canvas>
  </div>

  <div class="grid grid-rows-2 w-full h-[95%] py-4 bg-white">
    <div class="flex justify-around items-center bg-slate-400 pr-4">
      <button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" on:click={pause}>Pause</button>
      <button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" on:click={clear}>Clear</button>
      <button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" on:click={load_state}>Load</button>
      <button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" on:click={save}>Save</button>
      <button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" on:click={openEditor}>Open editor</button>

      <select class="dropdown" on:change={handleSelectChange}>
        <option value="tiny">Tiny</option>
        <option value="normal">Normal</option>
        <option value="big">Big</option>
      </select>
    </div>

    <div class="flex justify-around items-center h-max bg-yellow-100">
      <p>texto</p>
        
    </div>
  </div>
</div>