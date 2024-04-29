<script setup>
import { ref } from "vue";
import ParticleModel from "../assets/models/particle.js";
import { useSound } from "@vueuse/sound";
import click from "../assets/sounds/select.wav";
import addSound from "../assets/sounds/add_particle.wav";
import remove from "../assets/sounds/eraser.wav";
import hover from "../assets/sounds/hover.wav";

const props = defineProps({
  particle_array: Array,
});

const { play } = useSound(click, { volume: 0.5 });
const { play: playAdd } = useSound(click, { volume: 0.5, playbackRate: 1.2 });
const { play: playRemove } = useSound(remove, { volume: 2 });
const { play: playHover } = useSound(hover, { volume: 0.5, interrupt: false });

let buttonClass = "bg-slate-200 border-2 border-black  hover:bg-slate-300 hover:scale-105  font-semibold py-1 px-2 rounded sm:grow-0 grow";
const selected = ref(1);

defineExpose({ selected });

function selectParticle(particleId) {
  console.log("Particle selected:", particleId);
  selected.value = particleId;
  wasm_exports.select_particle(js_object(particleId.toString()));

  play();
}

function removeSelected() {
  console.log("Remove selected particle");
  wasm_exports.remove_plugin(js_object(selected.value.toString()));
  props.particle_array.splice(selected.value, 1);

  // Just making sure we don't go out of bounds
  selected.value = Math.min(selected.value, props.particle_array.length - 1);
  playRemove();
}

function add() {
  var newParticle = ParticleModel.create();
  console.log("Add new particle", newParticle);
  props.particle_array.push(newParticle);
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
    <button @mouseenter="playHoverSound" v-for="(particle, i) in particle_array" :key="particle.data.name" class="border-2 border-black hover:bg-slate-300 hover:scale-105 font-semibold py-1 px-2 rounded" :class="selected == i ? 'border-white font-extrabold text-white stroke-slate-900 stroke-4' : ''" :style="`background-color: rgb(${particle.data.color.join(',')});`" @click="selectParticle(i)">
      <span :class="selected == i ? 'drop-shadow-[0_1.2px_1.2px_rgba(0,0,0,0.8)]' : ''">{{ particle.display_name }}</span>
    </button>
    <button @mouseenter="playHoverSound" :class="buttonClass + ' font-black'" title="Add a new particle" @click="add">+</button>
    <button @mouseenter="playHoverSound" :class="buttonClass + (selected == 0 ? ' brightness-50' : '') + ' font-black'" :disabled="selected == 0" title="Remove selected particle" @click="removeSelected">-</button>
  </div>
</template>
