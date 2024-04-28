<script setup>
import { ref } from "vue";
import { useSound } from "@vueuse/sound";
import click from "../assets/sounds/click.mp3";

const playbackRate = ref(1.0);
const { play, stop } = useSound(click, { volume: 0.5, playbackRate, interrupt: false });

let timer = null;

const canvas = ref(null);

const borderPitchStrategy = (event, canvas) => {
  const rect = canvas.getBoundingClientRect();
  const xRatio = (event.clientX - rect.left) / rect.width;
  const yRatio = (event.clientY - rect.top) / rect.height;

  // Map the mouse position to a pitch
  const pitch = (xRatio + yRatio) / 2;
  return Math.min(Math.max(pitch, 0.8), 1.6); // Change pitch based on position, clamped between 0.5 and 2
};

// Using strategy because I might want to try different strategies
const pitchStrategy = borderPitchStrategy;

const onMouseMove = (event) => {
  playbackRate.value = pitchStrategy(event, canvas.value);
};

const onMouseDown = () => {
  timer = setInterval(play, 75); // Play sound every 75ms
};

const onMouseUp = () => {
  clearInterval(timer); // Stop playing sound
  timer = null;
};
</script>

<template>
  <canvas ref="canvas" @mousemove="onMouseMove" @mousedown="onMouseDown" @mouseup="onMouseUp" class="sticky top-0 box-border z-10 w-full touch-pinch-zoom border-black border-2" id="glcanvas" height="800" width="800"></canvas>
</template>
