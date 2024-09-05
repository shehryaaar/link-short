'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

import { getDataById } from '@/utilities/axios';
import Spinner from '@/components/spinner/Spinner';
import RedirectingSpinner from '@/public/gifs/loading.json';

export default function Redirect({ params }) {
    const shortId = params.shortId;
    const route = useRouter();

    useEffect(() => {
        const fetchApiData = async (shortId) => {
            try {
                const data = await getDataById('/api/v1/', shortId);

                route.push(data?.data?.url);
            } catch (error) {}
        };

        if (shortId) {
            fetchApiData(shortId);
        }
    }, [shortId]);

    return (
        <div className="flex items-center justify-center gap-4">
            <Spinner animation={RedirectingSpinner} />

            <p>Redirecting...</p>
        </div>
    );
}
