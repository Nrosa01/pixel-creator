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
    // wait one second
    await new Promise((resolve) => setTimeout(resolve, 1000));
    console.log(wasm_exports);
    console.log(consume_js_object(wasm_exports.receive_json_plugin(js_object('{"name":"John", "age":30, "car":null}'))))
    console.log(consume_js_object(wasm_exports.receive_json_plugin(js_object(JSON.stringify(sand)))))
    console.log(consume_js_object(wasm_exports.receive_json_plugin(js_object(JSON.stringify(replicant)))))
  });
</script>

<div class="bg-black">
  <canvas class="w-full h-full" id="glcanvas"></canvas>
</div>
