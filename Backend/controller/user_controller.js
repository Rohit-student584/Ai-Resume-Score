import { User } from "../models/user_model.js";

export const Register=async (req,res) => {
    try {
        const{name,email,photoUrl,firebaseUid}=req.body;
        if (!name || !email) {
    return res.status(400).json({
        message: "Name and Email are required"
    });
}
        const userExists=await User.findOne({email})
if (!userExists) {
    const newUser=await User.create({
        name,email,photoUrl,firebaseUid
    })

    return res.status(201).json({
        message:"register succesfully",
        user:newUser
    })
}

return res.status(200).json({
    message:"Welcome Back",
    user:userExists
})
    } catch (error) {
        return res.status(500).json(`register error ${error}`)
    }
}