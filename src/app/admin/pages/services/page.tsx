'use client'

import { PageEditor } from '@/components/admin/page-editor'
import { FieldEditor, SectionEditor, ImageField } from '@/components/admin/field-editor'
import { Button } from '@/components/ui/button'
import { Plus, Trash2 } from 'lucide-react'

const defaults = {
  hero: {
    eyebrow: 'Services',
    title: 'Tout ce qu\'il faut pour réussir en ligne',
    description: 'Des prestations complètes, de la conception à l\'accompagnement continu, adaptées à toutes les tailles d\'entreprise.',
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1920&q=80',
  },
  services: [
    { title: 'Création de site vitrine', description: 'Un site moderne, rapide et responsive qui présente clairement votre activité et inspire confiance à vos visiteurs.' },
    { title: 'Application web', description: 'Outils métier, plateformes de réservation, espaces clients : des applications pensées pour simplifier votre quotidien.' },
    { title: 'Référencement naturel (SEO)', description: 'Optimisation technique, contenu stratégique et suivi de positionnement pour gagner en visibilité sur Google.' },
    { title: 'Identité visuelle', description: 'Logo, charte graphique, supports de communication : une image cohérente qui vous ressemble.' },
    { title: 'Communication digitale', description: 'Stratégie de contenu, réseaux sociaux et campagnes pour développer votre audience en ligne.' },
    { title: 'Développement sur mesure', description: 'Intégrations, automatisations, API : des solutions techniques taillées pour vos besoins spécifiques.' },
    { title: 'Maintenance & sécurité', description: 'Mises à jour, sauvegardes, monitoring et corrections pour un site toujours performant et sécurisé.' },
    { title: 'Analyse & reporting', description: 'Tableaux de bord clairs pour suivre vos performances, comprendre vos visiteurs et ajuster votre stratégie.' },
  ],
}

export default function AdminServicesPage() {
  return (
    <PageEditor pageId="services" title="Page Services" defaultContent={defaults}>
      {(content, update) => (
        <>
          <SectionEditor title="Hero">
            <FieldEditor label="Accroche" value={content.hero?.eyebrow} onChange={(v) => update('hero.eyebrow', v)} />
            <FieldEditor label="Titre" value={content.hero?.title} onChange={(v) => update('hero.title', v)} />
            <FieldEditor label="Description" value={content.hero?.description} onChange={(v) => update('hero.description', v)} type="textarea" />
            <ImageField label="Image" value={content.hero?.image} onChange={(v) => update('hero.image', v)} />
          </SectionEditor>

          <SectionEditor title="Liste des services">
            {content.services?.map((svc: any, i: number) => (
              <div key={i} className="p-4 border border-border/30 rounded-lg space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground font-medium">Service {i + 1}</span>
                  <button
                    onClick={() => {
                      const newServices = content.services.filter((_: any, j: number) => j !== i)
                      update('services', newServices)
                    }}
                    className="text-destructive hover:text-destructive/80"
                  >
                    <Trash2 className="size-4" />
                  </button>
                </div>
                <FieldEditor label="Titre" value={svc.title} onChange={(v) => {
                  const newServices = [...content.services]
                  newServices[i] = { ...newServices[i], title: v }
                  update('services', newServices)
                }} />
                <FieldEditor label="Description" value={svc.description} onChange={(v) => {
                  const newServices = [...content.services]
                  newServices[i] = { ...newServices[i], description: v }
                  update('services', newServices)
                }} type="textarea" />
              </div>
            ))}
            <Button
              variant="outline"
              className="w-full gap-2"
              onClick={() => {
                update('services', [...(content.services || []), { title: '', description: '' }])
              }}
            >
              <Plus className="size-4" />
              Ajouter un service
            </Button>
          </SectionEditor>
        </>
      )}
    </PageEditor>
  )
}
