<script setup>
import { ref } from "vue";
import { useSound } from "@vueuse/sound";
import click from "../assets/sounds/add_particle.wav";
import slider from "../assets/sounds/hover.wav";

const playbackRate = ref(1.0);
const { play } = useSound(click, { volume: 0.5, playbackRate, interrupt: false });
const { play: playSlider } = useSound(slider, { volume: 0.5, interrupt: false });

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

  // Ignore if the mouse is outside the canvas
  if (x < 0 || y < 0 || x > rect.width || y > rect.height) return 1.0;

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

const pitchStrategy = gridPitchStrategy;

const onMouseMove = (event) => {
  playbackRate.value = pitchStrategy(event, canvas.value);
};

const onMouseDown = () => {
  if (timer) return; // Don't start multiple timers
  timer = setInterval(play, 75); // Play sound every 75ms
  canvas.value.addEventListener("mousemove", onMouseMove); // Listen to mouse move events
};

const onMouseUp = () => {
  clearInterval(timer); // Stop playing sound
  canvas.value.removeEventListener("mousemove", onMouseMove); // Stop listening to mouse move events
  timer = null;
};

const onMouseOut = () => {
  onMouseUp();

  if (typeof wasm_exports !== "undefined") {
    wasm_exports.set_mouse_hidden(js_object("true"));
  }
};

const onMouseEnter = () => {
  if (typeof wasm_exports !== "undefined") {
    wasm_exports.set_mouse_hidden(js_object("false"));
  }
};

let mouseWheelTimer = null;

const onMouseWheel = (event) => {
  const delta = Math.max(-1, Math.min(1, event.deltaY));

  // If a timer is already running, don't start another one
  if (mouseWheelTimer) return;

  // Start a timer to play the slider after 75ms
  mouseWheelTimer = setTimeout(() => {
    playSlider({ playbackRate: delta > 0 ? 0.8 : 0.75 });

    // Clear the timer
    mouseWheelTimer = null;
  }, 15);
};
</script>

<template>
  <canvas ref="canvas" @wheel="onMouseWheel" @mousedown="onMouseDown" @mouseup="onMouseUp" @mouseout="onMouseOut" @mouseenter="onMouseEnter" class="cursor-none sticky top-0 box-border z-10 w-full touch-pinch-zoom border-black border-2" id="glcanvas" height="800" width="800"></canvas>
</template>
