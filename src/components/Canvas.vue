<script setup>
import { ref } from "vue";
import { useSound } from "@vueuse/sound";
import click from "../assets/sounds/add_particle.wav";

const playbackRate = ref(1.0);
const { play, stop } = useSound(click, { volume: 0.5, playbackRate, interrupt: false });

let timer = null;

const canvas = ref(null);

// This strategy consists on mapping the pitch to a grid of values. Then we interpolate the pitch based on the surrounding cells. ¡
// Interpolation is pondered, current cell where mouse is has a weight of 0.75, and the other 3 cells have a weight of 0.0833.
// It's kinda hardcoded but it works
const grid = Array.from({ length: 50 }, () => Array.from({ length: 50 }, () => Math.random() * 0.8 + 0.8));

const gridPitchStrategy = (event, canvas) => {
  const rect = canvas.getBoundingClientRect();
  const x = event.clientX - rect.left;
  const y = event.clientY - rect.top;

  // Calculate which cell the mouse is in. I've written this so many times I'm tired
  const cellX = Math.floor((x / rect.width) * 50);
  const cellY = Math.floor((y / rect.height) * 50);

  // Interpolate the pitch based on the pitches of the surrounding cells pondered
  const pitches = [
    { pitch: grid[cellY][cellX], weight: 0.75 },
    { pitch: grid[cellY][Math.min(cellX + 1, 49)], weight: 0.0833 },
    { pitch: grid[Math.min(cellY + 1, 49)][cellX], weight: 0.0833 },
    { pitch: grid[Math.min(cellY + 1, 49)][Math.min(cellX + 1, 49)], weight: 0.0833 },
  ];
  const pitch = pitches.reduce((a, b) => a + b.pitch * b.weight, 0); // I love functional programming
  return pitch;
};

// Pitch based on how close you are to the edge of the canvas
const borderPitchStrategy = (event, canvas) => {
  const rect = canvas.getBoundingClientRect();
  const xRatio = (event.clientX - rect.left) / rect.width;
  const yRatio = (event.clientY - rect.top) / rect.height;

  // Map the mouse position to a pitch
  const pitch = (xRatio + yRatio) / 2;
  return Math.min(Math.max(pitch, 0.8), 1.6); // Change pitch based on position, clamped between 0.5 and 2
};

const pitchStrategy = borderPitchStrategy;

const onMouseMove = (event) => {
  playbackRate.value = gridPitchStrategy(event, canvas.value);
};

const onMouseDown = () => {
  if (timer) return; // Don't start multiple timers
  timer = setInterval(play, 75); // Play sound every 75ms
  canvas.value.requestPointerLock();
};

const onMouseUp = () => {
  clearInterval(timer); // Stop playing sound
  timer = null;
    document.exitPointerLock();
};
</script>

<template>
  <canvas ref="canvas" @mousemove="onMouseMove" @mousedown="onMouseDown" @mouseup="onMouseUp" @mouseout="onMouseUp" class="sticky top-0 box-border z-10 w-full touch-pinch-zoom border-black border-2" id="glcanvas" height="800" width="800"></canvas>
</template>
