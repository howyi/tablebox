import { cn, getUrlFromString } from "@/app/_components/novel/lib/utils";
import { Editor } from "@tiptap/core";
import { Check, Trash } from "lucide-react";
import { Dispatch, FC, SetStateAction, useEffect, useRef } from "react";

interface LinkSelectorProps {
  editor: Editor;
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
}

export const LinkSelector: FC<LinkSelectorProps> = ({
  editor,
  isOpen,
  setIsOpen,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);

  // Autofocus on input by default
  useEffect(() => {
    inputRef.current && inputRef.current?.focus();
  });

  return (
    <div className="relative">
      <button
        type="button"
        className="flex h-full items-center space-x-2 px-3 py-1.5 text-sm font-medium text-[var(--novel-stone-600)] hover:bg-[var(--novel-stone-100)] active:bg-[var(--novel-stone-200)]"
        onClick={() => {
          setIsOpen(!isOpen);
        }}
      >
        <p className="text-base">↗</p>
        <p
          className={cn(
            "underline decoration-[var(--novel-stone-400)] underline-offset-4",
            {
              "text-[var(--novel-active)]": editor.isActive("link"),
            }
          )}
        >
          リンク
        </p>
      </button>
      {isOpen && (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            const input = e.currentTarget[0] as HTMLInputElement;
            const url = getUrlFromString(input.value);
            url && editor.chain().focus().setLink({ href: url }).run();
            setIsOpen(false);
          }}
          className="fixed top-full z-[99999] mt-1 flex w-60 overflow-hidden rounded border border-[var(--novel-stone-200)] bg-[var(--novel-white)] p-1 shadow-xl animate-in fade-in slide-in-from-top-1"
        >
          <input
            ref={inputRef}
            type="text"
            placeholder="リンクを貼り付け"
            className="flex-1 bg-[var(--novel-white)] p-1 text-sm outline-none"
            defaultValue={editor.getAttributes("link").href || ""}
          />
          {editor.getAttributes("link").href ? (
            <button
              type="button"
              className="flex items-center rounded-sm p-1 text-[var(--novel-red-600)] transition-all hover:bg-[var(--novel-red-100)] dark:hover:bg-[var(--novel-red-800)]"
              onClick={() => {
                editor.chain().focus().unsetLink().run();
                setIsOpen(false);
              }}
            >
              <Trash className="h-4 w-4" />
            </button>
          ) : (
            <button className="flex items-center rounded-sm p-1 text-[var(--novel-stone-600)] transition-all hover:bg-[var(--novel-stone-100)]">
              <Check className="h-4 w-4" />
            </button>
          )}
        </form>
      )}
    </div>
  );
};
