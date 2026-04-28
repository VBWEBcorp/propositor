'use client'

import { EditorContent, useEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Link from '@tiptap/extension-link'
import Placeholder from '@tiptap/extension-placeholder'
import { Table } from '@tiptap/extension-table'
import { TableRow } from '@tiptap/extension-table-row'
import { TableCell } from '@tiptap/extension-table-cell'
import { TableHeader } from '@tiptap/extension-table-header'
import { marked } from 'marked'
import TurndownService from 'turndown'
// @ts-expect-error - pas de types officiels pour @joplin/turndown-plugin-gfm
import { gfm } from '@joplin/turndown-plugin-gfm'
import { useEffect, useRef } from 'react'

const turndown = new TurndownService({
  headingStyle: 'atx',
  bulletListMarker: '-',
  codeBlockStyle: 'fenced',
  emDelimiter: '*',
})

// Plugin GFM : convertit correctement <table>/<thead>/<tr>/<th>/<td>
// en tableau markdown | col | et inversement. Sans ça turndown supprime
// les tableaux ou les laisse en HTML brut.
turndown.use(gfm)

export function markdownToHtml(md: string): string {
  let html = marked.parse(md, { async: false }) as string
  // Aplatit <thead><tr>...</tr></thead><tbody> en <tbody><tr>...</tr>... pour
  // eviter que Tiptap rende un bandeau marine vide au-dessus de la 1ere ligne
  // (Tiptap a une mauvaise interpretation de thead, et garde une row vide).
  html = html.replace(
    /<thead>([\s\S]*?)<\/thead>\s*<tbody>/g,
    '<tbody>$1'
  )
  return html
}

export function htmlToMarkdown(html: string): string {
  return turndown.turndown(html)
}

import type { Editor } from '@tiptap/react'

type Props = {
  initialMarkdown: string
  onChange: (markdown: string) => void
  onEditorReady?: (editor: Editor) => void
  className?: string
}

export function InlineEditor({ initialMarkdown, onChange, onEditorReady, className }: Props) {
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const lastEmittedRef = useRef<string>(initialMarkdown)

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        heading: { levels: [1, 2, 3, 4] },
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: { rel: 'noopener noreferrer', class: 'text-primary underline-offset-4 hover:underline' },
      }),
      Placeholder.configure({
        placeholder: 'Clique ici pour modifier le contenu…',
      }),
      Table.configure({
        resizable: false,
        HTMLAttributes: { class: 'tiptap-table' },
      }),
      TableRow,
      TableHeader,
      TableCell,
    ],
    content: markdownToHtml(initialMarkdown),
    editorProps: {
      attributes: {
        class:
          'prose-vbweb focus:outline-none min-h-[400px]',
      },
    },
    onUpdate: ({ editor }) => {
      const html = editor.getHTML()
      const md = htmlToMarkdown(html)
      if (md === lastEmittedRef.current) return
      lastEmittedRef.current = md
      if (debounceRef.current) clearTimeout(debounceRef.current)
      debounceRef.current = setTimeout(() => onChange(md), 700)
    },
  })

  // Si initialMarkdown change (ex: nav arrière), resync
  useEffect(() => {
    if (!editor) return
    const currentMd = htmlToMarkdown(editor.getHTML())
    if (currentMd !== initialMarkdown) {
      editor.commands.setContent(markdownToHtml(initialMarkdown), { emitUpdate: false })
      lastEmittedRef.current = initialMarkdown
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialMarkdown])

  // Expose l'instance editor au parent (pour brancher une toolbar)
  useEffect(() => {
    if (editor && onEditorReady) onEditorReady(editor)
  }, [editor, onEditorReady])

  return <EditorContent editor={editor} className={className} />
}
