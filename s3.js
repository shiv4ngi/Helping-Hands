import dotenv from 'dotenv'
import aws from 'aws-sdk'
import crypto from 'crypto'
import { promisify } from 'util'

dotenv.config()

const region = "ap-south-1"
const bucketName = process.env.AWS_BUCKET_NAME
const accessKeyId = process.env.AWS_ID
const secretAccessKey = process.env.AWS_SECRET_KEY

const s3 = new aws.S3({
  region,
  accessKeyId,
  secretAccessKey,
  signatureVersion: '4'
})

export sync function generateUploadURL() {
  const rawBytes = await randomBytes(16)
  const imageName = rawBytes.toString('hex')

  const params = ({
    Bucket: bucketName,
    Key: imageName,
    Expires: 60
  })

  const uploadURL = await s3.getSignedUrlPromise('putObject', params)
  return uploadURL
}
