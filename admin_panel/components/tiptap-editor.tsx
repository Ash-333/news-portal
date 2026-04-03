"use client"

import { useEffect } from "react"
import { useEditor, EditorContent } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import Image from "@tiptap/extension-image"
import Link from "@tiptap/extension-link"
import Placeholder from "@tiptap/extension-placeholder"

import { Button } from "@/components/ui/button"
import { Toggle } from "@/components/ui/toggle"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"

// Icons
import {
  Bold,
  Italic,
  List,
  ListOrdered,
  Quote,
  Heading2,
  Heading3,
  Image as ImageIcon,
  Link as LinkIcon,
  Strikethrough,
  Code,
  Undo,
  Redo,
} from "lucide-react"

export interface TipTapEditorProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  className?: string
  onRequestImageInsert?: (insertFn: (url: string) => void) => void
}

export function TipTapEditor({
  value,
  onChange,
  placeholder,
  className,
  onRequestImageInsert,
}: TipTapEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [2, 3, 4] },
      }),
      Image.configure({
        inline: false,
        allowBase64: false,
      }),
      Link.configure({
        openOnClick: true,
        linkOnPaste: true,
        defaultProtocol: "https",
        HTMLAttributes: {
          class: "text-primary underline underline-offset-4 cursor-pointer",
        },
      }),
      Placeholder.configure({
        placeholder: placeholder || "Write your content...",
      }),
    ],
    content: value || "",
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML())
    },
  })

  useEffect(() => {
    if (!editor) return
    const current = editor.getHTML()
    const next = value || ""
    if (current !== next) {
      editor.commands.setContent(next, false)
    }
  }, [editor, value])

  if (!editor) return null

  const handleImageClick = () => {
    if (!onRequestImageInsert) return
    onRequestImageInsert((url: string) => {
      editor.chain().focus().setImage({ src: url }).run()
    })
  }

  const setLink = () => {
    const previousUrl = editor.getAttributes('link').href
    const url = window.prompt('Enter URL:', previousUrl)
    if (url === null) return
    if (url === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run()
      return
    }
    editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run()
  }

  return (
    <div
      className={cn(
        "flex flex-col border rounded-md bg-background overflow-hidden",
        "min-h-[600px]", // Minimum height; content area scrolls if needed
        className
      )}
    >
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-1 border-b bg-muted/40 px-2 py-1 flex-shrink-0">
        <Toggle
          size="sm"
          onPressedChange={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().undo()}
          aria-label="Undo"
        >
          <Undo className="h-4 w-4" />
        </Toggle>
        <Toggle
          size="sm"
          onPressedChange={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().redo()}
          aria-label="Redo"
        >
          <Redo className="h-4 w-4" />
        </Toggle>

        <Separator orientation="vertical" className="mx-1 h-6" />

        <Toggle
          size="sm"
          pressed={editor.isActive("bold")}
          onPressedChange={() => editor.chain().focus().toggleBold().run()}
          aria-label="Bold"
        >
          <Bold className="h-4 w-4" />
        </Toggle>
        <Toggle
          size="sm"
          pressed={editor.isActive("italic")}
          onPressedChange={() => editor.chain().focus().toggleItalic().run()}
          aria-label="Italic"
        >
          <Italic className="h-4 w-4" />
        </Toggle>
        <Toggle
          size="sm"
          pressed={editor.isActive("strike")}
          onPressedChange={() => editor.chain().focus().toggleStrike().run()}
          aria-label="Strikethrough"
        >
          <Strikethrough className="h-4 w-4" />
        </Toggle>

        <Separator orientation="vertical" className="mx-1 h-6" />

        <Toggle
          size="sm"
          pressed={editor.isActive("heading", { level: 2 })}
          onPressedChange={() =>
            editor.chain().focus().toggleHeading({ level: 2 }).run()
          }
          aria-label="Heading 2"
        >
          <Heading2 className="h-4 w-4" />
        </Toggle>
        <Toggle
          size="sm"
          pressed={editor.isActive("heading", { level: 3 })}
          onPressedChange={() =>
            editor.chain().focus().toggleHeading({ level: 3 }).run()
          }
          aria-label="Heading 3"
        >
          <Heading3 className="h-4 w-4" />
        </Toggle>

        <Separator orientation="vertical" className="mx-1 h-6" />

        <Toggle
          size="sm"
          pressed={editor.isActive("bulletList")}
          onPressedChange={() => editor.chain().focus().toggleBulletList().run()}
          aria-label="Bullet List"
        >
          <List className="h-4 w-4" />
        </Toggle>
        <Toggle
          size="sm"
          pressed={editor.isActive("orderedList")}
          onPressedChange={() =>
            editor.chain().focus().toggleOrderedList().run()
          }
          aria-label="Ordered List"
        >
          <ListOrdered className="h-4 w-4" />
        </Toggle>
        <Toggle
          size="sm"
          pressed={editor.isActive("blockquote")}
          onPressedChange={() => editor.chain().focus().toggleBlockquote().run()}
          aria-label="Quote"
        >
          <Quote className="h-4 w-4" />
        </Toggle>

        <Separator orientation="vertical" className="mx-1 h-6" />

        <Toggle
          size="sm"
          pressed={editor.isActive("link")}
          onPressedChange={setLink}
          aria-label="Link"
        >
          <LinkIcon className="h-4 w-4" />
        </Toggle>

        {onRequestImageInsert && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleImageClick}
            className="h-8 w-8 p-0"
            aria-label="Insert Image"
          >
            <ImageIcon className="h-4 w-4" />
          </Button>
        )}
      </div>

      {/* Editor content area */}
      <div className="flex-1 overflow-y-auto p-4 bg-background">
        <EditorContent
          editor={editor}
          className="h-full prose dark:prose-invert max-w-none focus:outline-none [&_.ProseMirror]:min-h-[600px]"
        />
      </div>
    </div>
  )
}