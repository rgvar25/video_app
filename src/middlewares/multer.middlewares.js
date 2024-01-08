import multer from "multer";

// Configure the multer. It is used to upload and store files on local server.

const configureStorage = multer.diskStorage({ //set the path to store on disk. Can also store in memory but since we're storing videos we'll store in disk.

    destination: (req, file, cb) => {
        cb(null, "./public/temp") //null is for error feild. determines function to be executed when error
    },
    filename: (req, file, cb) => {
        console.log("multer file : " + file[0]);
        cb(null, file.originalname)
    }

})


export const upload = multer({
    storage: configureStorage
})
