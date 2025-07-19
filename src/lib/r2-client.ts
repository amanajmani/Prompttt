import { S3Client } from '@aws-sdk/client-s3';

/**
 * R2 client configuration interface
 */
interface R2Config {
  accountId: string;
  accessKeyId: string;
  secretAccessKey: string;
}

/**
 * Cached R2 client instance
 */
let r2ClientInstance: S3Client | null = null;

/**
 * Validates that all required R2 environment variables are present
 */
function validateR2Config(): R2Config {
  const accountId = process.env.R2_ACCOUNT_ID;
  const accessKeyId = process.env.R2_ACCESS_KEY_ID;
  const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY;

  if (!accountId || !accessKeyId || !secretAccessKey) {
    throw new Error(
      'Missing required R2 environment variables: R2_ACCOUNT_ID, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY'
    );
  }

  return {
    accountId,
    accessKeyId,
    secretAccessKey,
  };
}

/**
 * Creates and returns an R2 client instance using lazy initialization.
 * This ensures the client is only created when needed at runtime,
 * preventing build-time failures due to missing environment variables.
 */
export function getR2Client(): S3Client {
  // Return cached instance if available
  if (r2ClientInstance) {
    return r2ClientInstance;
  }

  // Validate configuration
  const config = validateR2Config();

  // Create new client instance
  r2ClientInstance = new S3Client({
    region: 'auto',
    endpoint: `https://${config.accountId}.r2.cloudflarestorage.com`,
    credentials: {
      accessKeyId: config.accessKeyId,
      secretAccessKey: config.secretAccessKey,
    },
  });

  return r2ClientInstance;
}

/**
 * Legacy export for backward compatibility
 * @deprecated Use getR2Client() instead for better error handling
 */
export const r2Client = {
  get client() {
    return getR2Client();
  },
};
