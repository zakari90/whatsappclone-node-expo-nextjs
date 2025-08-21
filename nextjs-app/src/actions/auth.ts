"use server"
import axios from "axios";
import { z } from "zod";

const RegisterFormSchema = z.object(
    {
        username: z.string().min(1, { message: "Username is required" }),
        email: z.string().email({ message: "Invalid email address" }),
        password: z.string().min(1, { message: "Password must be at least 6 characters long" }),
        confirmPassword: z.string().min(1, { message: "Confirm Password is required" }),
        profilePicture: z.instanceof(File||String).optional(),
    }
).superRefine((data, ctx) =>{
    if(data.password !== data.confirmPassword){
        ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Passwords do not match",  
            path: ['confirmPassword'],
        })
    }

} )

export async function register(state: unknown, formData: FormData) {

    try {
        const data = {
            username: formData.get("username"),
            email: formData.get("email"),
            password: formData.get("password"),
            confirmPassword: formData.get("confirmPassword"),
            // profilePicture: formData.get("profilePicture"),
          };
    
        const result = RegisterFormSchema.safeParse(data);
        if (!result.success) {
            console.log(result.error.format());
            return{
                error: result.error.flatten().fieldErrors,
            };
        }
        const form = new FormData();
        form.append("username", formData.get("username") as string);
        form.append("email", formData.get("email") as string);
        form.append("password", formData.get("password") as string);
        // const file = formData.get("profilePicture") as File;
        // if (file) {
        //     form.append("profilePicture", file);
        // }

        const response = await axios.post("http://localhost:8000/user/register", data
        // , { headers: {    "Content-Type": "multipart/form-data",    }, }
        );

        if (response.data.error) {
            console.log(response.data.error);
            return {
                error: response.data.error,
            };
        }
        return response.data;
    } catch (error) {
        console.log(error);
        if (axios.isAxiosError(error)) {
            console.error('Axios error:', error.response?.data || error.message);
            // return {
            //   error: {
            //     general: [error.response?.data?.message || "Server error occurred"],
            //   },
            // };
          }
    }
}


const LoginFormSchema = z.object(
    {
        email: z.string().email({ message: "Invalid email address" }),
        password: z.string().min(1, { message: "Password must be at least 6 characters long" }),
    }
)

export async function login(state: unknown, formData: FormData) {

    try {
        const data = {
            email: formData.get("email"),
            password: formData.get("password"),
          };
    
        const result = LoginFormSchema.safeParse(data);
        if (!result.success) {
            console.log(result.error.format());
            return{
                error: result.error.flatten().fieldErrors,
            };
        }

        const response = await axios.post("http://localhost:8000/user/login", data
        );

        if (response.data.error) {
            console.log(response.data.error);
            return {
                error: response.data.error,
            };
        }
        return response.data;
    } catch (error) {
        console.log(error);
        if (axios.isAxiosError(error)) {
            console.error('Axios error:', error.response?.data || error.message);
            // return {
            //   error: {
            //     general: [error.response?.data?.message || "Server error occurred"],
            //   },
            // };
          }
    }
}
//todo add logout function bacnkend
//todo add logout function frontend
export async function logout() { 

 }


//todo add forgot password function
export async function forgotPassword() {    
 }

//todo add reset password function
export async function resetPassword() {
    //todo add reset password function
 }


export async function updateProfile(state: unknown, formData: FormData) {

    try {

    const token = formData.get("token") as string;
    if (!token) {
    return { success: false, error: "No token provided" };
    }

    const data = {
    username: formData.get("username"),
    status: formData.get("status"),
    };

    const profileUpdateResponse = await axios.post(
    "http://localhost:8000/user/updateprofile",
    data,
    {
        headers: {
        authorization: `bearer ${token}`,
        },
    }
    );

    if (profileUpdateResponse.data.error) {

    return {
        success: false,
        error: profileUpdateResponse.data.error,
    };
    }

    const updatedUser = profileUpdateResponse.data;
   

    return {
    success: true,
    updatedUser,
    };
} catch (error) {
    console.error("Error during profile update:", error);

    if (axios.isAxiosError(error)) {
    return {
        success: false,
        error: error.response?.data?.message || "An error occurred while updating the profile.",
    };
    }

    return {
    success: false,
    error: "Internal server error",
    };
}
}
 