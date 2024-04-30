
register_plugin = function (importObject) {
    importObject.env.send_to_js = function (js_object) {
        console.log(consume_js_object(js_object));
    }
}

miniquad_add_plugin({ register_plugin, version: "1.0.0", name: "pixel_creator_api" });
