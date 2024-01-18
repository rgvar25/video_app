import { asyncHandler } from "../utils/asyncHandler.js";
import { APIError } from "../utils/ApiError.js";
import jwt from "jsonwebtoken"
import { Users } from "../models/user.models.js";

export const verifyJWT = asyncHandler(async (req, res, next) => {

    console.log(req.cookies);

    //Cookie Parser gives you access to cookies in req object. For this you need to send axios request with credentials true from frontend. And edit cors to allow only frontend url. Wont end with CORS = *. 
    try {
        const token = req.cookies?.accessToken;

        if (!token) {
            throw new APIError(401, "Unauthorised access");
        }

        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

        //Since decoded token would provide you access to to feilds that you used to sign a jwt token in user.models.js
        const user = await Users.findById(decodedToken?._id).select("-password -refreshToken")

        if (!user) {
            throw new APIError(401, "Unauthorized access token")
        }

        //Attach user object to req for further access and minimise database calls.
        req.user = user;

        next()
    } catch (error) {
            throw new APIError(401,error)
    }
})