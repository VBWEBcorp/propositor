import type { Metadata } from 'next'
import Link from 'next/link'

import { breadcrumbJsonLd, webPageJsonLd } from '@/components/seo/json-ld'
import { Breadcrumb } from '@/components/ui/breadcrumb'
import { siteConfig } from '@/lib/seo'

const description =
  "Conditions générales d'utilisation : règles d'accès et d'utilisation du site."

export const metadata: Metadata = {
  title: "Conditions générales d'utilisation",
  description,
  alternates: { canonical: '/conditions-generales' },
  robots: { index: false, follow: false },
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    webPageJsonLd("Conditions générales d'utilisation", description, '/conditions-generales'),
    breadcrumbJsonLd([
      { name: 'Accueil', path: '/' },
      { name: "Conditions générales d'utilisation", path: '/conditions-generales' },
    ]),
  ],
}

export default function CGUPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <Breadcrumb items={[{ label: "Conditions générales d'utilisation" }]} />

      <section className="border-b border-border/60">
        <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
          <h1 className="font-display text-3xl tracking-tight text-foreground sm:text-4xl">
            Conditions générales d&apos;utilisation
          </h1>
          <p className="mt-4 text-sm text-muted-foreground">
            Dernière mise à jour : [JJ/MM/AAAA]
          </p>

          <article className="mt-10 space-y-10 text-sm leading-relaxed text-muted-foreground [&_h2]:font-display [&_h2]:text-lg [&_h2]:font-semibold [&_h2]:text-foreground [&_h3]:text-sm [&_h3]:font-semibold [&_h3]:text-foreground">

            <section className="space-y-3">
              <h2>1. Objet</h2>
              <p>
                Les présentes Conditions Générales d&apos;Utilisation (ci-après &quot;CGU&quot;)
                définissent les règles d&apos;accès et d&apos;utilisation du site{' '}
                <strong>{siteConfig.url}</strong> édité par {siteConfig.name}.
              </p>
              <p>
                L&apos;accès au site implique l&apos;acceptation pleine et entière des présentes
                CGU. Si vous n&apos;acceptez pas ces conditions, vous êtes invité à ne pas
                utiliser le site.
              </p>
            </section>

            <section className="space-y-3">
              <h2>2. Accès au site</h2>
              <p>
                Le site est accessible gratuitement à tout utilisateur disposant d&apos;un accès
                à Internet. Tous les coûts liés à l&apos;accès (matériel, connexion Internet)
                sont à la charge de l&apos;utilisateur.
              </p>
              <p>
                {siteConfig.name} s&apos;efforce de maintenir le site accessible 24h/24, 7j/7.
                Toutefois, l&apos;accès peut être interrompu sans préavis pour des raisons de
                maintenance, de mise à jour ou pour toute autre raison technique. Aucune
                indemnisation ne pourra être réclamée de ce fait.
              </p>
            </section>

            <section className="space-y-3">
              <h2>3. Espace d&apos;administration</h2>
              <p>
                Certaines fonctionnalités du site sont accessibles via un espace
                d&apos;administration protégé par identifiant et mot de passe. L&apos;utilisateur
                habilité s&apos;engage à :
              </p>
              <ul className="list-inside list-disc space-y-1 pl-1">
                <li>Conserver la confidentialité de ses identifiants</li>
                <li>Ne pas les partager avec des tiers non autorisés</li>
                <li>Informer immédiatement {siteConfig.name} en cas de suspicion d&apos;utilisation frauduleuse</li>
                <li>Utiliser l&apos;espace d&apos;administration uniquement aux fins prévues</li>
              </ul>
              <p>
                {siteConfig.name} se réserve le droit de suspendre ou supprimer tout compte
                en cas de manquement à ces obligations.
              </p>
            </section>

            <section className="space-y-3">
              <h2>4. Contenu du site</h2>
              <h3 className="pt-2">a) Contenu fourni par l&apos;éditeur</h3>
              <p>
                Les informations publiées sur le site sont fournies à titre indicatif.
                Malgré le soin apporté à leur rédaction, elles ne sauraient engager la
                responsabilité de {siteConfig.name} en cas d&apos;inexactitude ou d&apos;omission.
              </p>
              <h3 className="pt-2">b) Contenu uploadé par les administrateurs</h3>
              <p>
                Les images et contenus uploadés via l&apos;espace d&apos;administration sont sous
                la responsabilité de l&apos;utilisateur qui les publie. Il garantit disposer
                de tous les droits nécessaires (droits d&apos;auteur, droit à l&apos;image) et
                s&apos;engage à ne pas publier de contenu :
              </p>
              <ul className="list-inside list-disc space-y-1 pl-1">
                <li>Illicite, diffamatoire, injurieux ou discriminatoire</li>
                <li>Portant atteinte à la vie privée de tiers</li>
                <li>Contrefaisant les droits de propriété intellectuelle de tiers</li>
                <li>Contenant des virus ou programmes malveillants</li>
              </ul>
            </section>

            <section className="space-y-3">
              <h2>5. Formulaire de contact</h2>
              <p>
                Le formulaire de contact permet aux visiteurs d&apos;adresser des demandes
                à {siteConfig.name}. L&apos;utilisateur s&apos;engage à fournir des informations
                exactes et à ne pas utiliser le formulaire à des fins de prospection
                commerciale non sollicitée, de spam ou de diffusion de contenu illicite.
              </p>
              <p>
                Les données transmises via le formulaire sont traitées conformément à
                notre{' '}
                <Link href="/politique-de-confidentialite" className="font-medium text-primary underline underline-offset-4 hover:text-primary/80">
                  Politique de confidentialité
                </Link>.
              </p>
            </section>

            <section className="space-y-3">
              <h2>6. Propriété intellectuelle</h2>
              <p>
                L&apos;ensemble du site (structure, design, code, textes, images, logos) constitue
                une oeuvre protégée par la législation française et internationale sur la
                propriété intellectuelle. Toute reproduction, même partielle, est interdite
                sans autorisation écrite préalable.
              </p>
              <p>
                Voir nos{' '}
                <Link href="/mentions-legales" className="font-medium text-primary underline underline-offset-4 hover:text-primary/80">
                  Mentions légales
                </Link>{' '}
                pour plus de détails.
              </p>
            </section>

            <section className="space-y-3">
              <h2>7. Comportement de l&apos;utilisateur</h2>
              <p>L&apos;utilisateur s&apos;engage à ne pas :</p>
              <ul className="list-inside list-disc space-y-1 pl-1">
                <li>Tenter d&apos;accéder à des zones non autorisées du site ou de ses systèmes</li>
                <li>Perturber le fonctionnement normal du site (attaque DDoS, injection, scraping abusif)</li>
                <li>Collecter des données personnelles d&apos;autres utilisateurs sans leur consentement</li>
                <li>Utiliser le site à des fins contraires à la loi ou aux bonnes moeurs</li>
                <li>Contourner les mesures de sécurité mises en place</li>
              </ul>
              <p>
                Tout manquement pourra donner lieu à un blocage de l&apos;accès et à des poursuites
                judiciaires le cas échéant.
              </p>
            </section>

            <section className="space-y-3">
              <h2>8. Limitation de responsabilité</h2>
              <p>
                {siteConfig.name} ne pourra être tenu responsable de tout dommage direct ou
                indirect résultant de l&apos;utilisation du site, notamment :
              </p>
              <ul className="list-inside list-disc space-y-1 pl-1">
                <li>Perte de données ou de bénéfices</li>
                <li>Interruption d&apos;activité</li>
                <li>Dommages au matériel informatique</li>
                <li>Contamination par des virus malgré les mesures de sécurité en place</li>
              </ul>
              <p>
                L&apos;utilisateur est seul responsable de l&apos;utilisation qu&apos;il fait des
                informations et contenus disponibles sur le site.
              </p>
            </section>

            <section className="space-y-3">
              <h2>9. Liens externes</h2>
              <p>
                Le site peut contenir des liens vers des sites tiers. {siteConfig.name} n&apos;exerce
                aucun contrôle sur ces sites et décline toute responsabilité quant à leur contenu,
                leurs pratiques en matière de données personnelles ou leur disponibilité.
              </p>
            </section>

            <section className="space-y-3">
              <h2>10. Modification des CGU</h2>
              <p>
                {siteConfig.name} se réserve le droit de modifier les présentes CGU à tout moment.
                Les modifications prennent effet dès leur publication sur cette page. L&apos;utilisation
                continue du site après modification vaut acceptation des nouvelles conditions.
              </p>
            </section>

            <section className="space-y-3">
              <h2>11. Droit applicable et litiges</h2>
              <p>
                Les présentes CGU sont régies par le droit français. En cas de litige relatif
                à l&apos;interprétation ou l&apos;exécution des présentes, les parties s&apos;engagent à
                rechercher une solution amiable. À défaut, le litige sera porté devant les
                tribunaux compétents du ressort de [Ville - à compléter].
              </p>
            </section>

            <section className="space-y-3 rounded-xl border border-border/60 bg-muted/20 p-5">
              <p className="text-foreground">
                Consultez également nos{' '}
                <Link
                  href="/mentions-legales"
                  className="font-medium text-primary underline underline-offset-4 hover:text-primary/80"
                >
                  Mentions légales
                </Link>
                ,{' '}
                <Link
                  href="/politique-de-confidentialite"
                  className="font-medium text-primary underline underline-offset-4 hover:text-primary/80"
                >
                  Politique de confidentialité
                </Link>
                {' '}et notre{' '}
                <Link
                  href="/politique-cookies"
                  className="font-medium text-primary underline underline-offset-4 hover:text-primary/80"
                >
                  Politique de cookies
                </Link>.
              </p>
            </section>
          </article>
        </div>
      </section>
    </>
  )
}
