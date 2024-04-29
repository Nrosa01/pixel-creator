<script setup>
import { ref } from "vue";
import ParticleModel from "../assets/models/particle.js";
import { useSound } from "@vueuse/sound";
import click from "../assets/sounds/select.wav";
import addSound from "../assets/sounds/add_particle.wav";
import remove from "../assets/sounds/eraser.wav";
import hover from "../assets/sounds/hover.wav";
import { useSimulationStore } from "../stores/simulation";

const { play } = useSound(click, { volume: 0.5 });
const { play: playAdd } = useSound(click, { volume: 0.5, playbackRate: 1.2 });
const { play: playRemove } = useSound(remove, { volume: 2 });
const { play: playHover } = useSound(hover, { volume: 0.5, interrupt: false });

const store = useSimulationStore();
let buttonClass = "bg-slate-200 border-2 border-black  hover:bg-slate-300 hover:scale-105  font-semibold py-1 px-2 rounded sm:grow-0 grow";

function selectParticle(particleId) {
  console.log("Particle selected:", particleId);
  store.selectParticle(particleId);
  wasm_exports.select_particle(js_object(particleId.toString()));

  play();
}

function removeSelected() {
  console.log("Remove selected particle");
  wasm_exports.remove_plugin(js_object(store.selected_particle.toString()));
  store.removeSelectedParticle();
  playRemove();
}

function add() {
  console.log("Adding new particle");
  store.addParticle(ParticleModel.create());
  playAdd();
}

function playHoverSound() {
  if (Howler.ctx.state !== "suspended") {
    playHover();
  }
}
</script>

<template>
  <div class="flex flex-wrap w-full grow gap-2 items-start bg-slate-600/50 rounded-xl p-2 content-start h-full" v-auto-animate>
    <button @mouseenter="playHoverSound" v-for="(particle, i) in store.particle_array" :key="particle.data.name" class="border-2 border-black hover:bg-slate-300 hover:scale-105 font-semibold py-1 px-2 rounded" :class="store.selected_particle == i ? 'border-white font-extrabold text-white stroke-slate-900 stroke-4' : ''" :style="`background-color: rgb(${particle.data.color.join(',')});`" @click="selectParticle(i)">
      <span :class="store.selected_particle == i ? 'drop-shadow-[0_1.2px_1.2px_rgba(0,0,0,0.8)]' : ''">{{ particle.display_name }}</span>
    </button>
    <button @mouseenter="playHoverSound" :class="buttonClass + ' font-black'" title="Add a new particle" @click="add">+</button>
    <button @mouseenter="playHoverSound" :class="buttonClass + (store.selected_particle == 0 ? ' brightness-50' : '') + ' font-black'" :disabled="store.selected_particle == 0" title="Remove selected particle" @click="removeSelected">-</button>
  </div>
</template>
