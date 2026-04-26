'use client'

import { EditorContent, useEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Link from '@tiptap/extension-link'
import Placeholder from '@tiptap/extension-placeholder'
import { marked } from 'marked'
import TurndownService from 'turndown'
import { useEffect, useRef } from 'react'

const turndown = new TurndownService({
  headingStyle: 'atx',
  bulletListMarker: '-',
  codeBlockStyle: 'fenced',
  emDelimiter: '*',
})

// turndown perd parfois les tableaux — on les garde tels quels en HTML
turndown.keep(['table', 'thead', 'tbody', 'tr', 'th', 'td'] as Array<keyof HTMLElementTagNameMap>)

export function markdownToHtml(md: string): string {
  return marked.parse(md, { async: false }) as string
}

export function htmlToMarkdown(html: string): string {
  return turndown.turndown(html)
}

type Props = {
  initialMarkdown: string
  onChange: (markdown: string) => void
  className?: string
}

export function InlineEditor({ initialMarkdown, onChange, className }: Props) {
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

  return <EditorContent editor={editor} className={className} />
}
