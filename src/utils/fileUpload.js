import { v2 as cloudinary } from 'cloudinary';
import fs from "fs"

//Upload the file on cloudinary server from local server.
const fileUpload = async (localFilePath) => {
  try {
    if (!localFilePath) return null
    //Method from cloudinary 
    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto" // Figure out type of file on your own.
    })

    console.log("File upload successful " + response);
    return response;
  } catch (err) {
    fs.unlink(localFilePath) // Delete the file from local server if upload fails. Cleanup action to prevent buildup of unnecessary files.
    console.log(err);
  }
}




cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET
});

export { fileUpload }