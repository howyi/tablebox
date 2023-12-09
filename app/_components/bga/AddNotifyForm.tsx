'use client'

import React from "react";
import {addNotify} from "@/app/_actions/bga";

export const AddNotifyForm: React.FC = () => {
    const ref = React.useRef<HTMLFormElement>(null)
    const [disabled, setDisabled] = React.useState(false)
    return <form
        onSubmit={() => setDisabled(true)}
        action={async (formData) => {
            if (formData.get("url") == "") {
                setDisabled(false)
                return
            }
            try {
                await addNotify(formData)
            } catch (e) {
                throw e
            } finally {
                setDisabled(false)
            }
            ref.current?.reset()
        }}
        className="mt-2 flex rounded-md shadow-sm"
        ref={ref}
    >
        <div className="relative flex flex-grow items-stretch focus-within:z-10">
            <input
                type="text"
                name="url"
                id="url"
                className="block w-full rounded-none rounded-l-md border-0 py-1.5 pl-2.5 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                placeholder="https://boardgamearena.com/N/sevenwonders?table=XXXXXXXX"
                disabled={disabled}
            />
        </div>
        <button
            type="submit"
            disabled={disabled}
            className="w-[150px] justify-center relative -ml-px inline-flex text-white bg-indigo-600 items-center gap-x-1.5 rounded-r-md px-3 py-2 text-sm font-semibold hover:bg-indigo-500 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 disabled:bg-gray-400"
        >
            {disabled ? '追加中' : '追加'}
        </button>
    </form>
}
