<script setup>
import { computed, onUnmounted, ref } from "vue";
import { onMounted } from "vue";
import wasm from "../assets/app.wasm?url";
import loader from "../assets/wasm_helpers/mq_gl.js?url";
import sapp_utils from "../assets/wasm_helpers/sapp_jsutils.js?url";
import { loadScript } from "../assets/utils.js";
import sand from "../assets/particles/sand.json";
import simplest from "../assets/particles/simplest.json";
import replicant from "../assets/particles/replicant.json";
import empty from "../assets/particles/empty.json";
import test from "../assets/particles/test.json";
import ParticleModel from "../assets/models/particle.js";
import ParticleButtons from "./ParticleButtons.vue";
import Blockly from "./Blockly.vue";
import CanvasControls from "./CanvasControls.vue";
import Canvas from "./Canvas.vue";
import { useSimulationStore } from "../stores/simulation";

onMounted(async () => {
  await loadScript(loader);
  await loadScript(sapp_utils);
  await load(wasm);
  store.addParticle(new ParticleModel("Empty", empty));
  store.addParticle(new ParticleModel("Sand", sand));
  store.addParticle(new ParticleModel("Replicant", replicant));
  store.addParticle(new ParticleModel("Simplest", simplest));
  store.addParticle(new ParticleModel("Test", test));
  wasm_exports.resize_simulation(js_object(Math.round(150).toString()));

  window.addEventListener("resize", handleResize);

  scriptsLoaded.value = true;
});

onUnmounted(() => {
  window.removeEventListener("resize", handleResize);
});

const store = useSimulationStore();

const scriptsLoaded = ref(false);
const windowWidth = ref(window.innerWidth);
const isDesktop = computed(() => windowWidth.value > 1024);

const handleResize = () => {
  windowWidth.value = window.innerWidth;
};
</script>

<template>
  <div class="flex flex-row max-h-screen">
    <div class="box-border relative h-screen max-h-screen shrink-0 p-4 overflow-auto" :class="isDesktop ? 'w-[80vmin]' : 'w-full'">
      <Canvas />
      <div class="flex flex-col w-full pt-4 items-center px-0">
        <CanvasControls />
        <ParticleButtons />
        <p v-if="!isDesktop" class="text-2xl font-bold text-red-500 py-2">Use a bigger screen to edit particles</p>
      </div>
    </div>
    <Blockly v-if="isDesktop && scriptsLoaded"></Blockly>
  </div>
</template>
