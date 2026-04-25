import type { Metadata } from 'next'
import Link from 'next/link'

import { breadcrumbJsonLd, webPageJsonLd } from '@/components/seo/json-ld'
import { Breadcrumb } from '@/components/ui/breadcrumb'
import { siteConfig } from '@/lib/seo'

const description =
  'Politique de cookies : informations sur les cookies utilisés sur le site, leur finalité et comment gérer vos préférences.'

export const metadata: Metadata = {
  title: 'Politique de cookies',
  description,
  alternates: { canonical: '/politique-cookies' },
  robots: { index: false, follow: false },
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    webPageJsonLd('Politique de cookies', description, '/politique-cookies'),
    breadcrumbJsonLd([
      { name: 'Accueil', path: '/' },
      { name: 'Politique de cookies', path: '/politique-cookies' },
    ]),
  ],
}

export default function CookiePolicyPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <Breadcrumb items={[{ label: 'Politique de cookies' }]} />

      <section className="border-b border-border/60">
        <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
          <h1 className="font-display text-3xl tracking-tight text-foreground sm:text-4xl">
            Politique de cookies
          </h1>
          <p className="mt-4 text-sm text-muted-foreground">
            Dernière mise à jour : [JJ/MM/AAAA]
          </p>

          <article className="mt-10 space-y-10 text-sm leading-relaxed text-muted-foreground [&_h2]:font-display [&_h2]:text-lg [&_h2]:font-semibold [&_h2]:text-foreground [&_h3]:text-sm [&_h3]:font-semibold [&_h3]:text-foreground">

            <section className="space-y-3">
              <h2>1. Qu&apos;est-ce qu&apos;un cookie ?</h2>
              <p>
                Un cookie est un petit fichier texte déposé sur votre terminal (ordinateur,
                tablette, smartphone) lors de la consultation d&apos;un site web. Il permet au
                site de mémoriser des informations sur votre visite (préférences de langue,
                d&apos;affichage, etc.) afin de faciliter votre prochaine visite et de rendre le
                site plus utile pour vous.
              </p>
              <p>
                Les cookies ne contiennent pas de programmes malveillants et ne peuvent
                pas accéder aux données de votre terminal.
              </p>
            </section>

            <section className="space-y-3">
              <h2>2. Cadre légal</h2>
              <p>
                L&apos;utilisation des cookies est encadrée par :
              </p>
              <ul className="list-inside list-disc space-y-1 pl-1">
                <li>La directive européenne ePrivacy 2002/58/CE (révisée par 2009/136/CE)</li>
                <li>L&apos;article 82 de la loi Informatique et Libertés n°78-17</li>
                <li>Les lignes directrices de la CNIL du 17 septembre 2020 et sa recommandation du 1er octobre 2020</li>
                <li>Le Règlement Général sur la Protection des Données (RGPD) pour le traitement des données personnelles via les cookies</li>
              </ul>
            </section>

            <section className="space-y-3">
              <h2>3. Cookies utilisés sur ce site</h2>

              <h3 className="pt-2">a) Cookies strictement nécessaires (exemptés de consentement)</h3>
              <p>
                Ces cookies sont indispensables au fonctionnement du site. Conformément à
                l&apos;article 82 de la loi Informatique et Libertés et aux recommandations de la CNIL,
                ils ne nécessitent pas votre consentement.
              </p>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse text-sm">
                  <thead>
                    <tr className="border-b border-border/60">
                      <th className="py-2 pr-4 text-left font-semibold text-foreground">Nom</th>
                      <th className="py-2 pr-4 text-left font-semibold text-foreground">Fournisseur</th>
                      <th className="py-2 pr-4 text-left font-semibold text-foreground">Finalité</th>
                      <th className="py-2 text-left font-semibold text-foreground">Durée</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/40">
                    <tr>
                      <td className="py-2.5 pr-4 font-mono text-xs">theme</td>
                      <td className="py-2.5 pr-4">Ce site</td>
                      <td className="py-2.5 pr-4">Sauvegarde votre préférence de thème (clair ou sombre)</td>
                      <td className="py-2.5">1 an</td>
                    </tr>
                    <tr>
                      <td className="py-2.5 pr-4 font-mono text-xs">cookie-consent</td>
                      <td className="py-2.5 pr-4">Ce site</td>
                      <td className="py-2.5 pr-4">Mémorise votre choix d&apos;acceptation ou de refus des cookies</td>
                      <td className="py-2.5">6 mois</td>
                    </tr>
                    <tr>
                      <td className="py-2.5 pr-4 font-mono text-xs">authToken</td>
                      <td className="py-2.5 pr-4">Ce site</td>
                      <td className="py-2.5 pr-4">Jeton d&apos;authentification pour l&apos;espace d&apos;administration (localStorage)</td>
                      <td className="py-2.5">Session / 7 jours</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <h3 className="pt-2">b) Cookies d&apos;analyse de fréquentation (optionnels)</h3>
              <p>
                Si un outil d&apos;analyse est configuré (Google Analytics, Plausible, Matomo ou autre),
                les cookies d&apos;analyse ne seront déposés <strong>qu&apos;après votre consentement
                explicite</strong> via le bandeau de cookies.
              </p>
              <p>
                Par défaut, <strong>aucun cookie d&apos;analyse n&apos;est actif</strong> sur ce site.
                Cela pourra évoluer, auquel cas cette page sera mise à jour et votre
                consentement sera recueilli.
              </p>

              <h3 className="pt-2">c) Cookies publicitaires et de pistage</h3>
              <p>
                <strong>Ce site n&apos;utilise aucun cookie publicitaire, de profilage, de retargeting
                ou de pistage.</strong> Aucune donnée n&apos;est partagée avec des régies publicitaires
                ou des réseaux sociaux.
              </p>

              <h3 className="pt-2">d) Cookies tiers éventuels</h3>
              <p>
                Certains contenus intégrés (vidéos YouTube, cartes Google Maps, polices Google Fonts)
                peuvent déposer leurs propres cookies. Ces services tiers ont leur propre politique
                de confidentialité :
              </p>
              <ul className="list-inside list-disc space-y-1 pl-1">
                <li>Google Fonts : les polices sont chargées et mises en cache localement lorsque possible</li>
                <li>Si des intégrations vidéo ou cartographiques sont ajoutées, le mode &quot;no-cookie&quot; ou &quot;privacy-enhanced&quot; sera privilégié</li>
              </ul>
            </section>

            <section className="space-y-3">
              <h2>4. Stockage local (localStorage)</h2>
              <p>
                En complément des cookies, ce site utilise le localStorage de votre navigateur
                pour stocker certaines données techniques côté client :
              </p>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse text-sm">
                  <thead>
                    <tr className="border-b border-border/60">
                      <th className="py-2 pr-4 text-left font-semibold text-foreground">Clé</th>
                      <th className="py-2 pr-4 text-left font-semibold text-foreground">Finalité</th>
                      <th className="py-2 text-left font-semibold text-foreground">Données stockées</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/40">
                    <tr>
                      <td className="py-2.5 pr-4 font-mono text-xs">authToken</td>
                      <td className="py-2.5 pr-4">Maintien de la session d&apos;administration</td>
                      <td className="py-2.5">Jeton JWT chiffré (aucun mot de passe)</td>
                    </tr>
                    <tr>
                      <td className="py-2.5 pr-4 font-mono text-xs">authUser</td>
                      <td className="py-2.5 pr-4">Affichage du profil admin</td>
                      <td className="py-2.5">Email, nom, rôle</td>
                    </tr>
                    <tr>
                      <td className="py-2.5 pr-4 font-mono text-xs">theme</td>
                      <td className="py-2.5 pr-4">Préférence de thème</td>
                      <td className="py-2.5">&quot;light&quot; ou &quot;dark&quot;</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <p>
                Le localStorage est accessible uniquement par ce site et n&apos;est jamais transmis
                à des tiers. Vous pouvez le vider à tout moment depuis les paramètres de votre navigateur.
              </p>
            </section>

            <section className="space-y-3">
              <h2>5. Gérer vos préférences</h2>
              <h3 className="pt-2">a) Via le bandeau de consentement</h3>
              <p>
                Lors de votre première visite, un bandeau de consentement vous permet
                d&apos;accepter ou de refuser les cookies optionnels. Vous pouvez modifier
                votre choix à tout moment en cliquant sur le lien &quot;Gérer les cookies&quot;
                en bas de page.
              </p>

              <h3 className="pt-2">b) Via les paramètres de votre navigateur</h3>
              <p>Vous pouvez configurer votre navigateur pour refuser tous les cookies :</p>
              <ul className="list-inside list-disc space-y-1 pl-1">
                <li><strong>Chrome :</strong> Paramètres &gt; Confidentialité et sécurité &gt; Cookies et autres données de site</li>
                <li><strong>Firefox :</strong> Paramètres &gt; Vie privée et sécurité &gt; Cookies et données de sites</li>
                <li><strong>Safari :</strong> Préférences &gt; Confidentialité &gt; Bloquer tous les cookies</li>
                <li><strong>Edge :</strong> Paramètres &gt; Cookies et autorisations de site &gt; Cookies et données de site</li>
              </ul>
              <p>
                <strong>Attention :</strong> le blocage de tous les cookies peut altérer le fonctionnement
                du site, notamment la mémorisation de votre thème et l&apos;accès à l&apos;espace d&apos;administration.
              </p>
            </section>

            <section className="space-y-3">
              <h2>6. Durée de conservation</h2>
              <p>
                Conformément aux recommandations de la CNIL, les cookies ont une durée de vie
                maximale de <strong>13 mois</strong> après leur premier dépôt. Le consentement
                de l&apos;utilisateur est renouvelé tous les <strong>6 mois</strong>.
              </p>
              <p>
                Les données collectées via les cookies sont conservées pour la durée strictement
                nécessaire à la finalité poursuivie, comme indiqué dans notre{' '}
                <Link href="/politique-de-confidentialite" className="font-medium text-primary underline underline-offset-4 hover:text-primary/80">
                  Politique de confidentialité
                </Link>.
              </p>
            </section>

            <section className="space-y-3">
              <h2>7. Vos droits</h2>
              <p>
                Vous disposez des mêmes droits sur les données collectées via les cookies
                que sur toute autre donnée personnelle : accès, rectification, effacement,
                opposition, portabilité et limitation.
              </p>
              <p>
                Pour exercer ces droits, contactez-nous à{' '}
                <a href={`mailto:${siteConfig.email}`} className="font-medium text-primary underline underline-offset-4 hover:text-primary/80">
                  {siteConfig.email}
                </a>.
              </p>
              <p>
                En cas de litige, vous pouvez saisir la{' '}
                <a href="https://www.cnil.fr" target="_blank" rel="noopener noreferrer" className="font-medium text-primary underline underline-offset-4 hover:text-primary/80">
                  CNIL
                </a>.
              </p>
            </section>

            <section className="space-y-3">
              <h2>8. Mise à jour</h2>
              <p>
                Cette politique de cookies peut être modifiée à tout moment pour
                refléter les évolutions du site ou de la réglementation. En cas d&apos;ajout
                de nouveaux cookies optionnels, votre consentement sera de nouveau sollicité.
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
                {' '}et nos{' '}
                <Link
                  href="/conditions-generales"
                  className="font-medium text-primary underline underline-offset-4 hover:text-primary/80"
                >
                  Conditions générales d&apos;utilisation
                </Link>.
              </p>
            </section>
          </article>
        </div>
      </section>
    </>
  )
}
