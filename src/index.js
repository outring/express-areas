var fs = require("fs");
var path = require("path");

function registerAreas(app, areasPath, areas) {
    var loadedAreas = areas.map(function (area) {
        var areaPath = path.join(areasPath, area);
        var definitionPath = path.join(areaPath, "index.js");
        return {
            path: areaPath,
            definition: fs.existsSync(definitionPath) ? require(definitionPath) : {}
        };
    });

    loadedAreas.forEach(function (area) {
        if (typeof area.definition.register === "function") {
            area.definition.register(app);
        }
    });

    loadedAreas.forEach(function (area) {
        if (typeof area.definition.registerControllers === "function") {
            area.definition.registerControllers(app, registerControllers.bind(null, app, area.path));
        }
        else {
            registerControllers(app, area.path);
        }
    });
}

function registerControllers(app, areaPath) {
    fs.readdirSync(areaPath).forEach(function (controller) {
        var controllerPath = path.join(areaPath, controller);
        var definitionPath = path.join(controllerPath, "index.js");
        if (fs.existsSync(definitionPath)) {
            var registration = require(definitionPath);
            registration(app);
        }
    });
}

module.exports = {
    register: registerAreas
};