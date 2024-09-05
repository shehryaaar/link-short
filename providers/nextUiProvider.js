'use client';

import { NextUIProvider as Provider } from '@nextui-org/react';

export function NextUIProvider({ children }) {
    return <Provider>{children}</Provider>;
}
