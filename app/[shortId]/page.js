'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

import { getDataById } from '@/utilities/axios';
import Spinner from '@/components/spinner/Spinner';

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

    return <Spinner />;
}
