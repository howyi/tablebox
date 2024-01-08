"use client"
/**
 * This code was generated by v0 by Vercel.
 * @see https://v0.dev/t/3CQ85BS8TY2
 */
import {Button} from "@/app/_components/ui/button"
import {DialogTrigger, DialogContent, Dialog} from "@/app/_components/ui/dialog"
import {CardTitle, CardHeader, CardContent, CardFooter, Card} from "@/app/_components/ui/card"
import {Label} from "@/app/_components/ui/label"
import {Input} from "@/app/_components/ui/input"
import {SubmitButton} from "@/app/_components/submit-button";
import React from "react";
import {deleteNote, updateNote} from "@/app/_actions/bo/notes";

type Props = {
    noteId: number;
    name: string;
    slug: string
}
export const NoteSetting: React.FC<Props> = (params) => {
    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="default" >⚙️</Button>
            </DialogTrigger>
            <DialogContent className="p-0">
                <Card className={'bg-white dark:bg-slate-700'}>
                    <CardHeader>
                        <CardTitle>Settings</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form action={updateNote} id={'update'}>
                            <div className="space-y-4">
                                <Label htmlFor="project-name">Note Name</Label>
                                <Input name="name" id="name" placeholder="Enter note name"
                                       defaultValue={params.name}/>
                            </div>

                            <div className="space-y-4">
                                <Label htmlFor="project-url">Note URL</Label>
                                {/*<Input id="project-url" placeholder="Enter note URL"/>*/}
                                <div
                                    className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md">
                      <span className="flex select-none items-center pl-3 text-gray-500 sm:text-sm">
                        tablebox.vercel.app/bo/
                      </span>
                                    <Input
                                        type="text"
                                        name="slug"
                                        id="slug"
                                        autoComplete="username"
                                        className="border-0 bg-transparent pl-1 focus:ring-0"
                                        placeholder="..."
                                        defaultValue={params.slug}
                                    />
                                </div>
                            </div>
                            <Input
                                type="hidden"
                                name="note_id"
                                id="note_id"
                                value={params.noteId}
                            />
                        </form>
                    </CardContent>
                    <CardFooter>
                        <form action={deleteNote}>
                            <Input
                                type="hidden"
                                name="note_id"
                                id="note_id"
                                value={params.noteId}
                            />
                            <SubmitButton variant="ghost" className={"hover:bg-red-600"}>Delete</SubmitButton>
                        </form>
                        <SubmitButton form={'update'} className="ml-auto bg-green-600 hover:bg-green-800">Save Changes</SubmitButton>
                    </CardFooter>
                </Card>
            </DialogContent>
        </Dialog>
    )
}
