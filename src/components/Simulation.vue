<script setup>
import { computed, onUnmounted, ref } from "vue";
import { onMounted } from "vue";
import ParticleButtons from "./ParticleButtons.vue";
import Blockly from "./Blockly.vue";
import CanvasControls from "./CanvasControls.vue";
import Canvas from "./Canvas.vue";
import { useSimulationStore } from "../stores/simulation";

onMounted(async () => {
  wasm_exports.resize_simulation(js_object(Math.round(store.canvas_size).toString()));

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
