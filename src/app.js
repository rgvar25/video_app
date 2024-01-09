import express from "express"
import cors from 'cors'
import cookieParser from "cookie-parser";



const app = express();


app.use(cors({
    origin: process.env.CORS
})); // allows request only from specific origin(domain). Usually the url of frontend is passed that is goanna request the backend

app.use(express.json({ limit: "16kb" })) // Recognises and parses JSON data in the payload and makes it accessible in req.body . Can also limit the size of incoming JSON data

app.use(express.urlencoded({ extended: true, limit: "16kb" }))// Recognises and parses url encoded data (form submission via POST) and makes it accessible through req.body. If extended is false it use querystring library(simple) when extended is true it uses qs(more features like array and complex types) library

app.use(express.static("public")) // Marks public directory as static. Which means that users  can directly access the files in public directory through URL's  (www.google.comuser/profile.png). Files that are served without any modifications. CSS files are static 

app.use(cookieParser())// Parse cookies from client side 


//This is done for segregation purposes. The above code is for configeration purposes, while  the code below  is for routing purposes. Also the order matters. It is necessary for a request to go through all the above steps before reaching the actual route.

import userRouter from "./routes/user.routes.js";
app.use('/api/v1/users', userRouter)



app.use((err, req, res, next) => {
    res.status(err.statusCode).send(err);
});
export { app };