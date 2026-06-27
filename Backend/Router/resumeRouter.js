import { Router } from "express";
import { upload } from "../middleware/multer.js";
import { Addresume, compareResume, deleteResume, getAllResumeForUser, getAnalytics, getChartData, getRecentResume, getResumeById, getResumeForAdmin, getSkillAnalytics } from "../controller/resume_controller.js";
import { verifyFirebaseToken } from "../middleware/auth_middleware.js";
export const ResumeRouter=Router()
ResumeRouter.post(
    "/addresume",
    verifyFirebaseToken,
    upload.single("resume"),
    Addresume
);
ResumeRouter.get("/get/:userId",getAllResumeForUser)
ResumeRouter.get("/get",getResumeForAdmin)
ResumeRouter.get("/analytics/:userId",verifyFirebaseToken, getAnalytics)
ResumeRouter.get(
    "/chart",
    verifyFirebaseToken,
    getChartData
);
ResumeRouter.get(
    "/skills",
    verifyFirebaseToken,
    getSkillAnalytics
);
ResumeRouter.get(
    "/recent/",verifyFirebaseToken,
    getRecentResume
);
ResumeRouter.get("/details/:resumeId",verifyFirebaseToken, getResumeById);
ResumeRouter.get(
    "/compare/:resumeId",
    verifyFirebaseToken,
    compareResume
);
ResumeRouter.delete(
    "/delete/:resumeId",
    verifyFirebaseToken,
    deleteResume
);