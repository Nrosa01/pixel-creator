<script setup>
import { onMounted, onUnmounted, ref } from "vue";
import { useSound } from "@vueuse/sound";
import click from "../assets/sounds/select.wav";
import { toolbox } from "../assets/blockly/toolbox";
import * as Blockly from "blockly";
import helpJSON from "../assets/jsons/block_help.json";
const { play } = useSound(click, { volume: 0.5, interrupt: true });

defineExpose({
    showModal
});

let blocklyMainWorkspace = null;

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

function onModalClose() {
    play({ playbackRate: 1.5 });

    // Focus is gained when tabbed on the dialog and when this component is created (mounted)
    // So we have to make absolutely sure the focus is in the main workspace or everything will break
    blocklyMainWorkspace.markFocused();
}

const modal = ref(null);
const modalInner = ref(null);
const workspaces = ref([]);

onMounted(() => {
    // We need to save the main workspace to restore it later
    // Because creating the new workspaces will change the focus and thus, the call to Blockly.getMainWorkspace()
    blocklyMainWorkspace = Blockly.getMainWorkspace();

    // Windows click eventlistener
    window.addEventListener("pointerup", pointerup);
    window.addEventListener("pointerdown", pointerdown);

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

        const getTypeFromConnectionCheck = (connection) => {
            switch (connection) {
                case "Particle":
                    return "particle";
                case "Vector":
                    return "direction";
                case "Number":
                    return "custom_field_slider";
                case "Boolean":
                    return "boolean";
                case "Group":
                    return "group_particle";
                default:
                    return undefined;
            }
        };
        
        if (block.inputs !== undefined) {
            // Iterate over all inputs
            for (const [key, value] of Object.entries(block.inputs)) {
                let input = newBlock.getInput(key);
                if (input.connection.check === null || input.connection.check.length === 0) continue;

                let childBlock = ws.newBlock(getTypeFromConnectionCheck(input.connection.check[0])); // Even if there are multiple checks, we only need the first one
                childBlock.initSvg();
                childBlock.render();

                input.connection.connect(childBlock.outputConnection);
            }
        }

        workspaces.value.push(ws);
        ws.zoomToFit();
    }

    // By doing this we avoid the focus being in the last created workspace.
    // Every workspace div container has class pointer-events-none, so they can't be focused by clicking
    blocklyMainWorkspace.markFocused();
});

onUnmounted(() => {
    window.removeEventListener("pointerup", pointerup);
    window.removeEventListener("pointerdown", pointerdown);
});


// If the user clicks inside the dialog and releases the mouse outside, the dialog should not close
// To achieve that I save whether the user clicked inside the dialog and check that in the pointerup event
let clickedInside = false;

function pointerdown(event) {
    // If the click is outside the modal, close it
    clickedInside = modal.value.open && !modalInner.value.contains(event.target)
}

function pointerup(event) {
    // If the click is outside the modal, close it
    if (modal.value.open && !modalInner.value.contains(event.target) && clickedInside) {
        modal.value.close();
    }
}

</script>

<template>
    <dialog ref="modal" @close="onModalClose"
        class="backdrop:backdrop-blur-sm backdrop:backdrop-brightness-75 rounded-xl px-4 py-1">
        <div ref="modalInner" class="w-[90vmin] lg:max-h-[90vmin] max-h-[90vh] flex flex-col">
            <form method="dialog">
                <button
                    class="w-full bg-slate-200 border-2 border-black  hover:bg-slate-300 hover:scale-[1.01]  font-semibold py-1 px-2 rounded sm:grow-0 grow mt-4"><i
                        class="ph-duotone ph-x-circle"></i>Close</button>
            </form>
            <!-- We need pointer events none to truly avoid these workspaces getting focus -->
            <div class="w-full h-full pointer-events-none" v-for="block in toolbox.contents" :key="block.type">
                <div class="w-full h-24 border-0" :id="'model' + block.type"></div>
                <p class="mb-8">{{ helpJSON[block.type] }}</p>
            </div>
            <form method="dialog">
                <button
                    class="w-full bg-slate-200 border-2 border-black  hover:bg-slate-300 hover:scale-[1.01]  font-semibold py-1 px-2 rounded sm:grow-0 grow mb-4"><i
                        class="ph-duotone ph-x-circle"></i>Close</button>
            </form>
        </div>
    </dialog>
</template>