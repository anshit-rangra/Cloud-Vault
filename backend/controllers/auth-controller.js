import Twilio from "twilio";
import userModel from "../models/auth-model.js";
import jwt from "jsonwebtoken";

let user = new Object();
const code = Math.floor(1000 + Math.random() * 9000);

const home = async (req, res) => {
  let { token } = req.headers;
  token = token.split(" ")[1];
  try {
    const response = await jwt.verify(token, process.env.JWT_KEY);
    res.json({ message: response });
  } catch (error) {
    res.json({ message: "Invalid Token" });
  }
};

const login = async (req, res) => {
  const { name, password } = req.body;
  try {
    const userExists = await userModel.findOne({ name });
    if (!userExists) return res.json({ message: "User not found!" });

    const checkPassword = await userExists.checkPassword(password);
    if (!checkPassword)
      return res.status(401).json({ message: "Invalid credential" });

    const token = await userExists.generateToken();

    res.cookie("token", token, {
      maxAge: 30 * 24 * 60 * 60 * 1000,
      httpOnly: false,
      secure: true,
      sameSite: "none",
      path: "/",
    });

    res.json({ message: "User LoggedIn sucessfully !", token });
  } catch (error) {
    console.log(error);
  }
};

const sendOtp = async (req, res) => {
  const { name, mobile, password } = req.body;
  user = { name: name, mobile: mobile, password: password };

  const userExists = await userModel.findOne({ name, mobile });
  if (userExists) return res.json({ message: "User already exists" });

  const client = new Twilio(process.env.ACCOUNT_SID, process.env.AUTH_TOKEN);

  try {
    const response = await client.messages.create({
      body: `Your OTP is ${code}. Valid for 5 minutes.`,
      from: process.env.PHONE_NUMBER,
      to: `+91${mobile}`,
    });
    res.json({ message: "OTP sent" });
  } catch (error) {
    console.log(error);
  }
};

const register = async (req, res) => {
  const { otp } = req.body;

  try {
    if (otp != code) {
      res.json({ message: "Invalid OTP" });
    }

    const addUser = await userModel.create(user);
    const token = await addUser.generateToken();

    res.cookie("token", token, {
      maxAge: 30 * 24 * 60 * 60 * 1000,
      httpOnly: false,
      secure: true,
      sameSite: "none",
      path: "/",
    });

    res.json({ message: "User is created sucessfully !" });
  } catch (error) {
    console.log(error);
  }
};

export default { home, login, sendOtp, register };
