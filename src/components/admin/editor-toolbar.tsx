'use client'

import type { Editor } from '@tiptap/react'
import {
  Bold,
  Italic,
  Strikethrough,
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Quote,
  Table as TableIcon,
  Link as LinkIcon,
  Undo,
  Redo,
  RemoveFormatting,
  Trash2,
  Plus,
} from 'lucide-react'

type Props = {
  editor: Editor | null
}

export function EditorToolbar({ editor }: Props) {
  if (!editor) return null

  const setLink = () => {
    const previousUrl = editor.getAttributes('link').href as string | undefined
    const url = window.prompt('URL du lien', previousUrl ?? 'https://')
    if (url === null) return
    if (url === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run()
      return
    }
    editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run()
  }

  const insertTable = () => {
    editor
      .chain()
      .focus()
      .insertTable({ rows: 3, cols: 2, withHeaderRow: true })
      .run()
  }

  const inTable = editor.isActive('table')

  return (
    <div className="no-print sticky top-[57px] z-30 flex flex-wrap items-center gap-1 border-b border-border/60 bg-background/95 px-3 py-2 backdrop-blur-xl">
      {/* Annuler / refaire */}
      <ToolBtn
        title="Annuler (Ctrl+Z)"
        onClick={() => editor.chain().focus().undo().run()}
        disabled={!editor.can().undo()}
      >
        <Undo className="size-4" />
      </ToolBtn>
      <ToolBtn
        title="Refaire (Ctrl+Y)"
        onClick={() => editor.chain().focus().redo().run()}
        disabled={!editor.can().redo()}
      >
        <Redo className="size-4" />
      </ToolBtn>

      <Sep />

      {/* Titres */}
      <ToolBtn
        title="Titre de section (H2)"
        active={editor.isActive('heading', { level: 2 })}
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
      >
        <Heading1 className="size-4" />
      </ToolBtn>
      <ToolBtn
        title="Sous-titre (H3)"
        active={editor.isActive('heading', { level: 3 })}
        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
      >
        <Heading2 className="size-4" />
      </ToolBtn>
      <ToolBtn
        title="Sous-sous-titre (H4)"
        active={editor.isActive('heading', { level: 4 })}
        onClick={() => editor.chain().focus().toggleHeading({ level: 4 }).run()}
      >
        <Heading3 className="size-4" />
      </ToolBtn>

      <Sep />

      {/* Inline */}
      <ToolBtn
        title="Gras (Ctrl+B)"
        active={editor.isActive('bold')}
        onClick={() => editor.chain().focus().toggleBold().run()}
      >
        <Bold className="size-4" />
      </ToolBtn>
      <ToolBtn
        title="Italique (Ctrl+I)"
        active={editor.isActive('italic')}
        onClick={() => editor.chain().focus().toggleItalic().run()}
      >
        <Italic className="size-4" />
      </ToolBtn>
      <ToolBtn
        title="Barré"
        active={editor.isActive('strike')}
        onClick={() => editor.chain().focus().toggleStrike().run()}
      >
        <Strikethrough className="size-4" />
      </ToolBtn>
      <ToolBtn title="Lien (Ctrl+K)" active={editor.isActive('link')} onClick={setLink}>
        <LinkIcon className="size-4" />
      </ToolBtn>

      <Sep />

      {/* Listes + citation */}
      <ToolBtn
        title="Liste à puces"
        active={editor.isActive('bulletList')}
        onClick={() => editor.chain().focus().toggleBulletList().run()}
      >
        <List className="size-4" />
      </ToolBtn>
      <ToolBtn
        title="Liste numérotée"
        active={editor.isActive('orderedList')}
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
      >
        <ListOrdered className="size-4" />
      </ToolBtn>
      <ToolBtn
        title="Citation"
        active={editor.isActive('blockquote')}
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
      >
        <Quote className="size-4" />
      </ToolBtn>

      <Sep />

      {/* Tableau */}
      <ToolBtn
        title="Insérer un tableau"
        active={inTable}
        onClick={insertTable}
      >
        <TableIcon className="size-4" />
      </ToolBtn>
      {inTable ? (
        <>
          <ToolBtn
            title="Ajouter une colonne"
            onClick={() => editor.chain().focus().addColumnAfter().run()}
          >
            <Plus className="size-3.5" />
            <span className="text-[10px] font-semibold">col</span>
          </ToolBtn>
          <ToolBtn
            title="Ajouter une ligne"
            onClick={() => editor.chain().focus().addRowAfter().run()}
          >
            <Plus className="size-3.5" />
            <span className="text-[10px] font-semibold">ligne</span>
          </ToolBtn>
          <ToolBtn
            title="Supprimer le tableau"
            onClick={() => editor.chain().focus().deleteTable().run()}
          >
            <Trash2 className="size-4 text-destructive" />
          </ToolBtn>
        </>
      ) : null}

      <Sep />

      {/* Effacer formatage */}
      <ToolBtn
        title="Effacer le formatage"
        onClick={() => editor.chain().focus().unsetAllMarks().clearNodes().run()}
      >
        <RemoveFormatting className="size-4" />
      </ToolBtn>
    </div>
  )
}

function ToolBtn({
  title,
  active,
  disabled,
  onClick,
  children,
}: {
  title: string
  active?: boolean
  disabled?: boolean
  onClick: () => void
  children: React.ReactNode
}) {
  return (
    <button
      type="button"
      title={title}
      onClick={onClick}
      disabled={disabled}
      aria-pressed={active}
      className={`inline-flex items-center gap-1 rounded-md px-2 py-1.5 text-foreground/80 transition-colors hover:bg-muted ${
        active ? 'bg-primary/10 text-primary' : ''
      } disabled:cursor-not-allowed disabled:opacity-40`}
    >
      {children}
    </button>
  )
}

function Sep() {
  return <span aria-hidden className="mx-1 h-5 w-px bg-border/70" />
}
