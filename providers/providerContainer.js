'use client';

import { NextUIProvider } from '@/providers/nextUiProvider';

export function ProviderContainer({ children }) {
    return (
        <>
            <NextUIProvider>{children}</NextUIProvider>
        </>
    );
}
