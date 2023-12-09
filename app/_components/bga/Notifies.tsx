'use server'

import React from "react";
import {db} from "@/app/_db/db";
import {deleteNotify, fetchNotifies} from "@/app/_actions/bga";
import {deleteTodo} from "@/app/_actions/todos";
import {TrashIcon} from "@heroicons/react/20/solid";

const transactions = [
    {
        id: 'AAPS0L',
        company: 'Chase & Co.',
        share: 'CAC',
        commission: '+$4.37',
        price: '$3,509.00',
        quantity: '12.00',
        netAmount: '$4,397.00',
    },
    // More transactions...
]

export const Notifies: React.FC = async () => {

    const notifies = await fetchNotifies()

    return <div className={'w-full'}>
        <table className="min-w-full divide-y divide-gray-300">
            <thead>
            <tr>
                <th
                    scope="col"
                    className="whitespace-nowrap py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-0"
                >
                    ID
                </th>
                <th
                    scope="col"
                    className="whitespace-nowrap px-2 py-3.5 text-left text-sm font-semibold text-gray-900"
                >
                    Table URL
                </th>
                <th scope="col" className="relative whitespace-nowrap py-3.5 pl-3 pr-4 sm:pr-0">
                    <span className="sr-only">削除</span>
                </th>
            </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
            {notifies.map((notify) => (
                <tr key={notify.id}>
                    <td className="whitespace-nowrap py-2 pl-4 pr-3 text-sm text-gray-500 sm:pl-0">
                        {notify.id}
                    </td>
                    <td className="whitespace-nowrap px-2 py-2 text-sm font-medium text-gray-900">
                        {notify.tableUrl}
                    </td>
                    <td className="relative whitespace-nowrap py-2 pl-3 pr-4 text-right text-sm font-medium sm:pr-0">
                        <form action={deleteNotify}>
                            <input
                                type="hidden"
                                name="id"
                                id="id"
                                value={notify.id}
                            />
                            <button
                                type="submit"
                                className="inline-flex items-center gap-x-1.5 rounded-md px-2.5 py-1.5 text-sm font-semibold text-red-600 bg-red-50 shadow-sm hover:bg-red-100"
                            >
                                <TrashIcon className="-ml-0.5 h-5 w-5" aria-hidden="true"/>
                                削除
                            </button>
                        </form>
                    </td>
                </tr>
            ))}
            </tbody>
        </table>
    </div>
}