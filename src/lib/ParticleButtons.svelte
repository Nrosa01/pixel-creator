<script>
  import ParticleModel from "../assets/models/particle.js";
  export let particle_array = [];
  export let is_editor_open = false;

  let button_class = "bg-slate-200 border-2 border-black  hover:bg-slate-300 hover:scale-105  font-semibold py-1 px-2 rounded sm:grow-0 grow";
  let selected = 1;

  function select_particle(particle_id) {
    console.log("Particle selected:", particle_id);
    selected = particle_id;
    wasm_exports.select_particle(js_object(particle_id.toString()));
  }

  function remove_selected() {
    console.log("Remove selected particle");
    wasm_exports.remove_plugin(js_object(selected.toString()));
    particle_array = particle_array.filter((_, i) => i != selected);
    
    // Just making sure we don't go out of bounds
    if (selected >= particle_array.length) {
      selected = particle_array.length - 1;
    }
  }

  function add() {
    var new_particle = ParticleModel.create();
    console.log("Add new particle", new_particle);
    particle_array = [...particle_array, new_particle];
    wasm_exports.receive_json_plugin(js_object(JSON.stringify(new_particle.data)));
  }

  function add_particle(particle) {
    consume_js_object(wasm_exports.receive_json_plugin(js_object(JSON.stringify(particle.data))));
    particle_array = [...particle_array, particle];
  }
</script>

<div class="flex flex-wrap gap-2 items-start bg-slate-600/50 rounded-xl p-2 content-start {is_editor_open ? "" : "h-full"}">
  {#each particle_array as particle, i}
    <button class="border-2 border-black hover:bg-slate-300 hover:scale-105 font-semibold py-1 px-2 rounded {selected == i ? 'border-white font-extrabold text-white stroke-slate-900 stroke-4' : ''}" 
    style="background-color: rgb({particle.data.color.join(',')});" on:click="{() => select_particle(i)}"
      ><span class="{selected == i ? 'drop-shadow-[0_1.2px_1.2px_rgba(0,0,0,0.8)]' : ''}">{particle.display_name}</span></button>
  {/each}
  <button class="{button_class} font-black" title="Add a new particle" on:click="{add}">+</button>
  <button class="{button_class} {selected == 0 ? 'brightness-50' : ''} font-black" disabled="{selected == 0}" title="Remove selected particle" on:click="{remove_selected}">-</button>
</div>
