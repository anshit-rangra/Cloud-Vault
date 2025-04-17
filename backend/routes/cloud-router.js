import express from 'express';
import cloudController from '../controllers/cloud-controller.js';
import upload from '../utils/multer-config.js';

const app = express.Router()

app.route("/upload-file").post(upload.single("file") , cloudController.uploadFile)
app.route("/images").get(cloudController.images)
app.route("/videos").get(cloudController.videos)
app.route("/audios").get(cloudController.audios)
app.route("/files").get(cloudController.files)
app.route("/delete/:url").delete(cloudController.deleteFile)

export default app