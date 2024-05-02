class ParticleModel {
    static count = 0;
    static used_names = new Set();

    constructor(display_name, data, blockly_workspace = null) {
        // Just to be sure
        if (ParticleModel.used_names.has(data.name)) {
            // console.error("Name already in use", data.name);
            data.name = ParticleModel.createName();
        }

        ParticleModel.used_names.add(data.name);

        this.display_name = display_name;
        this.data = data;
        this.blockly_workspace = blockly_workspace;

        consume_js_object(wasm_exports.receive_json_plugin(js_object(JSON.stringify(data))));
    }

    static createName() {
        ParticleModel.count++;
        while (ParticleModel.used_names.has(`Particle ${ParticleModel.count}`)) {
            ParticleModel.count++;
        }

        return `Particle ${ParticleModel.count}`;
    }

    static create() {
        var data = {
            "name": ParticleModel.createName(),
            "version": "1.0.0",
            "color": Array(3).fill().map(() => Math.floor(Math.random() * 256)),
            "alpha": [0.95, 1],
            "update": []
        }
        
        return new ParticleModel("New Particle", data);
    }

    update_data(data) {
        // This is because we NEVER want to modify the internal name, the name we edit in blockly is used as the display name 
        this.display_name = data.name; 
        data.name = this.data.name; // So we copy the internal name to the new data
        this.data = data; // And then we update the data safely, few, this gave me quite a headache until I figured it out. If error logs were more descriptive...
        consume_js_object(wasm_exports.receive_json_plugin(js_object(JSON.stringify(data))));
    }
}

export default ParticleModel;