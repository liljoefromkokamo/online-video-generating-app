# Replicate API (Get from https://replicate.com/account/api-tokens)
REPLICATE_API_TOKEN=r8_your_api_token_here

# Database (PostgreSQL)
DATABASE_URL="postgresql://user:password@localhost:5432/texttovideo?schema=public"

# Redis (for job queue)
REDIS_URL="redis://localhost:6379"

# AWS S3 (optional - for video storage)
AWS_ACCESS_KEY_ID=your_access_key
AWS_SECRET_ACCESS_KEY=your_secret_key
AWS_BUCKET_NAME=your_bucket_name
AWS_REGION=us-east-1

# Next Auth (optional - for user authentication)
NEXTAUTH_SECRET=your_secret_key
NEXTAUTH_URL=http://localhost:3000