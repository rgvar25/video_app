import { Router } from "express";
import { loginUser, logoutUser, registerUser, validateUser } from "../controllers/user.controllers.js";
import { upload } from "../middlewares/multer.middlewares.js"
import { verifyJWT } from "../middlewares/auth.middlewares.js";
import { ApiResponse } from "../utils/ApiResponse.js";

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

//Secured Routes
router.post('/logout', verifyJWT, logoutUser)


//Verify user to bypass authentication.
router.post('/verify', verifyJWT, (req, res) => { res.status(200).json(new ApiResponse(200, {}, "User Verified")) })


export default router;