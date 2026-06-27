import { auth } from "../config/firebase-admin.js";
import { User } from "../models/user_model.js";
export const verifyFirebaseToken = async (req, res, next) => {

    try {

        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith("Bearer ")) {

            return res.status(401).json({
                message: "Access denied. No token provided."
            });

        }

        const token = authHeader.split(" ")[1];

        const decodedToken = await auth.verifyIdToken(token);

const dbUser = await User.findOne({
    firebaseUid: decodedToken.uid
});

if (!dbUser) {
    return res.status(401).json({
        message: "User not found."
    });
}

req.user = dbUser;

next();

        

    } catch (error) {

        return res.status(401).json({
            message: "Invalid or expired token."
        });

    }

};