// app/providers.jsx

'use client'

import { ThemeProvider } from 'next-themes'
import React from "react";

export const Providers: React.FC<{children: React.ReactNode}> = ({ children }) => {
    return <ThemeProvider attribute="class">{children}</ThemeProvider>
}