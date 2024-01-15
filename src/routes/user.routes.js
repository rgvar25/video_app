import { Router } from "express";
import { loginUser, registerUser, validateUser } from "../controllers/user.controllers.js";
import { upload } from "../middlewares/multer.middlewares.js"

// This approach is followed for better segregation of code and to  make code more modular.
const router = Router();

router.post("/register", upload.fields([ //multer middleware to process files. Fields is used since we're accepting images from multiple fields(avatar and coverImage). If multiple files were to be accepted from a single field then use array(eg. multiple images in avatar.)
    {
        name: 'avatar',
        maxCount: 1
    },
    {
        name: 'coverImage',
        maxCount: 1
    }
]), validateUser, registerUser);


router.post("/login", loginUser);


//router.route("/register").post(registerUser)



export default router;