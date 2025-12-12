import { Router } from 'express'
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'

const router = Router()

const s3 = new S3Client({ region: process.env.S3_REGION || 'us-east-1', credentials: { accessKeyId: process.env.AWS_ACCESS_KEY_ID || '', secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '' } })

router.post('/presign', async (req, res) => {
  try {
    const { contentType, folder = 'uploads' } = req.body || {}
    const key = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2)}`
    const cmd = new PutObjectCommand({ Bucket: process.env.S3_BUCKET_NAME as string, Key: key, ContentType: contentType, ACL: 'private' })
    const url = await getSignedUrl(s3, cmd, { expiresIn: 900 })
    res.json({ uploadUrl: url, fileKey: key, publicUrl: `https://${process.env.S3_BUCKET_NAME}.s3.amazonaws.com/${key}` })
  } catch (e: any) {
    res.status(500).json({ error: e.message })
  }
})

export default router

