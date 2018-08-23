
// import { SQS } from "aws-sdk"

export interface SqsQueueConfig extends RawAwsConfigurationOptions {
  readonly adapter: "aws-sdk"
  url: string
  endpoint?: string
  params?: {
      [key: string]: any
  }
}

// from aws ConfigurationOptions
export interface RawAwsConfigurationOptions {
  apiVersion?: string
  computeChecksums?: boolean
  convertResponseTypes?: boolean
  correctClockSkew?: boolean
  customUserAgent?: string
  credentials?: any
  credentialProvider?: any

  /** @deprecated */
  accessKeyId?: string
  /** @deprecated */
  secretAccessKey?: string
  /** @deprecated */
  sessionToken?: string

  httpOptions?: any
  logger?: any
  maxRedirects?: number
  maxRetries?: number
  paramValidation?: any
  region?: string
  retryDelayOptions?: any
  s3BucketEndpoint?: boolean
  s3DisableBodySigning?: boolean
  s3ForcePathStyle?: boolean
  signatureCache?: boolean
  signatureVersion?: string
  sslEnabled?: boolean
  systemClockOffset?: number
  useAccelerateEndpoint?: boolean
  dynamoDbCrc32?: boolean
}
