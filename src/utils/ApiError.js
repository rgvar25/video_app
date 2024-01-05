
// creating a custom error class to display custom errors

class APIError extends Error {

    constructor(
        statusCode,
        message = "Something went wrong",
        errors = []) {
        super(message); // for invoking constructor of parent class. Error(message)
        this.statusCode = statusCode;
        this.data = null // data is any additional info that you pass to object, new Error(404,"message",[errors], {additionalinfo: add}) do not accept this additional info
        this.errors = errors;
        this.success = false;

    }
}

export { APIError }