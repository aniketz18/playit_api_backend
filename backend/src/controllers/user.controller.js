import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiErrors.js";
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { generateAccessTokenAndRefreshToken } from "../utils/generateAccessAndRefreshToken.js";
import jwt from "jsonwebtoken";
/* // method to set acces and refresh tokens   ------> migrated to utils
const generateAccessTokenAndRefreshToken = async(userId)=>
{
  try {
  const user =  await User.findById({userId});
  const accessToken = user.generateAccessToken();
  const refreshToken = user.generateRefreshToken();
  user.refreshToken = refreshToken;
  await user.save({validateBeforeSave : false}); // no need of validation before save here
  return { accessToken, refreshToken}
  } catch (error) {
    throw new ApiError(500, "something went wrong during setting access and refresh tokens")
  }
} */

const registerUser = asyncHandler(async (req, res) => {
  // get all body data
  const { username, email, fullName, password } = req.body;
  // check  reqired data is available or empty >>>return required msg
  if (
    username.trim() === "" ||
    email.trim() === "" ||
    fullName.trim() === "" ||
    password.trim() === ""
  ) {
    throw new ApiError(400, "All fields are required");
  }
  // find  exit user and check
  const existedUser = await User.findOne({
    $or: [{ username }, { email }],
  });
  if (existedUser) {
    throw new ApiError(409, "User Already Exists.");
  }
  // cover , avatar handle
  const avatarLocalPath = req.files?.avatar?.[0]?.path;
  const coverImageLocalPath = req.files?.coverImage?.[0]?.path;
  if (!avatarLocalPath) {
    throw new ApiError(400, "Avatar  file is required.");
  }
  // console.log(avatarLocalPath);
  // console.log(coverImageLocalPath);

  const avatar = await uploadOnCloudinary(avatarLocalPath);
  const coverImg = await uploadOnCloudinary(coverImageLocalPath);
  if (!avatar) {
    throw new ApiError(400, "Avatar path is required.");
  }
  // now create user

  const user = await User.create({
    fullName,
    username: username.toLowerCase(),
    email,
    password,
    avatar: avatar.url,
    coverImage: coverImg?.url || "",
  });

  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );
  if (!createdUser) {
    throw new ApiError(500, "server fail during registeration/error");
  }

  // return user , everything is done
  return res
    .status(201)
    .json(new ApiResponse(200, createdUser, "User Registered Successfully"));
});

// login user :
//1 . user body data --->
//2. validate data
//3. check is user is found
// 4. check credential is correct (password )
// 5. set access , refresh tokens via cookies
// 6. generate success login response
const loginUser = asyncHandler(async (req, res) => {
  const { email, username, password } = req.body;

  if (!email || !username || !password) {
    throw new ApiError(400, "all fileds are required , invalid data ");
  }

  const user = await User.findOne({
    $or: [{ username }, { email }],
  });

  if (!user) {
    throw new ApiError(404, "user does not exists");
  }
  const isPasswordValid = await user.isPasswordCorrect(password);
  if (!isPasswordValid) {
    throw new ApiError(401, "invalid credentials");
  }
  const { accessToken, refreshToken } =
    await generateAccessTokenAndRefreshToken(user._id);
  const loggedInUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  const options = {
    httpOnly: true,
    secure: true,
  };
  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(
        200,
        {
          user: loggedInUser,
          accessToken,
          refreshToken,
        },
        "User Logged In Succesfully "
      )
    );
});
//logout user :
//1. get cookies from --> req.body
//2. set all cookies NULL
//3.  logged out success
const logoutUser = asyncHandler(async (req, res) => {
  await User.findByIdAndUpdate(
    req.user._id,
    {
      $set: {
        refreshToken: undefined,
      },
    },
    {
      new: true,
    }
  );
  const options = {
    httpOnly: true,
    secure: true,
  };
  return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "User Logged Out Success"));
});
// set new access tooken
// 1. fetch user from refresh token
// 2. now user is found
// 3. generate new access token and set in cookie
// 4.
const refreshAccessToken = asyncHandler(async (req, res) => {
  const incomingRefreshToken =
    req.cookies?.refreshToken || req.body.refreshAccessToken;
  if (!incomingRefreshToken) {
    throw new ApiError(401, "Unauthorized request");
  }
  try {
    const decodedToken = jwt.verify(
      incomingRefreshToken,
      process.env.REFRESH_TOKEN_SECRET
    );
    const user = await User.findById(decodedToken?._id);
    if (!user) {
      throw new ApiError(401, "Invalid refresh token");
    }
    if (incomingRefreshToken !== user?.refreshToken) {
      throw new ApiError(401, "Refresh token expired or used");
    }
    const options = {
      httpOnly: true,
      secure: true,
    };

    const { accessToken, newRefreshToken } =
      await generateAccessTokenAndRefreshToken(user._id);

    return res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", newRefreshToken, options)
      .json(
        new ApiResponse(
          200,
          { accessToken, refreshToken: newRefreshToken },
          "Access Token Refreshed"
        )
      );
  } catch (error) {
    throw new ApiError(401, error?.message || "Invalid refresh token/error");
  }
});
export { registerUser, loginUser, logoutUser, refreshAccessToken };
