'use client'

import { useFormStatus } from 'react-dom'
import React, {PropsWithChildren} from "react";
import {Button, ButtonProps} from "@/app/_components/ui/button";

export const SubmitButton: React.FC<PropsWithChildren<ButtonProps>> = (props) => {
    const { pending } = useFormStatus()

    return (
        <Button {...props} type="submit" aria-disabled={pending} disabled={pending}/>
    )
}