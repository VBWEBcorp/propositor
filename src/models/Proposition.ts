import mongoose, { Schema, type Model } from 'mongoose'

export type BrandId = 'vbweb' | 'bimi' | 'ouibo'
export type DocType = 'proposition' | 'synthese'

export interface PropositionDoc {
  slug: string
  brand: BrandId
  docType: DocType
  client: string
  title?: string
  baseline?: string
  date?: string
  number?: string
  content: string
  clientLogoUrl?: string
  createdAt: Date
  updatedAt: Date
}

const PropositionSchema = new Schema<PropositionDoc>(
  {
    slug: { type: String, required: true, unique: true, index: true },
    brand: {
      type: String,
      enum: ['vbweb', 'bimi', 'ouibo'],
      default: 'vbweb',
      index: true,
    },
    docType: {
      type: String,
      enum: ['proposition', 'synthese'],
      default: 'proposition',
      index: true,
    },
    client: { type: String, required: true },
    title: String,
    baseline: String,
    date: String,
    number: String,
    content: { type: String, default: '' },
    clientLogoUrl: { type: String, default: '' },
  },
  { timestamps: true, strict: false, minimize: false }
)

export const Proposition: Model<PropositionDoc> =
  (mongoose.models.Proposition as Model<PropositionDoc>) ||
  mongoose.model<PropositionDoc>('Proposition', PropositionSchema)
