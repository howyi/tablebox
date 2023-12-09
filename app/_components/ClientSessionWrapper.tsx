'use client'

import React from 'react'
import {SessionProvider} from "next-auth/react"

export const ClientSessionWrapper: React.FC<{children: React.ReactNode}> = (props) => {
    return (
        <SessionProvider>
            {props.children}
        </SessionProvider>
    )
}
