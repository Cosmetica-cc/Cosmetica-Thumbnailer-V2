import Express from "express";

import { Config } from "./Config.js";
import getScene from "./Scene.js";

const app = Express();

app.get("/:subject/:imageType/:id", (req, res) => {
    const subject = req.params.subject;
    const imageType = req.params.imageType;
    const id = req.params.id;
    getScene(subject, imageType, id, output => {
        if (!output) return res.status(404).end();
        res.contentType("image/" + output.type);
        res.status(200).end(Buffer.from(output.image.substring(22), "base64"));
    });
});

app.listen(Config.port, () => {
    console.log("Listening on *:" + Config.port);
});