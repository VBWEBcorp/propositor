import sharp from 'sharp'

interface OptimizeOptions {
  maxWidth?: number
  maxHeight?: number
  quality?: number
}

export async function optimizeImage(
  buffer: Buffer,
  options: OptimizeOptions = {}
): Promise<{ buffer: Buffer; contentType: string; ext: string }> {
  const { maxWidth = 1920, maxHeight = 1080, quality = 80 } = options

  const image = sharp(buffer)
  const metadata = await image.metadata()

  // Resize si nécessaire
  if (
    (metadata.width && metadata.width > maxWidth) ||
    (metadata.height && metadata.height > maxHeight)
  ) {
    image.resize(maxWidth, maxHeight, { fit: 'inside', withoutEnlargement: true })
  }

  // Convertir en WebP
  const optimized = await image.webp({ quality }).toBuffer()

  return {
    buffer: optimized,
    contentType: 'image/webp',
    ext: 'webp',
  }
}
