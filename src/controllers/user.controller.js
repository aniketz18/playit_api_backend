import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiErrors.js";
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/apiResponse.js";

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
  console.log(avatarLocalPath);
  console.log(coverImageLocalPath);
  
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

  const createdUser = await User.findById(user._id).select("-password -refreshToken");
  if (!createdUser) {
    throw new ApiError(500, "server fail during registeration/error");
  }

  // return user , everything is done
  return res
    .status(201)
    .json(new ApiResponse(200, createdUser, "User Registered Successfully"));
});

export { registerUser };
