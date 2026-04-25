import type { Metadata } from 'next'
import Link from 'next/link'

import { breadcrumbJsonLd, webPageJsonLd } from '@/components/seo/json-ld'
import { Breadcrumb } from '@/components/ui/breadcrumb'
import { siteConfig } from '@/lib/seo'

const description =
  "Mentions légales du site : informations sur l'éditeur, l'hébergement, la propriété intellectuelle et les conditions d'utilisation."

export const metadata: Metadata = {
  title: 'Mentions légales',
  description,
  alternates: { canonical: '/mentions-legales' },
  robots: { index: false, follow: false },
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    webPageJsonLd('Mentions légales', description, '/mentions-legales'),
    breadcrumbJsonLd([
      { name: 'Accueil', path: '/' },
      { name: 'Mentions légales', path: '/mentions-legales' },
    ]),
  ],
}

export default function LegalPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <Breadcrumb items={[{ label: 'Mentions légales' }]} />

      <section className="border-b border-border/60">
        <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
          <h1 className="font-display text-3xl tracking-tight text-foreground sm:text-4xl">
            Mentions légales
          </h1>
          <p className="mt-4 text-sm text-muted-foreground">
            Dernière mise à jour : [JJ/MM/AAAA]
          </p>

          <article className="mt-10 space-y-10 text-sm leading-relaxed text-muted-foreground [&_h2]:font-display [&_h2]:text-lg [&_h2]:font-semibold [&_h2]:text-foreground [&_h3]:text-sm [&_h3]:font-semibold [&_h3]:text-foreground">

            <section className="space-y-3">
              <h2>1. Éditeur du site</h2>
              <p>
                Le site accessible à l&apos;adresse <strong>{siteConfig.url}</strong> est édité par :
              </p>
              <ul className="list-inside list-disc space-y-1 pl-1">
                <li><strong>Raison sociale :</strong> {siteConfig.name}</li>
                <li><strong>Forme juridique :</strong> [SARL / SAS / EI / Auto-entrepreneur - à compléter]</li>
                <li><strong>Capital social :</strong> [Montant] € (si applicable)</li>
                <li><strong>SIRET :</strong> [N° SIRET à compléter]</li>
                <li><strong>RCS :</strong> [Ville] B [N° RCS] (si applicable)</li>
                <li><strong>N° TVA intracommunautaire :</strong> [FR XX XXXXXXXXX - à compléter]</li>
                <li>
                  <strong>Siège social :</strong> {siteConfig.address.street},{' '}
                  {siteConfig.address.postalCode} {siteConfig.address.city}
                </li>
                <li><strong>Téléphone :</strong> {siteConfig.phone}</li>
                <li><strong>Email :</strong> {siteConfig.email}</li>
              </ul>
              <p>
                <strong>Directeur de la publication :</strong> [Nom et prénom du responsable - à compléter]
              </p>
            </section>

            <section className="space-y-3">
              <h2>2. Hébergement</h2>
              <p>Le site est hébergé par :</p>
              <ul className="list-inside list-disc space-y-1 pl-1">
                <li><strong>Raison sociale :</strong> [Vercel Inc. / OVHcloud / autre - à compléter]</li>
                <li><strong>Adresse :</strong> [Adresse de l&apos;hébergeur]</li>
                <li><strong>Site web :</strong> [URL de l&apos;hébergeur]</li>
              </ul>
              <h3 className="pt-2">Services techniques complémentaires</h3>
              <ul className="list-inside list-disc space-y-1 pl-1">
                <li><strong>Base de données :</strong> MongoDB Atlas (MongoDB Inc.) - Serveurs en Union européenne</li>
                <li><strong>Stockage de fichiers :</strong> Cloudflare R2 (Cloudflare Inc.) - Stockage objet compatible S3, serveurs en Europe</li>
                <li><strong>CDN et sécurité réseau :</strong> Cloudflare (Cloudflare Inc.) - Réseau de diffusion de contenu mondial</li>
              </ul>
            </section>

            <section className="space-y-3">
              <h2>3. Technologies utilisées</h2>
              <p>
                Conformément à notre engagement de transparence, voici les principales
                technologies utilisées pour le fonctionnement de ce site :
              </p>
              <ul className="list-inside list-disc space-y-1 pl-1">
                <li><strong>Framework :</strong> Next.js 15 (React 19) - framework open source développé par Vercel</li>
                <li><strong>Langage :</strong> TypeScript - surensemble typé de JavaScript</li>
                <li><strong>Interface :</strong> Tailwind CSS, Shadcn/UI, Framer Motion</li>
                <li><strong>Base de données :</strong> MongoDB avec Mongoose (ODM)</li>
                <li><strong>Authentification :</strong> JSON Web Tokens (JWT) avec hachage bcrypt</li>
                <li><strong>Optimisation d&apos;images :</strong> Sharp (conversion WebP, compression côté serveur)</li>
                <li><strong>Stockage de médias :</strong> Cloudflare R2 (compatible S3)</li>
              </ul>
            </section>

            <section className="space-y-3">
              <h2>4. Propriété intellectuelle</h2>
              <p>
                L&apos;ensemble des contenus présents sur le site (textes,
                photographies, illustrations, logos, icônes, éléments
                graphiques, vidéos, bases de données, code source, structure,
                design) est protégé par les lois françaises et internationales
                relatives à la propriété intellectuelle, notamment les articles
                L.111-1 et suivants du Code de la propriété intellectuelle.
              </p>
              <p>
                Toute reproduction, représentation, modification, publication,
                adaptation, totale ou partielle, de ces éléments, quel que soit
                le moyen ou le procédé utilisé, est interdite sauf autorisation
                écrite préalable de {siteConfig.name}.
              </p>
              <p>
                Toute exploitation non autorisée sera considérée comme constitutive
                d&apos;une contrefaçon et poursuivie conformément aux articles L.335-2
                et suivants du Code de la propriété intellectuelle.
              </p>
              <h3 className="pt-2">Licences open source</h3>
              <p>
                Ce site utilise des bibliothèques et frameworks open source sous licences
                MIT, Apache 2.0 et ISC. Les droits d&apos;auteur de ces composants appartiennent
                à leurs auteurs respectifs. L&apos;utilisation de ces technologies n&apos;implique
                aucune cession de droits de propriété intellectuelle.
              </p>
            </section>

            <section className="space-y-3">
              <h2>5. Limitation de responsabilité</h2>
              <p>
                {siteConfig.name} s&apos;efforce de fournir des informations aussi
                précises et actualisées que possible. Toutefois, il ne saurait
                être tenu responsable des omissions, inexactitudes ou carences
                dans la mise à jour, qu&apos;elles soient de son fait ou du fait de
                tiers partenaires.
              </p>
              <p>
                {siteConfig.name} décline toute responsabilité en cas de :
              </p>
              <ul className="list-inside list-disc space-y-1 pl-1">
                <li>Interruption temporaire du site pour maintenance ou mise à jour</li>
                <li>Dommages résultant d&apos;une intrusion frauduleuse d&apos;un tiers</li>
                <li>Impossibilité d&apos;accès au site en raison d&apos;un dysfonctionnement du réseau Internet</li>
                <li>Dommages causés au matériel de l&apos;utilisateur lors de l&apos;accès au site</li>
              </ul>
            </section>

            <section className="space-y-3">
              <h2>6. Liens hypertextes</h2>
              <p>
                Le site peut contenir des liens hypertextes vers des sites tiers.
                {siteConfig.name} ne dispose d&apos;aucun moyen de contrôle sur le contenu
                de ces sites et décline toute responsabilité quant à leur contenu,
                publicités, produits, services ou tout autre matériel.
              </p>
              <p>
                La création de liens hypertextes vers ce site est soumise à
                autorisation préalable et écrite de {siteConfig.name}, sauf pour
                les liens simples pointant vers la page d&apos;accueil.
              </p>
            </section>

            <section className="space-y-3">
              <h2>7. Accessibilité</h2>
              <p>
                Nous nous efforçons de rendre ce site accessible au plus grand nombre
                conformément au Référentiel Général d&apos;Amélioration de l&apos;Accessibilité (RGAA).
                Si vous rencontrez des difficultés d&apos;accès, contactez-nous à{' '}
                <a href={`mailto:${siteConfig.email}`} className="font-medium text-primary underline underline-offset-4 hover:text-primary/80">
                  {siteConfig.email}
                </a>.
              </p>
            </section>

            <section className="space-y-3">
              <h2>8. Droit applicable et juridiction compétente</h2>
              <p>
                Les présentes mentions légales sont régies par le droit français.
                En cas de litige, et après l&apos;échec de toute tentative de
                résolution amiable dans un délai de 30 jours, les tribunaux
                compétents du ressort de [Ville - à compléter] seront seuls
                compétents.
              </p>
              <p>
                Conformément à l&apos;article L.612-1 du Code de la consommation,
                le consommateur a le droit de recourir gratuitement à un médiateur
                de la consommation. Médiateur : [Nom et coordonnées du médiateur - à compléter].
              </p>
              <p>
                Plateforme de règlement en ligne des litiges de la Commission européenne :{' '}
                <a
                  href="https://ec.europa.eu/consumers/odr"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium text-primary underline underline-offset-4 hover:text-primary/80"
                >
                  https://ec.europa.eu/consumers/odr
                </a>
              </p>
            </section>

            <section className="space-y-3">
              <h2>9. Crédits</h2>
              <ul className="list-inside list-disc space-y-1 pl-1">
                <li><strong>Conception et développement :</strong> [À compléter]</li>
                <li><strong>Design :</strong> [À compléter]</li>
                <li><strong>Crédits photos :</strong> [À compléter - ex: Unsplash, photographe, etc.]</li>
                <li><strong>Icônes :</strong> Lucide Icons (licence ISC)</li>
                <li><strong>Polices :</strong> Inter et Plus Jakarta Sans (Google Fonts, licence Open Font)</li>
              </ul>
            </section>

            <section className="space-y-3 rounded-xl border border-border/60 bg-muted/20 p-5">
              <p className="text-foreground">
                Pour connaître nos pratiques en matière de données personnelles, consultez notre{' '}
                <Link
                  href="/politique-de-confidentialite"
                  className="font-medium text-primary underline underline-offset-4 hover:text-primary/80"
                >
                  Politique de confidentialité
                </Link>
                ,{' '}
                <Link
                  href="/conditions-generales"
                  className="font-medium text-primary underline underline-offset-4 hover:text-primary/80"
                >
                  Conditions générales d&apos;utilisation
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
