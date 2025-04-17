import { checkToken } from "../models/auth-model.js";
import fileModel from "../models/file-model.js";
import uploadOnCloudinary, { deleteOnCloudinary } from "../utils/cloudinary.js";
import fs from "fs";

const uploadFile = async (req, res) => {
  try {
    const token = req.headers.authorization
    if (!token) return res.json({ message: "User is unauthorized." });
    const user = await checkToken(token);

    if (!req.file) return res.json({ message: "No file uploaded !" });

    // upload file to cloudinary
    const cloudinaryResponse = await uploadOnCloudinary(req.file.path);

    if (!cloudinaryResponse) {
      return res.json({ message: "Failed to upload file on cloudinary" });
    }
    // delete the file from server
    fs.unlinkSync(req.file.path);
    // Save in mongo database

    const data = await fileModel.create({
      owner: user.username,
      type: cloudinaryResponse.resource_type,
      file: cloudinaryResponse.secure_url,
      format: cloudinaryResponse.format,
      public_id: cloudinaryResponse.public_id
    });
    if (!data) return res.json({ message: "Some error occur" });

    res.json({ message: "File uploaded sucessfully !" });
  } catch (error) {
    console.log(error);
  }
};

const images = async (req, res) => {
  try {
    const token = req.headers.authorization;
    if (!token) return res.json({ message: "User is unauthorized !" });
    const user = await checkToken(token);
    const pictures = await fileModel.find({
      owner: user.username,
      type: "image",
    });
    res.json({ images: pictures });
  } catch (error) {
    console.log(error);
  }
};

const videos = async (req, res) => {
  try {
    const token = req.headers.authorization;
    if (!token) return res.json({ message: "User is unauthorized !" });
    const user = await checkToken(token);
    const video = await fileModel.find({
      owner: user.username,
      type: "video",
      format: "mp4",
    });
    res.json({ videos: video });
  } catch (error) {
    console.log(error);
  }
};

const audios = async (req, res) => {
  try {
    const token = req.headers.authorization
    if (!token) return res.json({ message: "User is unauthorized !" });
    const user = await checkToken(token);
    const music = await fileModel.find({
      owner: user.username,
      type: "video",
      format: "mp3",
    });
    res.json({ audios: music });
  } catch (error) {
    console.log(error);
  }
};

const files = async (req, res) => {
  const token = req.headers.authorization
    if (!token) return res.json({ message: "User is unauthorized !" });
    const user = await checkToken(token);
    const file = await fileModel.find({owner: user.username, type: "raw"})
    res.json({files: file})
}


const deleteFile = async (req, res) => {
    try {
        const publicId = req.params.url; // Ensure this is the public_id, not full URL
        const type = req.headers.type;
        

        // Delete from Cloudinary
        const result = await deleteOnCloudinary(publicId, type);

        // Delete from MongoDB
        const deletedFile = await fileModel.findOneAndDelete({ public_id: publicId });
        

        if (result.result !== "ok" || !deletedFile) {
            return res.status(400).json({ message: "Unable to delete file." });
        }

        return res.json({ message: "File deleted successfully!" }); 

    } catch (error) {
        console.log("Error deleting file:", error);
        return res.status(500).json({ message: "Internal server error" });
    } 
};


export default { uploadFile, images, videos, audios, files, deleteFile };

// { result: 'ok' }
// { acknowledged: true, deletedCount: 0 }