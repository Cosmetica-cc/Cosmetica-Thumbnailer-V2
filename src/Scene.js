import Axios from "axios";
import Path from "path";
import { drawScene, createScene, PoseLoader, CosmeticaPlayer } from "skinview5d";

import { __dirname } from "./Config.js";

const skinPath = Path.join(__dirname, "skin.png");
const blankSkin = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAANSURBVBhXY2BgYGAAAAAFAAGKM+MAAAAAAElFTkSuQmCC";

function getUrl(url) {
    return new Promise((resolve, reject) => {
        Axios.get(`https://api.cosmetica.cc/${url}`).then(response => {
            if (!response.data || response.status != 200) return reject();
            resolve(response.data);
        }).catch(e => {
            console.log(e);
            reject();
        })
    })
}

function getScene(subject, imageType, id, callback) {
    function matches(subjectTest, imageTypeTest, idTest) {
        return subjectTest == subject && imageTypeTest == imageType && (!idTest || idTest == id);
    }
    if (matches("player", "opengraph")) { // PLAYER OPENGRAPH
        getUrl(`v2/get/info?user=${id}`).then(async data => {
            data.panorama = `https://cosmetica.cc/page/panoramas/${data.panorama}.jpg`;
            const scene = await createScene({
                "pose": PoseLoader.poses.sprint,
                "playerRotation": [0, 0.7, 0],
                "camera": [10, 5, 30],
                "cameraPostRotation": [0, 0, 0],
                "fov": 70,
                "lights": [
                    {
                        "type": "ambient",
                        "intensity": 0.4,
                        "position": [0, 0, 0]
                    },
                    {
                        "type": "point",
                        "intensity": 0.6,
                        "position": "camera"
                    }
                ]
            }, {
                ...data,
                backEquipment: "elytra"
            });
            callback({
                image: await drawScene(scene.scene, scene.camera, 1200, 630, "image/jpeg", false, true, 3),
                type: "jpeg"
            });
            scene.dispose();
        }).catch(e => {
            console.log(e);
        });
    } else if (imageType == "icon" && ["hat", "shoulderbuddy", "backbling"].includes(subject)) { // COSMETICS THUMBNAILS
        getUrl(`get/cosmetic?type=${subject}&id=${id}`).then(async data => {
            if (!data.model) return callback(false);
            const scene = await doCosmetic(data, subject, {
                "pose": PoseLoader.poses.standing,
                "playerRotation": [0, 0, 0],
                "cameraPostRotation": [0, 0, 0],
                "fov": 50,
                "lights": [
                    {
                        "type": "ambient",
                        "intensity": 0.4,
                        "position": [0, 0, 0]
                    },
                    {
                        "type": "point",
                        "intensity": 0.6,
                        "position": "camera"
                    }
                ]
            });
            callback({
                image: await drawScene(scene.scene, scene.camera, 300, 300, "image/png", false, true, 3),
                type: "png"
            });
            scene.dispose();
        }).catch(e => {
            console.log(e);
            callback(false);
        });
    } else if (imageType == "opengraph" && ["hat", "shoulderbuddy", "backbling"].includes(subject)) { // COSMETICS OPENGRAPH
        getUrl(`get/cosmetic?type=${subject}&id=${id}`).then(async data => {
            if (!data.model) return callback(false);
            const scene = await doCosmetic(data, subject, {
                "pose": PoseLoader.poses.standing,
                "playerRotation": [0, 0, 0],
                "cameraPostRotation": [0, 0, 0],
                "panorama": "https://cosmetica.cc/page/panoramas/1.jpg",
                "fov": 50,
                "lights": [
                    {
                        "type": "ambient",
                        "intensity": 0.4,
                        "position": [0, 0, 0]
                    },
                    {
                        "type": "point",
                        "intensity": 0.6,
                        "position": "camera"
                    }
                ]
            });
            callback({
                image: await drawScene(scene.scene, scene.camera, 1200, 630, "image/jpeg", false, true, 3),
                type: "jpeg"
            });
            scene.dispose();
        }).catch(e => {
            console.log(e);
            callback(false);
        });
    } else if (matches("cape", "icon")) {
        getUrl(`get/cosmetic?type=cape&id=${id}`).then(async data => {
            if (!data.image) return callback(false);
            const scene = await doCape(data, {
                "pose": PoseLoader.poses.standing,
                "playerRotation": [0, 0, 0],
                "camera": [0, 0, 30],
                "cameraPostRotation": [0, 0, 0],
                "fov": 60,
                "lights": [
                    {
                        "type": "ambient",
                        "intensity": 0.4,
                        "position": [0, 0, 0]
                    },
                    {
                        "type": "point",
                        "intensity": 0.6,
                        "position": "camera"
                    }
                ]
            });
            scene.player.player.root.position.x = 11;
            scene.player.player.root.rotation.y = Math.PI - 0.9;
            scene.player.player.root.position.z = -2;
            scene.player2.player.root.position.x = -9.5;
            scene.player2.player.root.rotation.y = Math.PI + 0.9;
            scene.player2.player.root.position.z = 5;
            callback({
                image: await drawScene(scene.scene, scene.camera, 300, 300, "image/png", false, true, 3),
                type: "png"
            });
            scene.dispose();
        }).catch(e => {
            console.log(e);
            callback(false);
        });
    } else if (matches("cape", "opengraph")) {
        getUrl(`get/cosmetic?type=cape&id=${id}`).then(async data => {
            if (!data.image) return callback(false);
            const scene = await doCape(data, {
                "pose": PoseLoader.poses.standing,
                "playerRotation": [0, 0, 0],
                "camera": [0, 0, 30],
                "cameraPostRotation": [0, 0, 0],
                "panorama": "https://cosmetica.cc/page/panoramas/1.jpg",
                "fov": 60,
                "lights": [
                    {
                        "type": "ambient",
                        "intensity": 0.4,
                        "position": [0, 0, 0]
                    },
                    {
                        "type": "point",
                        "intensity": 0.6,
                        "position": "camera"
                    }
                ]
            });
            callback({
                image: await drawScene(scene.scene, scene.camera, 1200, 630, "image/jpeg", false, true, 3),
                type: "jpeg"
            });
            scene.dispose();
        }).catch(e => {
            console.log(e);
            callback(false);
        });
    } else {
        callback(false);
    }
}

