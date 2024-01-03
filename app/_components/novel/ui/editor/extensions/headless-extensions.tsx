import StarterKit from "@tiptap/starter-kit";
import HorizontalRule from "@tiptap/extension-horizontal-rule";
import TiptapLink from "@tiptap/extension-link";
import TiptapImage from "@tiptap/extension-image";
import Placeholder from "@tiptap/extension-placeholder";
import TiptapUnderline from "@tiptap/extension-underline";
import TextStyle from "@tiptap/extension-text-style";
import { Color } from "@tiptap/extension-color";
import TaskItem from "@tiptap/extension-task-item";
import TaskList from "@tiptap/extension-task-list";
import { Markdown } from "tiptap-markdown";
import Highlight from "@tiptap/extension-highlight";
import { InputRule } from "@tiptap/core";
import UploadImagesPlugin from "@/app/_components/novel/ui/editor/plugins/upload-images";
import UpdatedImage from "./updated-image";
import CustomKeymap from "./custom-keymap";
import DragAndDrop from "./drag-and-drop";

export const headlessExtensions = [
  StarterKit.configure({
    bulletList: {
      HTMLAttributes: {
        class: "list-disc list-outside leading-3 mt-2",
      },
    },
    orderedList: {
      HTMLAttributes: {
        class:
          "list-decimal list-outside leading-3 mt-2",
      },
    },
    listItem: {
      HTMLAttributes: {
        class: "leading-normal mb-2",
      },
    },
    blockquote: {
      HTMLAttributes: {
        class: "border-l-4 border-[var(--novel-stone-700)]",
      },
    },
    codeBlock: {
      HTMLAttributes: {
        class:
          "rounded-sm bg-[var(--novel-stone-100)] p-5 font-mono font-medium text-[var(--novel-stone-800)]",
      },
    },
    code: {
      HTMLAttributes: {
        class:
          "rounded-md bg-[var(--novel-stone-200)] px-1.5 py-1 font-mono font-medium text-[var(--novel-code)]",
        spellcheck: "false",
      },
    },
    horizontalRule: false,
    dropcursor: {
      color: "var(--novel-dropcursor)",
      width: 4,
    },
    gapcursor: false,
    history: false,
  }),
  // patch to fix horizontal rule bug: https://github.com/ueberdosis/tiptap/pull/3859#issuecomment-1536799740
  HorizontalRule.extend({
    addInputRules() {
      return [
        new InputRule({
          find: /^(?:---|—-|___\s|\*\*\*\s)$/,
          handler: ({ state, range }) => {
            const attributes = {};

            const { tr } = state;
            const start = range.from;
            let end = range.to;

            tr.insert(start - 1, this.type.create(attributes)).delete(
              tr.mapping.map(start),
              tr.mapping.map(end)
            );
          },
        }),
      ];
    },
  }).configure({
    HTMLAttributes: {
      class: "mt-4 mb-6 border-t border-[var(--novel-stone-300)]",
    },
  }),
  TiptapLink.configure({
    HTMLAttributes: {
      class:
        "text-[var(--novel-link)] underline underline-offset-[3px] hover:text-[var(--novel-link-hover)] transition-colors cursor-pointer",
    },
  }),
  TiptapImage.extend({
    addProseMirrorPlugins() {
      return [UploadImagesPlugin()];
    },
  }).configure({
    allowBase64: true,
    HTMLAttributes: {
      class: "rounded-lg border border-[var(--novel-stone-200)]",
    },
  }),
  UpdatedImage.configure({
    HTMLAttributes: {
      class: "rounded-lg border border-[var(--novel-stone-200)]",
    },
  }),
  Placeholder.configure({
    placeholder: ({ node }) => {
      if (node.type.name === "heading") {
        return `見出し ${node.attrs.level}`;
      }
      return "'/'を入力してコマンド一覧を表示、'++'でAIに続きの文章を書いてもらうことができます";
    },
    includeChildren: true,
  }),
  TiptapUnderline,
  TextStyle,
  Color,
  Highlight.configure({
    multicolor: true,
  }),
  TaskList.configure({
    HTMLAttributes: {
      class: "not-prose pl-2",
    },
  }),
  TaskItem.configure({
    HTMLAttributes: {
      class: "flex items-start my-4",
    },
    nested: true,
  }),
  Markdown.configure({
    html: false,
    transformCopiedText: true,
    transformPastedText: true,
  }),
  CustomKeymap,
  DragAndDrop,
];
