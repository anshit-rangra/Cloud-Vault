import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken'

const userSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true
    },
    mobile: {
        type: String,
        required:true
    },
    password: {
        type: String,
        required: true
    }
})

userSchema.pre("save", async function(){
    this.password = await bcrypt.hash(this.password, 10)
})

userSchema.methods.checkPassword = async function(password){
    return await bcrypt.compare(password, this.password)
}

userSchema.methods.generateToken = async function(){
    return jwt.sign({
        userId: this._id.toString(),
        username: this.name,
        mobile: this.mobile,
    }, process.env.JWT_KEY, {
        expiresIn:"10d"
    })
}

export async function checkToken(token){
    const jwt_token = token.split(" ")[1]

    return jwt.verify(String(jwt_token), process.env.JWT_KEY)
}

const userModel = mongoose.model("users", userSchema)

export default userModel