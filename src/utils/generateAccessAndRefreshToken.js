import { User } from "../models/user.model.js";
import { ApiError } from "./apiErrors.js";

// method to set acces and refresh tokens
const generateAccessTokenAndRefreshToken = async (userId) => {
  try {
    const user = await User.findById(userId);
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();
   console.log(user);
   
    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false }); // no need of validation before save here

    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(
      500,
      "something went wrong during setting access and refresh tokens"
    );
  }
};

export { generateAccessTokenAndRefreshToken };