async function doCape(data, sceneInfo) {
    const scene = await createScene(sceneInfo, {
        skin: blankSkin,
        cape: data,
        backEquipment: "elytra",
        panorama: sceneInfo.panorama
    });
    scene.player.player.root.rotation.y = Math.PI - 1.1;
    scene.player.player.root.position.x = 16;
    scene.player.player.root.position.z = 0;
    scene.player.player.root.position.y = 3;

    const capePlayer = new CosmeticaPlayer();
    scene.player2 = capePlayer;
    await capePlayer.build({
        skin: blankSkin,
        cape: data,
        backEquipment: "cape"
    });
    scene.scene.add(capePlayer.player.root);

    capePlayer.player.root.rotation.y = Math.PI + 1.3;
    capePlayer.player.root.position.x = -15;
    capePlayer.player.root.position.z = 6;
    capePlayer.player.root.position.y = 2;

    return scene;
}

async function doCosmetic(data, subject, sceneInfo) {
    const model = JSON.parse(data.model);

    let coords = Array(3).fill(0);
    function rotateCoords(angle, coords, axis, origin) {
        let useAxis = {
            "x": [1, 2],
            "y": [0, 2],
            "z": [0, 1]
        }[axis.toLowerCase()];
        let radians = Math.PI / 180 * -angle;
        let cos = Math.cos(radians);
        let sin = Math.sin(radians);
        let new1 = (cos * (coords[useAxis[0]] - origin[useAxis[0]])) + (sin * (coords[useAxis[1]] - origin[useAxis[1]])) + origin[useAxis[0]];
        let new2 = (cos * (coords[useAxis[1]] - origin[useAxis[1]])) + (sin * (coords[useAxis[0]] - origin[useAxis[0]])) + origin[useAxis[1]];
        coords[useAxis[0]] = new1;
        coords[useAxis[1]] = new2;
        return coords;
    }

    function pythag(x1, y1, x2, y2) {
        return Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2));
    }

    let furthestFromCenter = 0;

    for (let i = 0; i < model.elements.length; i++) {
        let element = model.elements[i];
        let from = element.from;
        let to = element.to;
        if (element.rotation && element.rotation.angle % 360 != 0) {
            from = rotateCoords(element.rotation.angle, from, element.rotation.axis, element.rotation.origin);
            to = rotateCoords(element.rotation.angle, to, element.rotation.axis, element.rotation.origin);
        }

        [from, to].forEach(temp => {
            let distance = pythag(temp[0] - 8, temp[2] - 8, 0, 0);
            if (!furthestFromCenter || distance > furthestFromCenter) furthestFromCenter = distance; 
        });
        for (let i = 0; i < 3; i++) coords[i] += from[i] + to[i];
    }
    for (let i = 0; i < 3; i++) coords[i] = Math.round(coords[i] * 100 / model.elements.length / 2) / 100;
    let angle;

    let playerData = {
        skin: skinPath
    };
    if (subject == "hat") {
        playerData.hats = [data];
        angle = Math.atan2(coords[0] - 8, 4 - coords[2]);
    } else if (subject == "shoulderbuddy") {
        playerData.shoulderBuddies = {
            left: data
        };
        angle = Math.atan2(coords[0] - 8, 9 - coords[2]);
    } else if (subject == "backbling") {
        playerData.backBling = data;
        angle = Math.atan2(coords[0] - 8, 9 - coords[2]);
    }

    let allowedAngles = {
        hat: [
            Math.PI / 4,
            Math.PI / -4,
            Math.PI / 4 * 3,
            Math.PI / -4 * 3
        ],
        shoulderbuddy: [
            Math.PI / -4,
            Math.PI / -4 * 3
        ],
        backbling: [
            Math.PI / 4,
            Math.PI / -4,
            Math.PI / 4 * 3,
            Math.PI / -4 * 3,
            Math.PI / 4 * 3.5,
            Math.PI / -4 * 3.5
        ]
    }[subject];

    function getClosestAngle(angle, options) {
        let nearest = 0;
        let nearestDif = 0;
        for (let i = 0; i < options.length; i++) {
            let difference = Math.abs(options[i] - angle) % (Math.PI * 2);
            if (!difference) return options[i];
            if (!nearestDif || nearestDif > difference) {
                nearest = options[i];
                nearestDif = difference;
            }
        }
        return nearest;
    }
    angle = getClosestAngle(angle, allowedAngles);
    const cameraPosition = rotateCoords(angle / Math.PI * 180, [0, 0, 10 + furthestFromCenter * 2], "y", [0, 0, 0]);

    const scene = await createScene({
        ...sceneInfo,
        camera: cameraPosition
    }, {
        ...playerData,
        panorama: sceneInfo.panorama
    });
    scene.camera.position.y = coords[1] + {
        hat: 6 + 8,
        shoulderbuddy: 6,
        backbling: 0
    }[subject];
    const cosmeticCoordinates = {
        hat: [0, 0],
        shoulderbuddy: [4, 0],
        backbling: [0, 2]
    };
    const cosmeticPosition = [
        cosmeticCoordinates[subject][0] - coords[0] + 8,
        scene.camera.position.y,
        cosmeticCoordinates[subject][1] - coords[2] + 8
    ];
    scene.camera.lookAt(...cosmeticPosition);
    return scene;
}

export default getScene;