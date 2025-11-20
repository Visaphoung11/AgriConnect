import { UserModel } from "@/models/userModel";
import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import Jwt from "jsonwebtoken";

export const Registerservice = async (req: Request, res: Response) => {
  const { email, firstName, lastName, userName, role, phone, age } =
    req.body;
  try {
    const existEmail = await UserModel.findOne({ email });
    if (existEmail) {
      return res.status(400).json({ message: "Email already exists" });
}                                           
    //hash password before saving to database (omitted for brevity)
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    //create new user
    const newUser = new UserModel({
      firstName,
      lastName,
      // userName,
      age,
      role,
      phone,
      email,
      password: hashedPassword,
      
    });
    //save user to database
    await newUser.save();
    res.status(201).json({ message: "User registered successfully", newUser });
  } catch (error) {
    console.error("Error in register service:", error);
  }
};

export const Loginservice = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  try {
    const existUser = await UserModel.findOne({ email });
    if (!existUser) {
      return res.status(400).json({ message: "Invalid credentials" });
    }
    //compare password
    const isMatch = await bcrypt.compare(
      password,
      existUser.password as string
    );
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }
    //generate JWT token 
    const token = Jwt.sign(
      {
        id: existUser._id,
        email: existUser.email,
        userName: existUser.userName,
      },
      process.env.JWT_SECRET || "SECRET_KEY",
      {}
    );

    return res.status(200).json({ message: "Login successful", token });
  } catch (error) {
    console.error("Error in login service:", error);
  }
};
