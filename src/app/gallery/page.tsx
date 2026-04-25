'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import Image from 'next/image'

interface GalleryImage {
  _id: string
  title: string
  description?: string
  imageUrl: string
  category?: string
}

interface GallerySettings {
  enabled: boolean
  title: string
  description?: string
  eyebrow?: string
  heroImage?: string
}

const ease = [0.22, 1, 0.36, 1] as const

export default function GalleryPage() {
  const [settings, setSettings] = useState<GallerySettings | null>(null)
  const [images, setImages] = useState<GalleryImage[]>([])
  const [loading, setLoading] = useState(true)
  const [lightbox, setLightbox] = useState<GalleryImage | null>(null)

  useEffect(() => {
    const fetchGallery = async () => {
      try {
        const [settingsRes, imagesRes] = await Promise.all([
          fetch('/api/gallery/settings'),
          fetch('/api/gallery/images'),
        ])
        setSettings(await settingsRes.json())
        setImages(await imagesRes.json())
      } catch (error) {
        console.error('Failed to load gallery:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchGallery()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-muted-foreground">Chargement...</div>
      </div>
    )
  }

  if (!settings?.enabled) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">La galerie n&apos;est pas disponible pour le moment.</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative overflow-hidden min-h-[340px] sm:min-h-[400px] lg:min-h-[440px] flex items-center">
        <div className="absolute inset-0">
          {settings.heroImage ? (
            <img
              src={settings.heroImage}
              alt=""
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-primary/20 via-primary/10 to-background" />
          )}
        </div>
        <div className="absolute inset-0 bg-black/50" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />

        <div className="relative mx-auto max-w-6xl px-4 py-20 sm:px-6 lg:px-8 lg:py-28 w-full">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease }}
            className="text-center max-w-3xl mx-auto"
          >
            <p className="font-display text-xs font-semibold tracking-[0.22em] text-white/70 uppercase mb-4">
              {settings.eyebrow || 'Galerie'}
            </p>
            <h1 className="font-display text-4xl tracking-tight text-white sm:text-5xl lg:text-6xl font-bold">
              {settings.title || 'Nos réalisations'}
            </h1>
            <p className="mt-5 text-lg text-white/70 leading-relaxed sm:text-xl max-w-2xl mx-auto">
              {settings.description || 'Découvrez nos projets récents et laissez-vous inspirer par notre savoir-faire.'}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Gallery Grid */}
      <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        {images.length > 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {images.map((image, i) => (
              <motion.div
                key={image._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, ease, delay: i * 0.06 }}
                className="group cursor-pointer"
                onClick={() => setLightbox(image)}
              >
                <div className="rounded-2xl border border-border/50 bg-card overflow-hidden transition-all hover:shadow-lg hover:border-primary/20">
                  <div className="relative aspect-[4/3] overflow-hidden bg-muted">
                    <Image
                      src={image.imageUrl}
                      alt={image.title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                  <div className="p-5 space-y-2">
                    <h3 className="font-display font-semibold text-foreground group-hover:text-primary transition-colors">
                      {image.title}
                    </h3>
                    {image.description && (
                      <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2">
                        {image.description}
                      </p>
                    )}
                    {image.category && (
                      <span className="inline-block text-xs font-medium text-primary bg-primary/10 px-2.5 py-1 rounded-full">
                        {image.category}
                      </span>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <p className="text-muted-foreground text-lg font-medium">Aucune image dans la galerie.</p>
            <p className="text-sm text-muted-foreground/60 mt-2">Revenez bientôt !</p>
          </motion.div>
        )}
      </section>

      {/* Lightbox */}
      {lightbox && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
          onClick={() => setLightbox(null)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.3, ease }}
            className="relative max-w-4xl w-full max-h-[85vh] rounded-2xl overflow-hidden bg-card shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative w-full" style={{ maxHeight: '70vh' }}>
              <img
                src={lightbox.imageUrl}
                alt={lightbox.title}
                className="w-full h-auto max-h-[70vh] object-contain bg-black"
              />
            </div>
            <div className="p-5">
              <h3 className="font-display text-lg font-bold text-foreground">{lightbox.title}</h3>
              {lightbox.description && (
                <p className="text-sm text-muted-foreground mt-1">{lightbox.description}</p>
              )}
            </div>
            <button
              onClick={() => setLightbox(null)}
              className="absolute top-3 right-3 size-8 flex items-center justify-center rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors"
            >
              ✕
            </button>
          </motion.div>
        </motion.div>
      )}
    </div>
  )
}
