import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useSimulationStore = defineStore("simulation", () => {
    const particle_array = ref([])
    const selected_particle = ref(1)

    const addParticle = (particle) => {
        particle_array.value.push(particle)
    }

    const removeParticle = (index) => {
        particle_array.value.splice(index, 1)

        selected_particle.value = Math.min(selected_particle.value, particle_array.value.length - 1);
    }

    const removeSelectedParticle = () => {
        removeParticle(selected_particle.value)
    }

    const selectParticle = (index) => {
        selected_particle.value = index
    }

    return {
        particle_array,
        selected_particle,
        addParticle,
        removeParticle,
        removeSelectedParticle,
        selectParticle
    }
})