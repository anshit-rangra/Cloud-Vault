import mongoose from 'mongoose';

const fileSchema = new mongoose.Schema({
    owner: {
        type: String,
        required: true
    },
    type: {
        required: true,
        type: String
    },
    date: {
        default: Date.now(),
        type: String,
        required: true
    },
    file: {
        type: String,
        required: true
    },
    format: {
        type: String,
        default: "raw"
    },
    public_id: {
        type: String,
        required: true
    }
})

const fileModel =  mongoose.model("files", fileSchema)

export default fileModel;