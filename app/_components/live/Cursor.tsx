'use client'

import React from "react";

type Props = {
    x: number;
    y: number;
    color: string;
    name: string;
    image: string;
};

export const Cursor: React.FC<Props> = ({ x, y, color, name, image }) => {
    return (
        <svg
            style={{
                position: "absolute",
                left: 0,
                top: 0,
                transform: `translateX(${x}px) translateY(${y}px)`,
            }}
            width="260"
            height="64"
            viewBox="0 0 260 64"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            <svg
                width="16"
                height="16"
            >
                <path
                    d="m13.67 6.03-11-4a.5.5 0 0 0-.64.64l4 11a.5.5 0 0 0 .935.015l1.92-4.8 4.8-1.92a.5.5 0 0 0 0-.935h-.015Z"
                    fill={color}
                />
            </svg>
            <text x="30" y="30" fill={color} >{name}</text>
            <image href={image} x="10" y="15" height="20" width="20" />
        </svg>
    );
}
