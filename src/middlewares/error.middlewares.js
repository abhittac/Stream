import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/apiResponse.js";

const errorMiddleware = (err, req, res, next) => {
  if (err instanceof ApiError) {
    const response = new ApiResponse(err.statusCode, err.message, err.errors);
    return res.status(response.statusCode).json(response);
  }

  // Handle unexpected errors
  const response = new ApiResponse(500, "Internal Server Error", err.message);
  return res.status(response.statusCode).json(response);
};

export default errorMiddleware;
