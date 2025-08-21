'use client';

import { register } from '@/actions/auth';
import { useUserStore } from '@/lib/userStore';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useActionState, useEffect, useState } from 'react';

     

export default function RegisterPage() {

    const {setToken, setUser} = useUserStore()
    const [fileName, setFileName] = useState('Upload Profile Picture');

    const [state, action, isPending] = useActionState(register,undefined)
    const router = useRouter();

    useEffect(() => {
        if (state?.user && state?.accessToken) {
        setUser(state.user);
        setToken(state.accessToken);
        router.push("/chat");
        setPreviewImage('');
        setFileName('Upload Profile Picture');
        }
    }, [state]);


    const [previewImage, setPreviewImage] = useState<string>('');


    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {

            setPreviewImage(URL.createObjectURL(file));
            setFileName(file.name);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="bg-white p-8 rounded-lg shadow-md w-96">
                <h1 className="text-2xl font-bold mb-6 text-center">Register</h1>
                <form action={action} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Username</label>
                        <input
                            type="text"
                            name="username"
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                            
                        />
                        {state?.error?.username && ( <p className="text-red-500 text-sm mt-1">{state.error.username}</p>)}
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Email</label>
                        <input
                            type="email"
                            name="email"
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                            
                        />
                        {state?.error?.email && ( <p className="text-red-500 text-sm mt-1">{state.error.email}</p>)}

                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Password</label>
                        <input
                            type="password"
                            name="password"
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                            
                        />
                        {state?.error?.password && ( <p className="text-red-500 text-sm mt-1">{state.error.password}</p>)}

                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Confirm Password</label>
                        <input
                            type="password"
                            name="confirmPassword"
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                            
                        />
                    </div>
                    {state?.error?.confirmPassword && ( <p className="text-red-500 text-sm mt-1">{state.error.confirmPassword}</p>)}
                    <div >

                    <div className="mt-1 block w-full">
                        <label
                            htmlFor="profilePicture"
                            className="flex items-center justify-center w-full px-4 py-3 bg-blue-500 text-white rounded-md shadow-sm cursor-pointer hover:bg-blue-600 transition-colors"
                        >
                            
                            {fileName}
                        </label>
                        <input
                            id="profilePicture"
                            name="profilePicture"
                            type="file"
                            accept="image/*"
                            onChange={handleFileChange}
                            className="hidden"
                        />
                        </div>
                        {previewImage && (
                            <div className="m-auto mt-4 w-20 h-20">
                                <Image
                                    src={previewImage}
                                    alt="Profile preview"
                                    width={100}
                                    height={100}
                                    
                                    className="rounded-full w-20 h-20"
                                />
                            </div>
                        )}
                    </div>                    
                    { state?.error?.general && ( <p className="text-red-500 text-center text-sm mt-2"> {state.error.general} </p> )}
                    <button
                        disabled={isPending}
                        type="submit"
                        className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600"
                    >
                        {isPending? "Loading..." : "Register"}
                    </button>
                </form>
            </div>
        </div>
    );
}