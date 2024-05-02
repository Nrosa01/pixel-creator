<script setup>
import { ref } from "vue";
import { useSound } from "@vueuse/sound";
import click from "../assets/sounds/select.wav";
import * as Blockly from "blockly";

const { play } = useSound(click, { volume: 0.5, interrupt: true });

defineExpose({
    showModal,
    closeModal
});

function showModal() {
    // Check if modal is already open
    if (modal.value.open) return;

    modal.value.showModal();
    play({ playbackRate: 1 });
}

function closeModal() {
    play({ playbackRate: 1.5 });
}

const modal = ref(null);
</script>

<template>
    <dialog @close="closeModal" ref="modal" class="backdrop:backdrop-blur-sm backdrop:backdrop-brightness-75 rounded-xl px-4 py-1">
        <div class="w-[90vmin] lg:max-h-[90vmin] max-h-[90vh]">
        sdfsf
        </div>
    </dialog>
</template>