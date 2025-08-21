'use client';

import { login } from '@/actions/auth';
import { useUserStore } from '@/lib/userStore';
import { useRouter } from 'next/navigation';
import { useActionState, useEffect } from 'react';

     

export default function LoginPage() {

    const { setToken, setUser} = useUserStore()


    const [state, action, isPending] = useActionState(login,undefined)
    const router = useRouter();

    useEffect(() => {
        if (state?.user && state?.accessToken) {
        setUser(state.user);
        setToken(state.accessToken);
        router.push("/chat");
        }
    }, [router, setToken, setUser, state]);


    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="bg-white p-8 rounded-lg shadow-md w-96">
                <h1 className="text-2xl font-bold mb-6 text-center">Register</h1>
                <form action={action} className="space-y-4">

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

                    {state?.error?.general && (
                <p className="text-red-500 text-center text-sm mt-2">
                    {state.error.general}
                </p>
                )}
                    <button
                        disabled={isPending}
                        type="submit"
                        className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600"
                    >
                        {isPending? "Loading..." : "Login"}
                    </button>
                </form>
            </div>
        </div>
    );
}