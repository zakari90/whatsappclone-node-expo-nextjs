import axios, { isAxiosError } from "axios";
import { RegisterFormData } from "@/app/(registration)/register";
import { LoginFormData } from "@/app/(registration)";
import * as FileSystem from "expo-file-system";
import { API_URL } from "@/constants/Config";
export { API_URL };

axios.defaults.baseURL = API_URL;

export const webUploadImage = async (token: string | null, file: File) => {
  const formData = new FormData();
  formData.append("profilePicture", file);

  const response = await axios.post(
    `${API_URL}/user/updateprofilepicture`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
        authorization: `bearer ${token}`,
      },
    },
  );
  return response.data;
};

export const mobileUploadImage = async (
  token: string | null,
  imageUri: string,
) => {
  const response = await FileSystem.uploadAsync(
    API_URL + `/user/updateprofilepicture`,
    imageUri,
    {
      httpMethod: "POST",
      headers: {
        authorization: `bearer ${token}`,
      },
      uploadType: FileSystem.FileSystemUploadType.MULTIPART,
      fieldName: "profilePicture",
      mimeType: "image/jpeg",
    },
  );

  if (response.body) {
    try {
      return JSON.parse(response.body);
    } catch (e) {
      console.error("Failed to parse mobile upload response:", e);
      return response;
    }
  }
  return response;
};
export const register = async (userData: RegisterFormData) => {
  console.log(userData);

  try {
    // const response = await axios.post("http://localhost:8000/user/register",data);

    const response = await axios.post("/user/register", userData);
    return response.data;
  } catch (error) {
    if (isAxiosError(error)) {
      throw new Error(error.response?.data?.message || "Registration failed");
    }
    throw new Error("An unexpected error occurred");
  }
};

export const login = async (userData: LoginFormData) => {
  try {
    const response = await axios.post("/user/login", userData);

    if (response.data.error) {
      return { error: response.data.error };
    }

    return response.data;
  } catch (error) {
    if (isAxiosError(error)) {
      throw new Error(error.response?.data?.message || "Login failed");
    }
    throw new Error("An unexpected error occurred");
  }
};

export const updateProfile = async (userData: any): Promise<any> => {
  console.log("userData in updateProfile:", userData);

  try {
    const { username, status, token } = userData;

    if (!token) {
      return { success: false, error: "No token provided" };
    }

    const response = await axios.post(
      "/user/updateprofile",
      { username, status },
      {
        headers: {
          authorization: `bearer ${token}`,
        },
      },
    );

    if (response.data.error) {
      return {
        success: false,
        error: response.data.error,
      };
    }

    return response.data;
  } catch (error) {
    console.error("Error during profile update:", error);

    if (isAxiosError(error)) {
      return {
        success: false,
        error:
          error.response?.data?.message ||
          "An error occurred while updating the profile.",
      };
    }

    return {
      success: false,
      error: "Internal server error",
    };
  }
};

// export const resetPassword = async (email: string) => {
//   try {
//     const response = await axios.post('/user/resetpassword', { email });
//     return response.data;
//   } catch (error) {
//     if (axios.isAxiosError(error)) {
//       throw new Error(error.response?.data?.message || 'Reset password failed');
//     }
//     throw new Error('An unexpected error occurred');
//   }
// };

export const getUsers = async () => {
  try {
    const userRes = await axios.get("/user");
    const users = userRes.data;

    if (!users.success) {
      console.log("Users error:", users.message);
      throw new Error(users.message || "Failed to fetch users");
    }

    return users.friends;
  } catch (error) {
    if (isAxiosError(error)) {
      console.error("Axios error:", error.response?.data || error.message);
      throw new Error(
        error.response?.data?.message || "Network error while fetching users",
      );
    } else {
      console.error("Unexpected error:", error);
      throw new Error("An unexpected error occurred while fetching users");
    }
  }
};

export const getMessages = async (token: string | null) => {
  console.log("token in getMessages:", token);

  if (!token) {
    console.warn("No token provided");
    return [];
  }

  try {
    const messageRes = await axios.get("/message", {
      headers: {
        authorization: "bearer " + token,
      },
    });

    console.log("messages response:", messageRes.data);

    const messages = messageRes.data;

    if (!messages.success) {
      console.error("Messages fetch error:", messages.message);
      throw new Error(messages.message || "Failed to fetch messages");
    }

    return messages.messages;
  } catch (error) {
    if (isAxiosError(error)) {
      console.error("Axios error:", error.response?.data || error.message);
      throw new Error(
        error.response?.data?.message ||
          "Network error while fetching messages",
      );
    } else {
      console.error("Unexpected error:", error);
      throw new Error("An unexpected error occurred while fetching messages");
    }
  }
};
