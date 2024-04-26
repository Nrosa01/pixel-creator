<script setup>
import { ref } from "vue";
import ParticleModel from "../assets/models/particle.js";

const props = defineProps({
  particle_array: Array,
  is_editor_open: Boolean,
});

let buttonClass = "bg-slate-200 border-2 border-black  hover:bg-slate-300 hover:scale-105  font-semibold py-1 px-2 rounded sm:grow-0 grow";
let selected = ref(1);

function selectParticle(particleId) {
  console.log("Particle selected:", particleId);
  selected.value = particleId;
  wasm_exports.select_particle(js_object(particleId.toString()));
}

function removeSelected() {
  console.log("Remove selected particle");
  wasm_exports.remove_plugin(js_object(selected.value.toString()));
  props.particle_array.splice(selected.value, 1);

  // Just making sure we don't go out of bounds
  if (selected.value >= props.particle_array.length) {
    selected.value = props.particle_array.length - 1;
  }
}

function add() {
  var newParticle = ParticleModel.create();
  console.log("Add new particle", newParticle);
  props.particle_array.push(newParticle);
  wasm_exports.receive_json_plugin(js_object(JSON.stringify(newParticle.data)));
}
</script>

<template>
  <div class="flex flex-wrap w-full grow gap-2 items-start bg-slate-600/50 rounded-xl p-2 content-start h-full" v-auto-animate>
    <button v-for="(particle, i) in particle_array" :key="particle.data.name" class="border-2 border-black hover:bg-slate-300 hover:scale-105 font-semibold py-1 px-2 rounded" :class="selected == i ? 'border-white font-extrabold text-white stroke-slate-900 stroke-4' : ''" :style="`background-color: rgb(${particle.data.color.join(',')});`" @click="selectParticle(i)">
      <span :class="selected == i ? 'drop-shadow-[0_1.2px_1.2px_rgba(0,0,0,0.8)]' : ''">{{ particle.display_name }}</span>
    </button>
    <button :class="buttonClass + ' font-black'" title="Add a new particle" @click="add">+</button>
    <button :class="buttonClass + (selected == 0 ? ' brightness-50' : '') + ' font-black'" :disabled="selected == 0" title="Remove selected particle" @click="removeSelected">-</button>
  </div>
</template>
