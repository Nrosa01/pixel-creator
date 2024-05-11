<script setup>
import { ref, computed, watch, onMounted, onUnmounted } from "vue";
import { useSound } from "@vueuse/sound";
import slider from "../assets/sounds/hover.wav";

const { play: playSlider } = useSound(slider, { volume: 0.5, interrupt: false });
const value = ref(24);
let canvas = document.getElementById("glcanvas");

const brush_size = computed(() => {
    let diagonal = canvas.width * Math.sqrt(2);
    let maxRadius = diagonal / 2;
    let fraction = value.value / 100;
    let radius = Math.pow(fraction, 2) * maxRadius;
    let minRadius = 10; // This is the minimum radius of the brush at wich we can paint
    radius = Math.max(minRadius, radius);
    return Math.round(radius);
});

const thumbSize = computed(() => {
    let minSize = 15;
    let maxSize = 30;
    let size = ((value.value / 100) * (maxSize - minSize)) + minSize;
    return Math.round(size) + 'px';
});

let sliderValueChangeTimer = null;

watch(brush_size, (newSize) => {
    const delta = Math.max(-1, Math.min(1, brush_size.value - value.value));

    // If a timer is already running, don't start another one
    if (sliderValueChangeTimer) return;

    // Start a timer to play the slider after 75ms
    sliderValueChangeTimer = setTimeout(() => {
        playSlider({ playbackRate: delta > 0 ? 0.8 : 0.75 });

        // Clear the timer
        sliderValueChangeTimer = null;
    }, 15)

    wasm_exports.set_brush_size(js_object(newSize.toString()));
});

function onWheel(event) {
    const sensitivity = 2.5;
    let valueInt = parseInt(value.value);
    let newValue = valueInt + (event.deltaY > 0 ? -sensitivity : sensitivity);
    value.value = Math.min(100, Math.max(1, newValue));
}

onMounted(() => {
    let glcanvas = document.getElementById("glcanvas");
    glcanvas.addEventListener("wheel", onWheel)
    value.value = 25;
});
onUnmounted(() => {
    let glcanvas = document.getElementById("glcanvas");
    glcanvas.removeEventListener("wheel", onWheel)})

</script>

<style scoped>
.slider {
    -webkit-appearance: none;
    appearance: none;
    height: 0.5rem;
    background: #d3d3d3;
    outline: none;
    opacity: 0.7;
    -webkit-transition: .2s;
    transition: opacity .2s;
}

.slider::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: v-bind(thumbSize);
    height: v-bind(thumbSize);
    border-radius: 50%;
    background: #97a2b1;
    border: 2px solid #000000;
    cursor: pointer;
}

.slider::-moz-range-thumb {
    width: v-bind(thumbSize);
    height: v-bind(thumbSize);
    border-radius: 50%;
    background: #97a2b1;
    border: 2px solid #000000;
    cursor: pointer;
}
</style>

<template>
    <input type="range" min="1" max="100" v-model="value" class="slider">
</template>