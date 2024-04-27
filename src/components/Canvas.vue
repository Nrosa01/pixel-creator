<script setup>
import { computed, onUnmounted, ref } from "vue";
import { onMounted } from "vue";
import wasm from "../assets/app.wasm?url";
import loader from "../assets/wasm_helpers/mq_gl.js?url";
import sapp_utils from "../assets/wasm_helpers/sapp_jsutils.js?url";
import { loadScript } from "../assets/utils.js";
import sand from "../assets/particles/sand.json";
import replicant from "../assets/particles/replicant.json";
import empty from "../assets/particles/empty.json";
import ParticleModel from "../assets/models/particle.js";
import ParticleButtons from "./ParticleButtons.vue";
import Blockly from "./Blockly.vue";
import CanvasControls from "./CanvasControls.vue";

onMounted(async () => {
  await loadScript(loader);
  await loadScript(sapp_utils);
  await load(wasm);
  add_particle(new ParticleModel("Empty", empty));
  add_particle(new ParticleModel("Sand", sand));
  add_particle(new ParticleModel("Replicant", replicant));
  wasm_exports.resize_simulation(js_object(Math.round(current_size.value).toString()));
  console.log(particle_array.value);

  window.addEventListener("resize", handleResize);

  scriptsLoaded.value = true;
});

onUnmounted(() => {
  window.removeEventListener("resize", handleResize);
});

function add_particle(particle) {
  particle_array.value.push(particle);
}

const scriptsLoaded = ref(false);
const current_size = ref(150);
const particle_array = ref([]);
const particle_buttons = ref();

const windowWidth = ref(window.innerWidth);

const isDesktop = computed(() => windowWidth.value > 1024);

const handleResize = () => {
  windowWidth.value = window.innerWidth;
};
</script>

<template>
  <div class="flex flex-row max-h-screen">
    <div class="antialiased box-border relative h-screen max-h-screen shrink-0 p-4 overflow-auto" :class="isDesktop ? 'w-[80vmin]' : 'w-full'">
      <canvas class="sticky top-0 box-border z-10 w-full touch-pinch-zoom border-black border-2" id="glcanvas" height="1200" width="1200"></canvas>

      <div class="flex flex-col w-full pt-4 items-center px-0">
        <CanvasControls />
        <ParticleButtons ref="particle_buttons" :particle_array />
        <p v-if="!isDesktop" class="text-2xl font-bold text-red-500 py-2">Use a bigger screen to edit particles</p>
      </div>
    </div>
    <Blockly v-if="isDesktop && scriptsLoaded" :particle_array :selected_particle="particle_buttons?.selected"></Blockly>
  </div>
</template>
