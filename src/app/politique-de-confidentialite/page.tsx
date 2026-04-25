import type { Metadata } from 'next'
import Link from 'next/link'

import { breadcrumbJsonLd, webPageJsonLd } from '@/components/seo/json-ld'
import { Breadcrumb } from '@/components/ui/breadcrumb'
import { siteConfig } from '@/lib/seo'

const description =
  'Politique de confidentialité : découvrez comment nous collectons, utilisons et protégeons vos données personnelles conformément au RGPD.'

export const metadata: Metadata = {
  title: 'Politique de confidentialité',
  description,
  alternates: { canonical: '/politique-de-confidentialite' },
  robots: { index: false, follow: false },
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    webPageJsonLd(
      'Politique de confidentialité',
      description,
      '/politique-de-confidentialite'
    ),
    breadcrumbJsonLd([
      { name: 'Accueil', path: '/' },
      {
        name: 'Politique de confidentialité',
        path: '/politique-de-confidentialite',
      },
    ]),
  ],
}

export default function PrivacyPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <Breadcrumb items={[{ label: 'Politique de confidentialité' }]} />

      <section className="border-b border-border/60">
        <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
          <h1 className="font-display text-3xl tracking-tight text-foreground sm:text-4xl">
            Politique de confidentialité
          </h1>
          <p className="mt-4 text-sm text-muted-foreground">
            Dernière mise à jour : [JJ/MM/AAAA]
          </p>

          <article className="mt-10 space-y-10 text-sm leading-relaxed text-muted-foreground [&_h2]:font-display [&_h2]:text-lg [&_h2]:font-semibold [&_h2]:text-foreground [&_h3]:text-sm [&_h3]:font-semibold [&_h3]:text-foreground">

            <section className="space-y-3">
              <p>
                La société {siteConfig.name} (&quot;nous&quot;, &quot;notre&quot;,{' '}
                &quot;nos&quot;) accorde une grande importance à la protection de
                vos données personnelles. La présente politique de
                confidentialité décrit les données que nous collectons, pourquoi
                nous les collectons et comment nous les utilisons, conformément
                au Règlement Général sur la Protection des Données (RGPD,
                Règlement UE 2016/679) et à la loi Informatique et Libertés
                n°78-17 du 6 janvier 1978 modifiée.
              </p>
            </section>

            <section className="space-y-3">
              <h2>1. Responsable du traitement</h2>
              <p>Le responsable du traitement des données est :</p>
              <ul className="list-inside list-disc space-y-1 pl-1">
                <li><strong>Raison sociale :</strong> {siteConfig.name}</li>
                <li>
                  <strong>Adresse :</strong> {siteConfig.address.street}, {siteConfig.address.postalCode}{' '}
                  {siteConfig.address.city}
                </li>
                <li><strong>Email :</strong> {siteConfig.email}</li>
                <li><strong>Téléphone :</strong> {siteConfig.phone}</li>
              </ul>
              <p>
                Délégué à la protection des données (DPO) : [Nom du DPO ou &quot;non désigné&quot;]
              </p>
            </section>

            <section className="space-y-3">
              <h2>2. Données personnelles collectées</h2>
              <p>
                Nous collectons uniquement les données strictement nécessaires
                aux finalités décrites ci-dessous, dans le respect du principe
                de minimisation des données (article 5.1.c du RGPD).
              </p>
              <h3 className="pt-2">a) Données collectées via le formulaire de contact</h3>
              <ul className="list-inside list-disc space-y-1 pl-1">
                <li>Nom et prénom</li>
                <li>Adresse email</li>
                <li>Numéro de téléphone (optionnel)</li>
                <li>Objet et contenu du message</li>
              </ul>
              <h3 className="pt-2">b) Données collectées via l&apos;espace administration</h3>
              <ul className="list-inside list-disc space-y-1 pl-1">
                <li>Adresse email du compte administrateur</li>
                <li>Mot de passe (stocké sous forme de hash chiffré, jamais en clair)</li>
                <li>Nom d&apos;affichage</li>
              </ul>
              <h3 className="pt-2">c) Données collectées automatiquement</h3>
              <ul className="list-inside list-disc space-y-1 pl-1">
                <li>Adresse IP</li>
                <li>Type de navigateur et système d&apos;exploitation</li>
                <li>Pages consultées et durée de visite</li>
                <li>Source de trafic (referrer)</li>
                <li>Préférences de thème (clair/sombre)</li>
              </ul>
            </section>

            <section className="space-y-3">
              <h2>3. Finalités et base légale du traitement</h2>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse text-sm">
                  <thead>
                    <tr className="border-b border-border/60">
                      <th className="py-2 pr-4 text-left font-semibold text-foreground">Finalité</th>
                      <th className="py-2 pr-4 text-left font-semibold text-foreground">Base légale</th>
                      <th className="py-2 text-left font-semibold text-foreground">Conservation</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/40">
                    <tr>
                      <td className="py-2.5 pr-4">Répondre à vos demandes de contact</td>
                      <td className="py-2.5 pr-4">Consentement (art. 6.1.a RGPD)</td>
                      <td className="py-2.5">3 ans après le dernier contact</td>
                    </tr>
                    <tr>
                      <td className="py-2.5 pr-4">Établir un devis ou une proposition commerciale</td>
                      <td className="py-2.5 pr-4">Mesures précontractuelles (art. 6.1.b)</td>
                      <td className="py-2.5">3 ans après le dernier contact</td>
                    </tr>
                    <tr>
                      <td className="py-2.5 pr-4">Gestion de l&apos;espace d&apos;administration</td>
                      <td className="py-2.5 pr-4">Intérêt légitime (art. 6.1.f)</td>
                      <td className="py-2.5">Durée du compte</td>
                    </tr>
                    <tr>
                      <td className="py-2.5 pr-4">Analyser la fréquentation du site</td>
                      <td className="py-2.5 pr-4">Intérêt légitime (art. 6.1.f)</td>
                      <td className="py-2.5">25 mois maximum</td>
                    </tr>
                    <tr>
                      <td className="py-2.5 pr-4">Assurer la sécurité et la disponibilité du site</td>
                      <td className="py-2.5 pr-4">Intérêt légitime (art. 6.1.f)</td>
                      <td className="py-2.5">12 mois</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>

            <section className="space-y-3">
              <h2>4. Technologies et sous-traitants</h2>
              <p>
                Le site utilise les technologies et services suivants pour son fonctionnement.
                Chaque sous-traitant est lié par un contrat conforme à l&apos;article 28 du RGPD.
              </p>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse text-sm">
                  <thead>
                    <tr className="border-b border-border/60">
                      <th className="py-2 pr-4 text-left font-semibold text-foreground">Service</th>
                      <th className="py-2 pr-4 text-left font-semibold text-foreground">Fournisseur</th>
                      <th className="py-2 pr-4 text-left font-semibold text-foreground">Usage</th>
                      <th className="py-2 text-left font-semibold text-foreground">Localisation</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/40">
                    <tr>
                      <td className="py-2.5 pr-4">Framework web</td>
                      <td className="py-2.5 pr-4">Next.js (Vercel Inc.)</td>
                      <td className="py-2.5 pr-4">Rendu des pages, routage, API</td>
                      <td className="py-2.5">USA (clauses contractuelles types)</td>
                    </tr>
                    <tr>
                      <td className="py-2.5 pr-4">Hébergement</td>
                      <td className="py-2.5 pr-4">[Vercel / OVH / autre - à compléter]</td>
                      <td className="py-2.5 pr-4">Hébergement du site et des API</td>
                      <td className="py-2.5">[À compléter]</td>
                    </tr>
                    <tr>
                      <td className="py-2.5 pr-4">Base de données</td>
                      <td className="py-2.5 pr-4">MongoDB Atlas (MongoDB Inc.)</td>
                      <td className="py-2.5 pr-4">Stockage du contenu, comptes admin, messages</td>
                      <td className="py-2.5">Europe (région configurable)</td>
                    </tr>
                    <tr>
                      <td className="py-2.5 pr-4">Stockage d&apos;images</td>
                      <td className="py-2.5 pr-4">Cloudflare R2 (Cloudflare Inc.)</td>
                      <td className="py-2.5 pr-4">Hébergement des images uploadées</td>
                      <td className="py-2.5">Europe (auto, région la plus proche)</td>
                    </tr>
                    <tr>
                      <td className="py-2.5 pr-4">Optimisation d&apos;images</td>
                      <td className="py-2.5 pr-4">Sharp (open source)</td>
                      <td className="py-2.5 pr-4">Compression et conversion WebP côté serveur</td>
                      <td className="py-2.5">Traitement local (serveur)</td>
                    </tr>
                    <tr>
                      <td className="py-2.5 pr-4">Authentification</td>
                      <td className="py-2.5 pr-4">JSON Web Tokens (open source)</td>
                      <td className="py-2.5 pr-4">Gestion des sessions admin sécurisées</td>
                      <td className="py-2.5">Traitement local (serveur)</td>
                    </tr>
                    <tr>
                      <td className="py-2.5 pr-4">Chiffrement</td>
                      <td className="py-2.5 pr-4">bcrypt (open source)</td>
                      <td className="py-2.5 pr-4">Hachage des mots de passe</td>
                      <td className="py-2.5">Traitement local (serveur)</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <p>
                <strong>Note :</strong> Aucune donnée personnelle n&apos;est transmise à
                des régies publicitaires, réseaux sociaux ou services de profilage.
              </p>
            </section>

            <section className="space-y-3">
              <h2>5. Destinataires des données</h2>
              <p>Vos données personnelles ne sont ni vendues, ni louées, ni cédées à des tiers à des fins commerciales.</p>
              <p>Elles peuvent être transmises uniquement :</p>
              <ul className="list-inside list-disc space-y-1 pl-1">
                <li>Aux sous-traitants techniques listés ci-dessus, dans le cadre strict de leurs missions et sous contrat de confidentialité</li>
                <li>Aux autorités compétentes si la loi l&apos;exige (réquisition judiciaire, obligation légale)</li>
              </ul>
            </section>

            <section className="space-y-3">
              <h2>6. Transferts de données hors Union européenne</h2>
              <p>
                Certains de nos sous-traitants techniques (Vercel, MongoDB Atlas, Cloudflare)
                peuvent traiter des données aux États-Unis. Ces transferts sont encadrés par :
              </p>
              <ul className="list-inside list-disc space-y-1 pl-1">
                <li>Le EU-US Data Privacy Framework (décision d&apos;adéquation de la Commission européenne du 10 juillet 2023)</li>
                <li>Des clauses contractuelles types (SCCs) conformes aux modèles adoptés par la Commission européenne</li>
                <li>Des mesures techniques complémentaires (chiffrement en transit et au repos)</li>
              </ul>
              <p>
                Nous privilégions systématiquement les régions de stockage européennes
                lorsque le service le permet (MongoDB Atlas Europe, Cloudflare R2 Europe).
              </p>
            </section>

            <section className="space-y-3">
              <h2>7. Cookies et traceurs</h2>
              <h3 className="pt-2">a) Cookies strictement nécessaires</h3>
              <p>
                Ces cookies sont indispensables au fonctionnement du site. Ils ne
                nécessitent pas votre consentement conformément à l&apos;article 82 de
                la loi Informatique et Libertés.
              </p>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse text-sm">
                  <thead>
                    <tr className="border-b border-border/60">
                      <th className="py-2 pr-4 text-left font-semibold text-foreground">Cookie</th>
                      <th className="py-2 pr-4 text-left font-semibold text-foreground">Finalité</th>
                      <th className="py-2 text-left font-semibold text-foreground">Durée</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/40">
                    <tr>
                      <td className="py-2.5 pr-4 font-mono text-xs">theme</td>
                      <td className="py-2.5 pr-4">Sauvegarde de votre préférence de thème (clair/sombre)</td>
                      <td className="py-2.5">1 an</td>
                    </tr>
                    <tr>
                      <td className="py-2.5 pr-4 font-mono text-xs">cookie-consent</td>
                      <td className="py-2.5 pr-4">Mémorisation de votre choix de consentement aux cookies</td>
                      <td className="py-2.5">6 mois</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <h3 className="pt-2">b) Cookies d&apos;analyse (optionnels)</h3>
              <p>
                Si un outil d&apos;analyse de fréquentation est activé, les cookies correspondants
                ne sont déposés qu&apos;après votre consentement explicite via le bandeau de cookies.
              </p>

              <h3 className="pt-2">c) Cookies publicitaires</h3>
              <p>
                <strong>Aucun cookie publicitaire, de profilage ou de pistage tiers</strong> n&apos;est
                utilisé sur ce site.
              </p>

              <p>
                Vous pouvez à tout moment modifier vos préférences via le bandeau de
                consentement ou dans les paramètres de votre navigateur.
                Pour en savoir plus, consultez notre{' '}
                <Link href="/politique-cookies" className="font-medium text-primary underline underline-offset-4 hover:text-primary/80">
                  Politique de cookies
                </Link>.
              </p>
            </section>

            <section className="space-y-3">
              <h2>8. Sécurité des données</h2>
              <p>
                Nous mettons en oeuvre des mesures techniques et organisationnelles
                conformes à l&apos;état de l&apos;art pour protéger vos données :
              </p>
              <ul className="list-inside list-disc space-y-1 pl-1">
                <li><strong>Chiffrement en transit :</strong> toutes les communications sont protégées par TLS 1.3 (HTTPS)</li>
                <li><strong>Chiffrement au repos :</strong> les données stockées sur MongoDB Atlas et Cloudflare R2 sont chiffrées (AES-256)</li>
                <li><strong>Hachage des mots de passe :</strong> algorithme bcrypt avec salage automatique (aucun mot de passe stocké en clair)</li>
                <li><strong>Authentification sécurisée :</strong> tokens JWT à durée de vie limitée pour l&apos;espace d&apos;administration</li>
                <li><strong>Accès restreints :</strong> seuls les administrateurs autorisés peuvent accéder au back-office</li>
                <li><strong>Sauvegardes :</strong> sauvegardes automatiques quotidiennes de la base de données</li>
                <li><strong>Mises à jour :</strong> dépendances logicielles régulièrement mises à jour pour corriger les vulnérabilités connues</li>
              </ul>
            </section>

            <section className="space-y-3">
              <h2>9. Vos droits</h2>
              <p>Conformément au RGPD (articles 15 à 22) et à la loi Informatique et Libertés, vous disposez des droits suivants :</p>
              <ul className="list-inside list-disc space-y-1 pl-1">
                <li><strong>Droit d&apos;accès (art. 15)</strong> :obtenir la confirmation du traitement de vos données et en recevoir une copie</li>
                <li><strong>Droit de rectification (art. 16)</strong> :corriger des données inexactes ou incomplètes</li>
                <li><strong>Droit à l&apos;effacement (art. 17)</strong> :demander la suppression de vos données (&quot;droit à l&apos;oubli&quot;)</li>
                <li><strong>Droit à la limitation (art. 18)</strong> :restreindre temporairement le traitement de vos données</li>
                <li><strong>Droit à la portabilité (art. 20)</strong> :recevoir vos données dans un format structuré, couramment utilisé et lisible par machine</li>
                <li><strong>Droit d&apos;opposition (art. 21)</strong> :vous opposer au traitement de vos données pour des motifs légitimes</li>
                <li><strong>Droit de retirer votre consentement</strong> : à tout moment, sans affecter la licéité du traitement antérieur</li>
                <li><strong>Droit de définir des directives post-mortem</strong> : définir le sort de vos données après votre décès (art. 85 loi Informatique et Libertés)</li>
              </ul>
              <p>
                Pour exercer vos droits, contactez-nous par email à{' '}
                <a href={`mailto:${siteConfig.email}`} className="font-medium text-primary underline underline-offset-4 hover:text-primary/80">
                  {siteConfig.email}
                </a>{' '}
                ou par courrier à l&apos;adresse indiquée ci-dessus. Nous répondons dans un délai
                maximum de <strong>30 jours</strong> (prolongeable une fois de 60 jours en cas de
                demande complexe, avec notification).
              </p>
              <p>
                En cas de différend, vous pouvez introduire une réclamation auprès de la{' '}
                <a href="https://www.cnil.fr/fr/plaintes" target="_blank" rel="noopener noreferrer" className="font-medium text-primary underline underline-offset-4 hover:text-primary/80">
                  CNIL
                </a>{' '}
                (Commission Nationale de l&apos;Informatique et des Libertés, 3 Place de Fontenoy, TSA 80715, 75334 Paris Cedex 07).
              </p>
            </section>

            <section className="space-y-3">
              <h2>10. Données des mineurs</h2>
              <p>
                Ce site ne s&apos;adresse pas aux mineurs de moins de 16 ans. Nous ne collectons
                pas sciemment de données personnelles de mineurs. Si un représentant légal
                constate qu&apos;un mineur nous a transmis des données sans consentement parental,
                il peut nous contacter pour en demander la suppression immédiate.
              </p>
            </section>

            <section className="space-y-3">
              <h2>11. Modification de la politique</h2>
              <p>
                Nous nous réservons le droit de modifier la présente politique de
                confidentialité à tout moment. Toute modification substantielle sera
                signalée par un bandeau sur le site pendant 30 jours. La version en
                vigueur est celle accessible sur cette page, identifiée par sa date de
                dernière mise à jour.
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
