import express from 'express';
import authController from '../controllers/auth-controller.js';
import validateUser from '../middlewares/vlidate-user.js';

const app = express.Router()

app.route("/").get(authController.home)

app.route("/login").post(authController.login)

app.route("/send-otp").post(validateUser , authController.sendOtp)

app.route("/register").post(authController.register) 

export default app