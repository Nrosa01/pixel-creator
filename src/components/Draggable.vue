<script setup>
import { ref, onMounted, onUnmounted } from "vue";

let draggable = ref(null);
var mouse_x_offset = 0;
var mouse_y_offset = 0;
var drag_registered = false;

const mouseDown = (e) => {
  const rect = draggable.value.getBoundingClientRect();
  const child_rect = draggable.value.children[0].getBoundingClientRect();

  const isInBottomRightCorner = e.clientX >= child_rect.right - child_rect.width * 0.1 && e.clientY >= child_rect.bottom - child_rect.height * 0.1;

  if (isInBottomRightCorner) {
    return;
  }

  window.addEventListener("mousemove", divMove, true);

  drag_registered = true;

  mouse_x_offset = rect.left - e.clientX;
  mouse_y_offset = rect.top - e.clientY;

  // set cursor to grabbing
  draggable.value.style.cursor = "grabbing";
};

const mouseUp = () => {
  if (!drag_registered) {
    return;
  }

  window.removeEventListener("mousemove", divMove, true);
  draggable.value.style.cursor = "grab";
  drag_registered = false;
};

const divMove = (e) => {
  draggable.value.style.top = e.clientY + mouse_y_offset + "px";
  draggable.value.style.left = e.clientX + mouse_x_offset + "px";
};
</script>

<template>
  <div class="absolute cursor-grab" ref="draggable" @mousedown="mouseDown" @mouseup="mouseUp">
    <slot></slot>
  </div>
</template>
