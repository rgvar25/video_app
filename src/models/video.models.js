import mongoose from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";



const videoSchema = new mongoose.Schema({
    videoFile: {
        type: String, // URL from third-party
        required: true,
    },
    thumbnail: {
        type: String,
        required: true,
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Users",
        required: true
    },
    title: {
        type: String,
        required: true,
        index: true
    },
    description: {
        type: String
    },
    duration: {
        type: Number,
        required: true
    },
    views: {
        type: Number,
        default: 0
    },
    isPublished: {
        type: Boolean,
        default: 0
    }
}, { timestamps: true })

videoSchema.plugin(mongooseAggregatePaginate); // pageination : retrieve and display information in pages (10 documents per page). PLugins are code snippets that add more functionality like validation, confirm before delete to mongoose schema.


export const videos = mongoose.model("Videos", videoSchema)