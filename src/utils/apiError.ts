type ErrorDetails = string[] | Record<string, any>; // Can be an array of strings or an object with error details
//with key string and val:any

class ApiError extends Error {
  public statusCode: number;
  public data: any;
  public success: boolean;
  public errors: ErrorDetails;

  constructor(
    statusCode: number,
    message: string = "Something went wrong",
    errors: ErrorDetails = [],
    stack?: string
  ) {
    super(message);
    this.statusCode = statusCode;
    this.data = null; // Default value, could be changed as needed
    this.success = false;
    this.errors = errors;

    if (stack) {
      //checking if stack is not empty
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

export default ApiError;
