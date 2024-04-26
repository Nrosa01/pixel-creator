class ParticleModel {
    static count = 0;

    constructor(display_name, data) {
        this.display_name = display_name;
        this.data = data;
        this.blockly_workspace = null;
    }

    static create() {
        ParticleModel.count++;
        var data = {
            "name": ParticleModel.count.toString(),
            "version": "1.0.0",
            "color": Array(3).fill().map(() => Math.floor(Math.random() * 256)),
            "alpha": [0.95, 1],
            "update": []
        }
        return new ParticleModel("New Particle", data);
    }
}

export default ParticleModel;