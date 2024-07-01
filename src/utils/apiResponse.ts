//created to handle api response in consistent manner increase code reusability
class ApiResponse<T> {
  //generic type to allow specified type of data in the datafield
  public statusCode: number;
  public data: T; // generic type T to allow any type of data
  public success: boolean;
  public message: string;

  constructor(statusCode: number, data: T, message: string = "Success") {
    this.statusCode = statusCode;
    this.data = data;
    this.success = statusCode < 400; //as code less than 400 means success
    this.message = message;
  }
}

export default ApiResponse;
