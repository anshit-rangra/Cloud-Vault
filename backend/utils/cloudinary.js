import {v2 as cloudinary} from 'cloudinary'
import fs from 'fs'

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
})

const uploadOnCloudinary = async (localFilePath) => {
    try {
        if(!localFilePath) return null;

        // upload the file on cloudinary
        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: "auto"
        })
        // File has been uploaded sucessfully !
        return response;
    } catch (error) {
        fs.unlinkSync(localFilePath) // Remove the locally saved temproraly as the operation got failed

        return undefined;
    }
}

export const deleteOnCloudinary = async (publicId, type) => {
    try {
        const result = await cloudinary.uploader.destroy(publicId, {
            resource_type: type
        })
        return result;
    } catch (error) {
        console.log(error)
        return null
    }
}

export default uploadOnCloudinary;