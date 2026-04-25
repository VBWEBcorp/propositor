'use client'

import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import LinkExtension from '@tiptap/extension-link'
import ImageExtension from '@tiptap/extension-image'
import Placeholder from '@tiptap/extension-placeholder'
import {
  Bold,
  Italic,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Quote,
  Minus,
  Link as LinkIcon,
  Image as ImageIcon,
  Undo,
  Redo,
  Unlink,
} from 'lucide-react'
import { useCallback, useEffect } from 'react'
import { cn } from '@/lib/utils'

interface RichEditorProps {
  content: string
  onChange: (html: string) => void
  placeholder?: string
}

function ToolbarButton({
  onClick,
  active,
  disabled,
  children,
  title,
}: {
  onClick: () => void
  active?: boolean
  disabled?: boolean
  children: React.ReactNode
  title: string
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      title={title}
      className={cn(
        'flex size-8 items-center justify-center rounded-md transition-colors',
        active
          ? 'bg-primary/15 text-primary'
          : 'text-muted-foreground hover:bg-muted hover:text-foreground',
        disabled && 'opacity-40 pointer-events-none'
      )}
    >
      {children}
    </button>
  )
}

function ToolbarDivider() {
  return <div className="w-px h-5 bg-border/60 mx-0.5" />
}

export function RichEditor({ content, onChange, placeholder }: RichEditorProps) {
  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        heading: { levels: [2, 3] },
      }),
      LinkExtension.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-primary underline underline-offset-4 hover:text-primary/80',
          rel: 'noopener noreferrer',
        },
      }),
      ImageExtension.configure({
        HTMLAttributes: {
          class: 'rounded-xl max-w-full my-4',
        },
      }),
      Placeholder.configure({
        placeholder: placeholder || 'Commencez à écrire votre article...',
      }),
    ],
    content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML())
    },
    editorProps: {
      attributes: {
        class: 'prose-editor min-h-[300px] px-4 py-3 outline-none text-sm leading-relaxed',
      },
    },
  })

  // Sync content from outside
  useEffect(() => {
    if (editor && content !== editor.getHTML()) {
      editor.commands.setContent(content, { emitUpdate: false })
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const addLink = useCallback(() => {
    if (!editor) return
    const previousUrl = editor.getAttributes('link').href
    const url = window.prompt('URL du lien', previousUrl || 'https://')

    if (url === null) return
    if (url === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run()
      return
    }

    editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run()
  }, [editor])

  const addImage = useCallback(() => {
    if (!editor) return
    const url = window.prompt('URL de l\'image', 'https://')
    if (url) {
      editor.chain().focus().setImage({ src: url }).run()
    }
  }, [editor])

  if (!editor) return null

  return (
    <div className="rounded-lg border border-input overflow-hidden bg-transparent">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-0.5 px-2 py-1.5 border-b border-border/60 bg-muted/30">
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBold().run()}
          active={editor.isActive('bold')}
          title="Gras"
        >
          <Bold className="size-3.5" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleItalic().run()}
          active={editor.isActive('italic')}
          title="Italique"
        >
          <Italic className="size-3.5" />
        </ToolbarButton>

        <ToolbarDivider />

        <ToolbarButton
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          active={editor.isActive('heading', { level: 2 })}
          title="Titre de section"
        >
          <Heading2 className="size-3.5" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          active={editor.isActive('heading', { level: 3 })}
          title="Sous-titre"
        >
          <Heading3 className="size-3.5" />
        </ToolbarButton>

        <ToolbarDivider />

        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          active={editor.isActive('bulletList')}
          title="Liste à puces"
        >
          <List className="size-3.5" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          active={editor.isActive('orderedList')}
          title="Liste numérotée"
        >
          <ListOrdered className="size-3.5" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          active={editor.isActive('blockquote')}
          title="Citation"
        >
          <Quote className="size-3.5" />
        </ToolbarButton>

        <ToolbarDivider />

        <ToolbarButton
          onClick={addLink}
          active={editor.isActive('link')}
          title="Ajouter un lien"
        >
          <LinkIcon className="size-3.5" />
        </ToolbarButton>
        {editor.isActive('link') && (
          <ToolbarButton
            onClick={() => editor.chain().focus().unsetLink().run()}
            title="Supprimer le lien"
          >
            <Unlink className="size-3.5" />
          </ToolbarButton>
        )}
        <ToolbarButton
          onClick={addImage}
          title="Ajouter une image"
        >
          <ImageIcon className="size-3.5" />
        </ToolbarButton>

        <ToolbarDivider />

        <ToolbarButton
          onClick={() => editor.chain().focus().setHorizontalRule().run()}
          title="Séparateur"
        >
          <Minus className="size-3.5" />
        </ToolbarButton>

        <div className="flex-1" />

        <ToolbarButton
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().undo()}
          title="Annuler"
        >
          <Undo className="size-3.5" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().redo()}
          title="Rétablir"
        >
          <Redo className="size-3.5" />
        </ToolbarButton>
      </div>

      {/* Editor */}
      <EditorContent editor={editor} />

      <style jsx global>{`
        .prose-editor h2 {
          font-size: 1.25rem;
          font-weight: 700;
          margin-top: 1.5rem;
          margin-bottom: 0.5rem;
          color: var(--foreground);
          font-family: var(--font-display);
        }
        .prose-editor h3 {
          font-size: 1.1rem;
          font-weight: 600;
          margin-top: 1.25rem;
          margin-bottom: 0.5rem;
          color: var(--foreground);
          font-family: var(--font-display);
        }
        .prose-editor p {
          margin-bottom: 0.75rem;
          color: var(--muted-foreground);
        }
        .prose-editor ul,
        .prose-editor ol {
          padding-left: 1.5rem;
          margin-bottom: 0.75rem;
          color: var(--muted-foreground);
        }
        .prose-editor ul { list-style: disc; }
        .prose-editor ol { list-style: decimal; }
        .prose-editor li { margin-bottom: 0.25rem; }
        .prose-editor blockquote {
          border-left: 3px solid hsl(var(--primary));
          padding-left: 1rem;
          margin: 1rem 0;
          color: var(--muted-foreground);
          font-style: italic;
        }
        .prose-editor hr {
          border: none;
          border-top: 1px solid var(--border);
          margin: 1.5rem 0;
        }
        .prose-editor img {
          border-radius: 0.75rem;
          max-width: 100%;
          margin: 1rem 0;
        }
        .prose-editor a {
          color: hsl(var(--primary));
          text-decoration: underline;
          text-underline-offset: 4px;
        }
        .prose-editor p.is-editor-empty:first-child::before {
          content: attr(data-placeholder);
          float: left;
          color: var(--muted-foreground);
          opacity: 0.4;
          pointer-events: none;
          height: 0;
        }
        .prose-editor:focus-visible {
          outline: none;
        }
      `}</style>
    </div>
  )
}
