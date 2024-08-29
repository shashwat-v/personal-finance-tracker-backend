// src/utils/types.ts
import { Request, Response } from "express";

// Define a custom request type with a body of type T
export interface TypedRequestBody<T> extends Request {
  body: T;
}

// Define a custom response type that can send a payload of type T
export interface TypedResponse<T> extends Response {
  json(data: T): this;
}

// Example usage for specific endpoint request bodies
export interface RegisterBody {
  fullname: string;
  email: string;
  password: string;
  phoneNumber: string;
}

export interface LoginBody {
  email: string;
  password: string;
}
