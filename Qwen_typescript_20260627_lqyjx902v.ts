import { S3Client, PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3"
import fs from "fs"
import path from "path"
import https from "https"

const s3 = new S3Client({ region: process.env.AWS_REGION })

export async function downloadAndUploadToS3(url: string, jobId: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const filePath = path.join("/tmp", `${jobId}.mp4`)
    const file = fs.createWriteStream(filePath)

    https.get(url, (response) => {
      response.pipe(file)
      file.on("finish", async () => {
        file.close()
        const fileBuffer = fs.readFileSync(filePath)
        
        await s3.send(new PutObjectCommand({
          Bucket: process.env.AWS_BUCKET_NAME,
          Key: `videos/${jobId}.mp4`,
          Body: fileBuffer,
          ContentType: "video/mp4",
        }))

        fs.unlinkSync(filePath) // Clean up temp file
        resolve(`https://${process.env.AWS_BUCKET_NAME}.s3.amazonaws.com/videos/${jobId}.mp4`)
      })
    }).on("error", reject)
  })
}