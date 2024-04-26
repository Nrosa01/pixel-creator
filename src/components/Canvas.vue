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
});

onUnmounted(() => {
  window.removeEventListener("resize", handleResize);
});

function add_particle(particle) {
  consume_js_object(wasm_exports.receive_json_plugin(js_object(JSON.stringify(particle.data))));
  particle_array.value.push(particle);
}

const paused = ref(false);
const current_size = ref(150);
const performance_mode = ref(false);
const buttonClass = ref("bg-slate-200 border-2 border-black  hover:bg-slate-300 hover:scale-105  font-semibold py-1 px-2 rounded sm:grow-0 grow");
const dropdown = ref("bg-slate-200 border-2 border-black  hover:bg-slate-300 hover:scale-105  font-semibold py-1 px-2 rounded sm:grow-0 grow");
const particle_array = ref([]);

const windowWidth = ref(window.innerWidth);

const isDesktop = computed(() => windowWidth.value > 1024);

const handleResize = () => {
  windowWidth.value = window.innerWidth;
};

function togglePause() {
  console.log("Pause button clicked");
  paused.value = !paused.value;
  wasm_exports.pause(js_object(paused.value.toString()));
}

function clear() {
  console.log("Clear button clicked");
  wasm_exports.clear();
}

function loadState() {
  console.log("Load button clicked");
}

function save() {
  console.log("Save button clicked");
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
  current_size.value = new_size;
}

function handleNewSizeChange(event) {
  if (!performance_mode.value) {
    var new_size = parseInt(event.target.value);
    resize_simulation(current_size.value, new_size, 1000);
  } else {
    wasm_exports.resize_simulation(js_object(event.target.value));
  }
}

function togglePerformanceMode() {
  console.log("Performance button clicked");
  performance_mode.value = !performance_mode.value;
}
</script>

<template>
  <div class="flex flex-row max-h-screen">
    <div class="antialiased box-border relative h-screen max-h-screen shrink-0 p-4 overflow-auto" :class="isDesktop ? 'w-[80vmin]' : 'w-full'">
      <canvas class="sticky top-0 box-border z-10 w-full touch-pinch-zoom border-black border-2" id="glcanvas" height="1200" width="1200"></canvas>
      <div class="flex flex-col w-full pt-4 items-center px-0">
        <div class="flex w-full gap-2 flex-wrap justify-between items-center bg-slate-600/50 rounded-xl mb-4 p-2">
          <div class="flex gap-2 flex-wrap justify-start items-center grow">
            <button :class="buttonClass" @click="togglePause">
              <i :class="['ph-duotone', paused ? 'ph-play' : 'ph-pause']"></i>
            </button>
            <button :class="buttonClass" title="Clear all the particles" @click="clear"><i class="ph-duotone ph-broom"></i></button>
            <button :class="buttonClass" title="Save the current state of the simulation as a file" @click="save"><i class="ph-duotone ph-floppy-disk"></i></button>
            <button :class="buttonClass" title="Load a state from disk" @click="loadState"><i class="ph-duotone ph-upload"></i></button>
            <button :class="buttonClass + ' transition-colors' + (performance_mode ? ' text-red-500' : '')" title="Toggle performance mode. Performance mode disables realtime particle editing updates and animations when resizing the world" @click="togglePerformanceMode"><i class="ph-duotone ph-fire"></i></button>

            <select title="Change the simulation size. Tiny is 75*75, normal 150*150 and big is 300*300" :class="dropdown" @change="handleNewSizeChange">
              <option value="75">Tiny</option>
              <option value="150" selected>Normal</option>
              <option value="300">Big</option>
            </select>
          </div>
        </div>
        <ParticleButtons v-model:particle_array="particle_array" />

        <p v-if="!isDesktop" class="text-2xl font-bold text-red-500 py-2">Use a bigger screen to edit particles</p>
      </div>
    </div>
    <Blockly v-if="isDesktop" v-model:particle_array="particle_array"></Blockly>
  </div>
</template>
