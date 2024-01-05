//Creating a custom response class for uniform response messages;


class ApiResponse {
    constructor(statusCode, data, message = "success") {
        this.statusCode = statusCode; // Since not inherited no super 
        this.data = data;
        this.message = message;
        this.success = statusCode;
    }
}

export {ApiResponse};

