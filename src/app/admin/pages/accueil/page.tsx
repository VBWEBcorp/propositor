'use client'

import { PageEditor } from '@/components/admin/page-editor'
import { FieldEditor, SectionEditor, ImageField } from '@/components/admin/field-editor'

const defaults = {
  hero: {
    eyebrow: 'Bienvenue',
    title: 'Votre partenaire pour réussir en ligne',
    description: 'Nous accompagnons les entreprises avec des solutions sur mesure, pensées pour durer. Présence digitale, performance et clarté.',
    button1: 'Prendre contact',
    button2: 'Découvrir nos services',
    images: [
      'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1920&q=80',
      'https://images.unsplash.com/photo-1521737711867-e3b97375f902?auto=format&fit=crop&w=1920&q=80',
      'https://images.unsplash.com/photo-1553877522-43269d4ea984?auto=format&fit=crop&w=1920&q=80',
    ],
  },
  story: {
    eyebrow: 'Notre histoire',
    title: 'Une approche humaine, des résultats concrets',
    paragraph1: 'Depuis nos débuts, nous croyons qu\'un bon site commence par une bonne écoute. Nous prenons le temps de comprendre votre métier, vos clients et vos objectifs avant de concevoir quoi que ce soit.',
    paragraph2: 'Le résultat : des projets qui vous ressemblent, qui parlent à votre audience, et qui travaillent pour vous 24h/24.',
    image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80',
  },
  cta: {
    eyebrow: 'Prêt à démarrer ?',
    title: 'Parlons de votre projet',
    description: 'Un échange simple et sans engagement pour comprendre vos besoins et vous proposer la meilleure approche.',
    button: 'Demander un devis gratuit',
  },
}

export default function AdminHomePage() {
  return (
    <PageEditor pageId="home" title="Page d'accueil" defaultContent={defaults}>
      {(content, update) => (
        <>
          <SectionEditor title="Hero">
            <FieldEditor label="Accroche" value={content.hero?.eyebrow} onChange={(v) => update('hero.eyebrow', v)} />
            <FieldEditor label="Titre principal" value={content.hero?.title} onChange={(v) => update('hero.title', v)} />
            <FieldEditor label="Description" value={content.hero?.description} onChange={(v) => update('hero.description', v)} type="textarea" />
            <FieldEditor label="Bouton 1" value={content.hero?.button1} onChange={(v) => update('hero.button1', v)} />
            <FieldEditor label="Bouton 2" value={content.hero?.button2} onChange={(v) => update('hero.button2', v)} />
            <div className="space-y-3 pt-2">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Images du slider</p>
              {content.hero?.images?.map((img: string, i: number) => (
                <ImageField
                  key={i}
                  label={`Image ${i + 1}`}
                  value={img}
                  onChange={(v) => {
                    const newImages = [...content.hero.images]
                    newImages[i] = v
                    update('hero.images', newImages)
                  }}
                />
              ))}
            </div>
          </SectionEditor>

          <SectionEditor title="Notre histoire">
            <FieldEditor label="Accroche" value={content.story?.eyebrow} onChange={(v) => update('story.eyebrow', v)} />
            <FieldEditor label="Titre" value={content.story?.title} onChange={(v) => update('story.title', v)} />
            <FieldEditor label="Paragraphe 1" value={content.story?.paragraph1} onChange={(v) => update('story.paragraph1', v)} type="textarea" />
            <FieldEditor label="Paragraphe 2" value={content.story?.paragraph2} onChange={(v) => update('story.paragraph2', v)} type="textarea" />
            <ImageField label="Image" value={content.story?.image} onChange={(v) => update('story.image', v)} />
          </SectionEditor>

          <SectionEditor title="Appel à l'action (CTA)">
            <FieldEditor label="Accroche" value={content.cta?.eyebrow} onChange={(v) => update('cta.eyebrow', v)} />
            <FieldEditor label="Titre" value={content.cta?.title} onChange={(v) => update('cta.title', v)} />
            <FieldEditor label="Description" value={content.cta?.description} onChange={(v) => update('cta.description', v)} type="textarea" />
            <FieldEditor label="Bouton" value={content.cta?.button} onChange={(v) => update('cta.button', v)} />
          </SectionEditor>
        </>
      )}
    </PageEditor>
  )
}
