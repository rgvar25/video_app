// A wrapper for async functions to avoid writing excessie try catch blocks. It returns a function that executes the passed function. req,res,next is present since this wrapper would also be used for middleware functions
const asyncHandler = (fun) => {
    return async (req, res, next) => {
        try {
            await fun(req, res, next);
        } catch (err) {
            console.log(err);
            next(err);
        }
    }
}

//no need to write try caych again 
//eg. wrapped = asyncHandler(mongoose.connect);

export { asyncHandler };