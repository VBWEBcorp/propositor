import mongoose, { Schema, Document } from 'mongoose'

export interface ISiteContent extends Document {
  pageId: string
  content: Record<string, any>
  updatedAt: Date
}

const SiteContentSchema = new Schema<ISiteContent>(
  {
    pageId: {
      type: String,
      required: true,
      unique: true,
    },
    content: {
      type: Schema.Types.Mixed,
      required: true,
      default: {},
    },
  },
  {
    timestamps: true,
  }
)

export default mongoose.models.SiteContent ||
  mongoose.model<ISiteContent>('SiteContent', SiteContentSchema)
