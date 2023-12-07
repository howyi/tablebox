'use server'

import React from "react";
import {TrashIcon} from "@heroicons/react/20/solid";
import {deleteTodo, fetchTodos} from "@/app/_actions/todos";
import Image from "next/image";
import {AddTodoForm} from "@/app/_components/AddTodoForm";

export const Todos: React.FC = async () => {

    const todos = await fetchTodos()

    return <div>

        <div className="px-4 sm:px-6 lg:px-8">
            <div className="sm:flex sm:items-center">
                <div className="sm:flex-auto">
                    <h1 className="text-base font-semibold leading-6 text-gray-900">ToDo</h1>
                </div>
                <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
                    <div>
                        <AddTodoForm/>
                    </div>
                </div>
            </div>
            <div className="mt-8 flow-root">
                <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                    <div className="inline-block min-w-full py-2 sm:px-6 lg:px-8">
                        <table className="min-w-full divide-y divide-gray-300 table-fixed">
                            <thead>
                            <tr>
                                <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-0">
                                    ID
                                </th>
                                <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">

                                </th>
                                <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                    タイトル
                                </th>
                                <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-0">
                                    <span className="sr-only">Edit</span>
                                </th>
                            </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                            {todos.map((c) => (
                                <tr key={c.id}>
                                    <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-0">
                                        {c.id}
                                    </td>
                                    <td className="whitespace-nowrap px-3 py-4">
                                        { c.user?.image &&
                                            <Image
                                                className="inline-block h-6 w-6"
                                                src={c.user?.image ?? ""}
                                                width={100}
                                                height={100}
                                                alt=""
                                            />
                                        }
                                    </td>
                                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{c.title}</td>
                                    <td className="whitespace-nowrap px-3 py-4 text-sm text-right">

                                        <form action={deleteTodo}>
                                        <input
                                            type="hidden"
                                            name="todo_id"
                                            id="todo_id"
                                            value={c.id}
                                        />
                                        <button
                                            type="submit"
                                            className="inline-flex items-center gap-x-1.5 rounded-md px-2.5 py-1.5 text-sm font-semibold text-red-600 bg-red-50 shadow-sm hover:bg-red-100"
                                        >
                                            <TrashIcon className="-ml-0.5 h-5 w-5" aria-hidden="true" />
                                            削除
                                        </button>
                                        </form>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    </div>
}
