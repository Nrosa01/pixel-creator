<script setup>
import { ref } from "vue";

const current_size = ref(150);
const paused = ref(false);
const performance_mode = ref(false);
const buttonClass = ref("bg-slate-200 border-2 border-black  hover:bg-slate-300 hover:scale-105  font-semibold py-1 px-2 rounded sm:grow-0 grow");
const dropdown = ref("bg-slate-200 border-2 border-black  hover:bg-slate-300 hover:scale-105  font-semibold py-1 px-2 rounded sm:grow-0 grow");
import { useSound } from "@vueuse/sound";
import click from "../assets/sounds/select.wav";
import hover from '../assets/sounds/hover.wav';

const { play } = useSound(click, { volume: 0.5, interrupt: true });
const { play: playHover } = useSound(hover, { volume: 0.5, interrupt: false });

function togglePause() {
  console.log("Pause button clicked");
  paused.value = !paused.value;
  wasm_exports.pause(js_object(paused.value.toString()));
  play();
}

function clear() {
  console.log("Clear button clicked");
  wasm_exports.clear();
  play();
}

function loadState() {
  console.log("Load button clicked");
  play();
}

function save() {
  console.log("Save button clicked");
  play();
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

  play();
}

function togglePerformanceMode() {
  console.log("Performance button clicked");
  performance_mode.value = !performance_mode.value;
  play();
}
</script>

<template>
    <div class="flex w-full gap-2 flex-wrap justify-between items-center bg-slate-600/50 rounded-xl mb-4 p-2">
      <div class="flex gap-2 flex-wrap justify-start items-center grow">
        <button @mouseenter="playHover" :class="buttonClass" @click="togglePause">
          <i :class="['ph-duotone', paused ? 'ph-play' : 'ph-pause']"></i>
        </button>
        <button @mouseenter="playHover" :class="buttonClass" title="Clear all the particles" @click="clear"><i class="ph-duotone ph-broom"></i></button>
        <button @mouseenter="playHover" :class="buttonClass" title="Save the current state of the simulation as a file" @click="save"><i class="ph-duotone ph-floppy-disk"></i></button>
        <button @mouseenter="playHover" :class="buttonClass" title="Load a state from disk" @click="loadState"><i class="ph-duotone ph-upload"></i></button>
        <button @mouseenter="playHover" :class="buttonClass + ' transition-colors' + (performance_mode ? ' text-red-500' : '')" title="Toggle performance mode. Performance mode disables realtime particle editing updates and animations when resizing the world" @click="togglePerformanceMode"><i class="ph-duotone ph-fire"></i></button>

        <select @mouseenter="playHover" title="Change the simulation size. Tiny is 75*75, normal 150*150 and big is 300*300" :class="dropdown" @change="handleNewSizeChange">
          <option value="75">Tiny</option>
          <option value="150" selected>Normal</option>
          <option value="300">Big</option>
        </select>
      </div>
    </div>
</template>
