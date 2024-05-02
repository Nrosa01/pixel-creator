<script setup>
import { ref } from "vue";

const paused = ref(false);
const performance_mode = ref(false);
const buttonClass = ref("bg-slate-200 border-2 border-black  hover:bg-slate-300 hover:scale-105  font-semibold py-1 px-2 rounded sm:grow-0 grow");
const dropdown = ref("bg-slate-200 border-2 border-black  hover:bg-slate-300 hover:scale-105  font-semibold py-1 px-2 rounded sm:grow-0 grow");
import { useSound } from "@vueuse/sound";
import click from "../assets/sounds/select.wav";
import hover from "../assets/sounds/hover.wav";
import { useSimulationStore } from "../stores/simulation";
import BlockDialog from "./BlockDialog.vue";

const { play } = useSound(click, { volume: 0.5, interrupt: true });
const { play: playHover } = useSound(hover, { volume: 0.5, interrupt: false });
const store = useSimulationStore();
const modal = ref(null);

function togglePause() {
  paused.value = !paused.value;
  wasm_exports.pause(js_object(paused.value.toString()));
  play();
}

function clear() {
  wasm_exports.clear();
  play();
}

function loadState() {
  store.loadFromFile();

  play();
}

function save() {
  store.saveToFile("particles.json");
  play();
}

function lerp(a, b, t) {
  return a + (b - a) * t;
}

// Resizes the simulation to the given size during the given duration interpolating between the current size and the target size.
async function resize_simulation(previous_size, new_size, duration) {

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
  store.canvas_size = new_size;
}

function handleNewSizeChange(event) {
  if (!performance_mode.value) {
    var new_size = parseInt(event.target.value);
    resize_simulation(store.canvas_size, new_size, 1000);
  } else {
    wasm_exports.resize_simulation(js_object(event.target.value));
  }
}

function togglePerformanceMode() {
  performance_mode.value = !performance_mode.value;
  play();
}

function playHoverSound() {
  if (Howler.ctx.state !== "suspended") {
    playHover();
  }
}

function showModal() {
  modal.value.showModal();
}
</script>

<template>
  <div class="flex w-full gap-2 flex-wrap justify-between items-center bg-slate-600/50 rounded-xl mb-4 p-2">
      <div class="flex gap-2 flex-wrap justify-start items-center grow">
        <button @mouseenter="playHoverSound" :class="buttonClass" @click="togglePause">
          <i :class="['ph-duotone', paused ? 'ph-play' : 'ph-pause']"></i>
        </button>
        <button @mouseenter="playHoverSound" :class="buttonClass" title="Clear all the particles" @click="clear"><i
            class="ph-duotone ph-broom"></i></button>
        <button @mouseenter="playHoverSound" :class="buttonClass"
          title="Save the current state of the simulation as a file" @click="save"><i
            class="ph-duotone ph-floppy-disk"></i></button>
        <button @mouseenter="playHoverSound" :class="buttonClass" title="Load a state from disk" @click="loadState"><i
            class="ph-duotone ph-upload"></i></button>
        <button @mouseenter="playHoverSound"
          :class="buttonClass + ' transition-colors' + (performance_mode ? ' text-red-500' : '')"
          title="Toggle performance mode. Performance mode disables realtime particle editing updates and animations when resizing the world"
          @click="togglePerformanceMode"><i class="ph-duotone ph-fire"></i></button>

        <select @mouseenter="playHoverSound" @click="play"
          title="Change the simulation size. Tiny is 75*75, normal 150*150 and big is 300*300" :class="dropdown"
          @change="handleNewSizeChange">
          <option value="75">Tiny</option>
          <option value="150" selected>Normal</option>
          <option value="300">Big</option>
        </select>
      </div>

      <button @mouseenter="playHoverSound" :class="buttonClass" title="Clear all the particles" @click="showModal"><i class="text-orange-400 ph-duotone ph-question"></i></button>
  </div>
  <BlockDialog ref="modal" @click="showModal"></BlockDialog>
</template>
