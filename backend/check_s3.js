const { S3Client, ListObjectsV2Command } = require('@aws-sdk/client-s3');
require('dotenv').config();

const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  }
});

async function main() {
  const command = new ListObjectsV2Command({
    Bucket: process.env.AWS_S3_BUCKET,
  });
  const response = await s3.send(command);
  const videos = response.Contents.filter(c => c.Key.endsWith('.mp4') || c.Key.endsWith('.webm') || c.Key.endsWith('.mov')).map(c => ({
    Key: c.Key,
    LastModified: c.LastModified,
    Size: c.Size
  }));
  console.log(JSON.stringify(videos, null, 2));
}

main().catch(console.error);
