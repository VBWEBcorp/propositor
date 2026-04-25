'use client'

import { PageEditor } from '@/components/admin/page-editor'
import { FieldEditor, SectionEditor } from '@/components/admin/field-editor'
import { Button } from '@/components/ui/button'
import { Plus, Trash2 } from 'lucide-react'

const defaults = {
  eyebrow: 'Témoignages',
  title: 'Ils nous font confiance',
  description: 'Des entreprises de tous horizons qui ont gagné en visibilité et en crédibilité.',
  testimonials: [
    { name: 'Marie D.', company: 'Boulangerie Le Fournil', text: 'Depuis le nouveau site, je reçois 3 fois plus d\'appels. Les clients nous trouvent enfin sur Google.', stars: 5 },
    { name: 'Thomas L.', company: 'Cabinet Conseil TLR', text: 'Un travail soigné, un site clair et professionnel. Mes prospects comprennent immédiatement ce que je propose.', stars: 5 },
    { name: 'Camille B.', company: 'Atelier Camille', text: 'Le site reflète parfaitement l\'univers de ma marque. J\'ai gagné en crédibilité auprès de mes clients.', stars: 5 },
    { name: 'Laurent M.', company: 'LM Rénovation', text: 'En trois mois, mon chiffre a augmenté de 40 %. Le site et le SEO font vraiment la différence.', stars: 5 },
    { name: 'Nadia K.', company: 'Agence NovaTour', text: 'Un accompagnement au top, des délais respectés et un résultat qui dépasse mes attentes.', stars: 5 },
  ],
}

export default function AdminTestimonialsPage() {
  return (
    <PageEditor pageId="testimonials" title="Témoignages" defaultContent={defaults}>
      {(content, update) => (
        <>
          <SectionEditor title="En-tête">
            <FieldEditor label="Accroche" value={content.eyebrow} onChange={(v) => update('eyebrow', v)} />
            <FieldEditor label="Titre" value={content.title} onChange={(v) => update('title', v)} />
            <FieldEditor label="Description" value={content.description} onChange={(v) => update('description', v)} type="textarea" />
          </SectionEditor>

          <SectionEditor title="Liste des témoignages">
            {content.testimonials?.map((t: any, i: number) => (
              <div key={i} className="p-4 border border-border/30 rounded-lg space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground font-medium">Témoignage {i + 1}</span>
                  <button
                    onClick={() => {
                      const items = content.testimonials.filter((_: any, j: number) => j !== i)
                      update('testimonials', items)
                    }}
                    className="text-destructive hover:text-destructive/80"
                  >
                    <Trash2 className="size-4" />
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <FieldEditor label="Nom" value={t.name} onChange={(v) => {
                    const items = [...content.testimonials]
                    items[i] = { ...items[i], name: v }
                    update('testimonials', items)
                  }} />
                  <FieldEditor label="Entreprise" value={t.company} onChange={(v) => {
                    const items = [...content.testimonials]
                    items[i] = { ...items[i], company: v }
                    update('testimonials', items)
                  }} />
                </div>
                <FieldEditor label="Témoignage" value={t.text} onChange={(v) => {
                  const items = [...content.testimonials]
                  items[i] = { ...items[i], text: v }
                  update('testimonials', items)
                }} type="textarea" />
                <FieldEditor label="Étoiles (1-5)" value={String(t.stars)} onChange={(v) => {
                  const items = [...content.testimonials]
                  items[i] = { ...items[i], stars: Math.min(5, Math.max(1, parseInt(v) || 5)) }
                  update('testimonials', items)
                }} />
              </div>
            ))}
            <Button
              variant="outline"
              className="w-full gap-2"
              onClick={() => {
                update('testimonials', [...(content.testimonials || []), { name: '', company: '', text: '', stars: 5 }])
              }}
            >
              <Plus className="size-4" />
              Ajouter un témoignage
            </Button>
          </SectionEditor>
        </>
      )}
    </PageEditor>
  )
}
