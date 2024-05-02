<script setup>
import { onMounted, ref } from "vue";
import { useSound } from "@vueuse/sound";
import click from "../assets/sounds/select.wav";
import { toolbox } from "../assets/blockly/toolbox";
import * as Blockly from "blockly";
import helpJSON from "../assets/jsons/block_help.json";
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

    // Iterate all workspaces and call zoomToFit
    window.dispatchEvent(new Event("resize"));

    requestAnimationFrame(() => {
        for (const ws of workspaces.value) {
            ws.zoomToFit();
        }
    });

    // Set focus to modal to avoid focusing the first block
    modal.value.focus();
}

function closeModal() {
    play({ playbackRate: 1.5 });
}

const modal = ref(null);
const workspaces = ref([]);

onMounted(() => {

    for (const block of toolbox.contents) {
        const blocklyDiv = document.getElementById("model" + block.type);
        const ws = Blockly.inject(blocklyDiv, {
            toolbox: toolbox,
            readOnly: true,
            renderer: "Zelos",
            scrollbars: false,
            move: {
                scrollbars: { horizontal: false, vertical: true },
                drag: false,
                wheel: false,
            },
            zoom: {
                controls: false,
                wheel: false,
            },
        });

        // Hidin scrollbars
        // I cant set them to false because blockly will complain
        const rect = blocklyDiv.querySelectorAll("rect");
        rect.forEach((r) => {
            r.style.display = "none";
        });

        const newBlock = ws.newBlock(block.type);
        newBlock.initSvg();
        newBlock.render();

        workspaces.value.push(ws);
        ws.zoomToFit();
    }

});

</script>

<template>
    <dialog @close="closeModal" ref="modal"
        class="backdrop:backdrop-blur-sm backdrop:backdrop-brightness-75 rounded-xl px-4 py-1">
        <div class="w-[90vmin] lg:max-h-[90vmin] max-h-[90vh]">
            <div class="w-full h-full " v-for="block in toolbox.contents" :key="block.type">
                <div class="w-full h-24 border-0" :id="'model' + block.type"></div>
                <p class="mb-8">{{ helpJSON[block.type] }}</p>
            </div>
        </div>
    </dialog>
</template>