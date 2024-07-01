import { Request, Response, NextFunction, RequestHandler } from "express";

//async handler is a heigherorder function which take function as a input acts as a wrapper around asynchronus function
const asyncHandler = (requestHandler: RequestHandler): RequestHandler => {
  return async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    //Since the returned function is asynchronous and doesn't return a specific value,
    Promise.resolve(requestHandler(req, res, next)).catch((err) => next(err)); // next Forward the error to Express's error handling middleware
    //propagates error
  };
};

export { asyncHandler };
