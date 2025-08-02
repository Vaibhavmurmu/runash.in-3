import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
  DeleteObjectCommand,
  ListObjectsV2Command,
} from "@aws-sdk/client-s3"
import { getSignedUrl } from "@aws-sdk/s3-request-presigner"

export class CloudStorageService {
  private s3Client: S3Client
  private bucketName: string

  constructor() {
    this.s3Client = new S3Client({
      region: process.env.AWS_REGION || "us-east-1",
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
      },
    })
    this.bucketName = process.env.AWS_S3_BUCKET!
  }

  async uploadRecording(
    streamId: string,
    recordingBuffer: Buffer,
    metadata: {
      duration: number
      quality: string
      format: string
      userId: string
    },
  ): Promise<string> {
    const key = `recordings/${streamId}/${Date.now()}.${metadata.format}`

    const command = new PutObjectCommand({
      Bucket: this.bucketName,
      Key: key,
      Body: recordingBuffer,
      ContentType: `video/${metadata.format}`,
      Metadata: {
        streamId,
        duration: metadata.duration.toString(),
        quality: metadata.quality,
        userId: metadata.userId,
        uploadedAt: new Date().toISOString(),
      },
    })

    await this.s3Client.send(command)
    return key
  }

  async getRecordingUrl(key: string, expiresIn = 3600): Promise<string> {
    const command = new GetObjectCommand({
      Bucket: this.bucketName,
      Key: key,
    })

    return await getSignedUrl(this.s3Client, command, { expiresIn })
  }

  async deleteRecording(key: string): Promise<void> {
    const command = new DeleteObjectCommand({
      Bucket: this.bucketName,
      Key: key,
    })

    await this.s3Client.send(command)
  }

  async listRecordings(streamId?: string): Promise<
    Array<{
      key: string
      size: number
      lastModified: Date
      metadata?: Record<string, string>
    }>
  > {
    const prefix = streamId ? `recordings/${streamId}/` : "recordings/"

    const command = new ListObjectsV2Command({
      Bucket: this.bucketName,
      Prefix: prefix,
    })

    const response = await this.s3Client.send(command)

    return (
      response.Contents?.map((object) => ({
        key: object.Key!,
        size: object.Size || 0,
        lastModified: object.LastModified || new Date(),
      })) || []
    )
  }

  async uploadThumbnail(streamId: string, thumbnailBuffer: Buffer): Promise<string> {
    const key = `thumbnails/${streamId}/${Date.now()}.jpg`

    const command = new PutObjectCommand({
      Bucket: this.bucketName,
      Key: key,
      Body: thumbnailBuffer,
      ContentType: "image/jpeg",
    })

    await this.s3Client.send(command)
    return key
  }

  async getUploadPresignedUrl(key: string, contentType: string, expiresIn = 3600): Promise<string> {
    const command = new PutObjectCommand({
      Bucket: this.bucketName,
      Key: key,
      ContentType: contentType,
    })

    return await getSignedUrl(this.s3Client, command, { expiresIn })
  }
}

export const cloudStorage = new CloudStorageService()
