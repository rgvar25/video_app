import { asyncHandler } from "../utils/asyncHandler.js";
import { z, ZodError } from "zod"
import { APIError } from "../utils/ApiError.js"
import { Users } from "../models/user.models.js"
import { fileUpload } from "../utils/fileUpload.js";
import { ApiResponse } from "../utils/ApiResponse.js";


//Internal method. Defined it seperately coz it might be used multiple times.
const generatRefreshAndAccessTokens = async (user) => {

    try {
        const accessToken = user.generateAccessToken();
        const refreshToken = user.generateRefreshToken();

        user.refreshToken = refreshToken;

        //Mongoose validates before saving. Hence it would throw an error if it's constraints aren't met like password empty. Hence validateBeforeSaving is false.
        await user.save({ validateBeforeSave: false });

        return { accessToken, refreshToken }

    } catch (error) {
        throw new APIError(500, "Cannot generate access and refresh tokens.")
    }

}


//Validation using zod library.
const validateUser = (req, res, next) => {
    const validationSchema = z.object({
        username: z.string().min(1, { message: 'Username is required' }),
        fullName: z.string().min(1, { message: 'Full name is required' }),
        email: z.string().email({ message: 'Invalid email address' }),
        password: z.string().min(8, { message: 'Password must be at least 8 characters long' }),
    });

    const { username, fullName, email, password } = req.body;

    try {
        const validatedData = validationSchema.parse({ username, fullName, email, password });
        // console.log('Validation passed:', validatedData);
    } catch (error) {
        // const errorMessages = error.errors.map((err) => err.message);
        //console.error('Validation failed:', errorMessages);
        throw new APIError(400, error.errors[0].message, error)
    }

    next()
}

// A function that registers the use. Since db operation requires time we use async await.
const registerUser = asyncHandler(async (req, res) => {


    const { username, fullName, email, password } = req.body;

    //Check for existing users first.
    const existingUser = await Users.findOne({
        $or: [{ username }, { email }] // You can use operators in mongoose using $. Finds in mongodb whether a user with a particular username OR email exists.

    })

    if (existingUser) {
        throw new APIError(409, "User already Exists");
    }

    // We an access the files uploaded via req.files provided by multer.

    // const avatarFilePath = req.files?.avatar[0].path // Optional chaining: checks if req.files exists if no then return undefined and if yes then checks the avatar and then finally path.
    let avatarFilePath;

    if (req.files.avatar && req.files.avatar.length > 0) {
        avatarFilePath = req.files.avatar[0].path;
    }

    let coverFilePath;
    if (req.files.coverImage && req.files.coverImage.length > 0) {
        coverFilePath = req.files?.coverImage[0]?.path;
    }




    if (!avatarFilePath) {
        throw new APIError(400, 'Avatar Image is required')
    }

    const avatar = await fileUpload(avatarFilePath);
    const coverImage = await fileUpload(coverFilePath);


    if (!avatar) {
        throw new APIError(400, 'Avatar Image upload failed');
    }

    let newUser = await Users.create({ username, fullName, email, password, avatar: avatar.url, coverImage: coverImage?.url });

    //Check if user iis crreated or not if yes then return to frontend.
    let createdUser = await Users.findById(newUser._id).select("-password -refreshToken") //Select method is used to incluse or exclude (-) feilds from query result. Similar to select from SQL. 

    if (!createdUser) {
        throw new APIError(500, "Registration failed");
    }


    return res.status(201).json(new ApiResponse(200, createdUser, "User details uploaded successfuly"))
})



//Defining login function.
const loginUser = asyncHandler(async (req, res) => {

    //Allow user to sign in either by username or password.
    const { uname, password } = req.body;

    if (!uname || !password) {
        throw new APIError(400, 'Username and password is required');
    }

    //Find user either through username or password
    const user = await Users.findOne({
        $or: [{ username: uname }, { email: email }]
    })

    if (!user) {
        throw new APIError(404, "User not found");
    }

    //We defined this method explicitly in user.models 
    if (!(await user.isPasswordCorrect(password))) {
        throw new APIError(401, "Password incorrect");
    }

    const { accessToken, refreshToken } = await generatRefreshAndAccessTokens(user);

    //to send user to frontend 
    user = user.select(["-password -refreshToken"])

    //Setting this options signifies that cookies can only be modified in backend and not via user.
    let options = {
        httpOnly: true,
        secure: true
    }

    //Cookies work in key value pair
    return res.cookie('accessToken', accessToken, options).cookie('refreshToken', refreshToken, options).json(
        new ApiResponse(
            200,
            {
                user, refreshToken, accessToken //We send a json response so that if needed we can store it in local storage in frontend.
            },
            "user logged in successfully"
        )
    )
})


export { registerUser, validateUser, loginUser };