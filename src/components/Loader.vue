<!-- 

Everything on the app depends on sapp_jsutils.js and the wasm being loaded.

To avoid fuss and errors this component loads everything and only then renders the children, that will be the Simulation.

For this reason, loader can't use the store, the store must only be instantiated after the wasm is loaded.

One of the biggest issues when making this component was the canvas. load(wasm) requires a canvas existing, but the canvas
is inside the simulation. To fix this, I created the canvas here, then the simulation will seach it, deatch from this node and attach to 
itself. It's weird and hacky but it works.

Of couse, as the the DOM element was moved, the canvas internal size is not correct, so the Canvas component 
trigger a resize event to fix it.

This project is held up with hopes and dreams.

-->

<script setup>
import { ref } from "vue";
import { onMounted } from "vue";
import { loadScript } from "../assets/utils.js";
import wasm from "../assets/app.wasm?url";
import loader from "../assets/wasm_helpers/mq_gl.js?url";
import sapp_utils from "../assets/wasm_helpers/sapp_jsutils.js?url";
import plugins from "../assets/wasm_helpers/plugin.js?url";
import Simulation from "./Simulation.vue";

const scriptsLoaded = ref(false);

onMounted(async () => {
    await loadScript(loader);
    await loadScript(sapp_utils);
    await loadScript(plugins);
    await load(wasm);

    scriptsLoaded.value = true;
});

</script>

<template>
    <canvas class="cursor-none sticky top-0 box-border z-10 w-full touch-pinch-zoom border-slate-700 border-2 bg-black" 
        id="glcanvas" height="800" width="800"></canvas>
    <div v-if="scriptsLoaded">
        <Simulation></Simulation>
    </div>
</template>
