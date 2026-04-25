import mongoose, { Schema, Document } from 'mongoose'

export interface IMarketingPopup extends Document {
  enabled: boolean
  title: string
  description: string
  buttonText: string
  buttonLink: string
  imageUrl?: string
  bgColor: string
  textColor: string
  buttonColor: string
  delay: number // in seconds
  banner?: {
    enabled: boolean
    text: string
    link?: string
    bgColor: string
    textColor: string
  }
  updatedAt: Date
}

const MarketingPopupSchema = new Schema<IMarketingPopup>(
  {
    enabled: {
      type: Boolean,
      default: false,
    },
    title: {
      type: String,
      default: 'Offre spéciale',
    },
    description: {
      type: String,
      default: 'Profitez de nos offres exclusives dès maintenant !',
    },
    buttonText: {
      type: String,
      default: 'En savoir plus',
    },
    buttonLink: {
      type: String,
      default: '#',
    },
    imageUrl: String,
    bgColor: {
      type: String,
      default: '#ffffff',
    },
    textColor: {
      type: String,
      default: '#111827',
    },
    buttonColor: {
      type: String,
      default: '#2563eb',
    },
    delay: {
      type: Number,
      default: 5,
    },
    banner: {
      enabled: { type: Boolean, default: false },
      text: { type: String, default: '' },
      link: { type: String, default: '' },
      bgColor: { type: String, default: '#111827' },
      textColor: { type: String, default: '#ffffff' },
    },
  },
  {
    timestamps: true,
  }
)

export const MarketingPopup = mongoose.models.MarketingPopup ||
  mongoose.model<IMarketingPopup>('MarketingPopup', MarketingPopupSchema)
