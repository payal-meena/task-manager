import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';


export const signup = async (req,res, next) => {
    try {
        const { name, email, password } = req.body;

        if(!name || !email || !password ) {
            return res.status(400).json("All fields required");
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
        return res.status(400).json("User already exists");
        }

        const hashed = await bcrypt.hash(password, 10);

        const user = await User.create({
            name,
            email,
            password: hashed,
        });
        res.status(201).json({ message: "User Created"});
        res.json(user);
    } catch (err) {
        res.status(500).json("Signup error");
        next(err);
    }
}

export const login = async (req, res, next ) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email});
        if(!user) return res.status(400).json("User not found");
        
        const isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch) return res.status(400).json("Wrong password");

        const token = jwt.sign({ id: user._id } , process.env.JWT_SECRET);

        res.json({ token });
    } catch (err) {
        res.status(500).json("Login error");
        next(err);
    }
};