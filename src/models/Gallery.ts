import mongoose, { Schema, Document } from 'mongoose'

export interface IGalleryImage extends Document {
  title: string
  description?: string
  imageUrl: string
  category?: string
  order: number
  active: boolean
  createdAt: Date
  updatedAt: Date
}

export interface IGallerySettings extends Document {
  enabled: boolean
  title: string
  description?: string
  eyebrow?: string
  heroImage?: string
  updatedAt: Date
}

const GalleryImageSchema = new Schema<IGalleryImage>(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
    },
    description: String,
    imageUrl: {
      type: String,
      required: [true, 'Image URL is required'],
    },
    category: {
      type: String,
      default: 'general',
    },
    order: {
      type: Number,
      default: 0,
    },
    active: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
)

const GallerySettingsSchema = new Schema<IGallerySettings>(
  {
    enabled: {
      type: Boolean,
      default: false,
    },
    title: {
      type: String,
      default: 'Nos réalisations',
    },
    description: { type: String, default: 'Découvrez nos projets récents et laissez-vous inspirer par notre savoir-faire.' },
    eyebrow: { type: String, default: 'Galerie' },
    heroImage: String,
  },
  {
    timestamps: true,
  }
)

export const GalleryImage = mongoose.models.GalleryImage ||
  mongoose.model<IGalleryImage>('GalleryImage', GalleryImageSchema)

export const GallerySettings = mongoose.models.GallerySettings ||
  mongoose.model<IGallerySettings>('GallerySettings', GallerySettingsSchema)
