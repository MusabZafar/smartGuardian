'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

export default function OAuth2Redirect() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const token = searchParams.get('token'); // Extract the token from the URL

    useEffect(() => {
        if (token) {
            // Save the token in localStorage
            localStorage.setItem('token', token);
            // Redirect to the dashboard
            router.push('/dashboard');
        } else {
            // If no token is found, redirect to login
            router.push('/login');
        }
    }, [token, router]);

    return null; // Nothing to render
}
