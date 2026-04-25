import { S3Client, PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3'

const ACCOUNT_ID = process.env.R2_ACCOUNT_ID!
const ACCESS_KEY_ID = process.env.R2_ACCESS_KEY_ID!
const SECRET_ACCESS_KEY = process.env.R2_SECRET_ACCESS_KEY!
const BUCKET_NAME = process.env.R2_BUCKET_NAME!
const PUBLIC_URL = process.env.R2_PUBLIC_URL!

export const r2Enabled = !!(ACCOUNT_ID && ACCESS_KEY_ID && SECRET_ACCESS_KEY && BUCKET_NAME)

const r2Client = r2Enabled
  ? new S3Client({
      region: 'auto',
      endpoint: `https://${ACCOUNT_ID}.r2.cloudflarestorage.com`,
      credentials: {
        accessKeyId: ACCESS_KEY_ID,
        secretAccessKey: SECRET_ACCESS_KEY,
      },
    })
  : null

export async function uploadToR2(
  buffer: Buffer,
  filename: string,
  contentType: string
): Promise<string> {
  if (!r2Client) {
    throw new Error('R2 is not configured')
  }

  await r2Client.send(
    new PutObjectCommand({
      Bucket: BUCKET_NAME,
      Key: filename,
      Body: buffer,
      ContentType: contentType,
    })
  )

  return `${PUBLIC_URL}/${filename}`
}

export async function deleteFromR2(filename: string): Promise<void> {
  if (!r2Client) return

  await r2Client.send(
    new DeleteObjectCommand({
      Bucket: BUCKET_NAME,
      Key: filename,
    })
  )
}
