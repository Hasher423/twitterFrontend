import { useEffect, useState } from 'react';
import { api } from '../api'; // Adjust path to your api.ts file
import type { createdUser } from '../types/user.ts';
import LogoutButton from '../Components/Logout.tsx';

interface ProfilePageProp {
    setAccessToken: (token: string) => void
}

export default function Profile({ setAccessToken }: ProfilePageProp) {
    const [user, setUser] = useState<createdUser | null>(null);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                // Axios automatically passes the memory token in the header via interceptors
                const response = await api.get('/auth/me');
                setUser(response.data.user);
            } catch (err: any) {
                setError(err.response?.data?.message || 'Failed to load profile details.');
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, []);

    if (loading) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-[#FAFAFA] font-['Inter',sans-serif]">
                <div className="h-5 w-5 animate-spin rounded-full border-2 border-gray-200 border-t-black" />
            </div>
        );
    }

    return (
        <div className="flex min-h-screen items-center justify-center bg-[#FAFAFA] font-['Inter',sans-serif] px-4 py-12 sm:px-6 lg:px-8">
            <div className="w-full max-w-md space-y-6 rounded-xl border border-gray-200/60 bg-white p-8 shadow-sm">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold tracking-tight text-black">Profile Details</h2>
                    <LogoutButton setAccessToken={setAccessToken} />
                </div>

                {error ? (
                    <div className="rounded-lg bg-gray-50 p-4 text-xs text-black border border-gray-200">
                        <p className="font-medium">{error}</p>
                    </div>
                ) : (
                    <div className="divide-y divide-gray-100 border-t border-b border-gray-100 py-2">
                        <div className="flex justify-between py-3 text-sm">
                            <span className="text-gray-500 font-medium">Username</span>
                            <span className="text-black font-semibold">@{user?.username}</span>
                        </div>
                        <div className="flex justify-between py-3 text-sm">
                            <span className="text-gray-500 font-medium">Email Address</span>
                            <span className="text-black font-semibold">{user?.email}</span>
                        </div>
                        <div className="flex justify-between py-3 text-sm">
                            <span className="text-gray-500 font-medium">User ID</span>
                            <span className="text-gray-400 font-mono text-xs">{user?.id}</span>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}