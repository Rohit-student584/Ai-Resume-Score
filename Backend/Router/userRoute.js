import {Router} from "express"
import { Register } from "../controller/user_controller.js"
export const Userroute=Router()
Userroute.post("/register",Register)