import mongoose, { mongo } from "mongoose";
import bcrypt from "bcrypt"; // used to hash passwords with bcrypt algo. bcrypt uses native c++ module for algo implementation. Node can compile native modules. However in plain js files use bcryptjs.
import jwt from "jsonwebtoken"; //Provides a Bearer token for authentication. Whoever has the token is authenticated.


const userSchema = new mongoose.Schema({
    username: {
        type: String,
        unique: true,
        required: true,
        lowercase: true,
        trim: true,
        index: true // Creates an index. Optimises searching. However it is an expensice operation, therefore use in moderation
    },
    email: {
        type: String,
        unique: true,
        required: true,
    },
    fullName: {
        type: String,
        required: true,
        index: true
    },
    avatar: {
        type: String, // URL from a third party service
        required: true,
    },
    coverImage: {
        type: String
    },
    watchHistory: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Video"
    },
    password: {
        type: String,
        required: true
    },
    refreshToken: {
        type: String // A jwt Token

    }
}, { timestamps: true })


userSchema.pre("save", async function (next) { //Do not use arrow functions as we require context of the current object(this). Async function since it is compute intensive and may require time.
    if (!this.isModified("password")) return next();
    this.password = await bcrypt.hash(this.password, 10)  // 10 = number of rounds.
})

// pre and post are hooks offered by mongoose that acts as middleware before or after an event(saving,deleting, updating, finding). Same as Triggers in SQL.


// Defining custom method and additng it to userSchema so that it's available on the go. 
//userSchema.isPasswordCorrect(). same as userSchema.findOne({}).
userSchema.methods.isPasswordCorrect = async function (pass) {
    return await bcrypt.compare(pass, this.password); //Compares the user passed password with encrypted password
}

userSchema.methods.generateAccessToken = async function () {

    return await jwt.sign({
        _id: this._id,
        email: this.email,
        username: this.username,
        fullName: this.fullName
    },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        }
    )
}

userSchema.methods.generateRefreshToken = async function () {
    return await jwt.sign({
        _id: this._id,
        
    },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY
        }
    )
}


export const Users = mongoose.model('Users', userSchema);