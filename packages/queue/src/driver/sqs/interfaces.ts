/* eslint-disable @typescript-eslint/no-namespace */
// import { SQS } from "aws-sdk"

export interface SqsQueueConfig extends RawAwsConfigurationOptions {
  readonly adapter: 'aws-sdk'
  url: string
  endpoint?: string
  params?: {
    [key: string]: any,
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

export interface RawAwsSqs {
  getQueueAttributes(params: RawAwsSqs.GetQueueAttributesRequest, callback?: (err: Error, data: RawAwsSqs.GetQueueAttributesResult) => void): void

  purgeQueue(params: RawAwsSqs.PurgeQueueRequest, callback?: (err: Error, data: {}) => void): void

  sendMessage(params: RawAwsSqs.SendMessageRequest, callback?: (err: Error, data: RawAwsSqs.SendMessageResult) => void): void

  receiveMessage(params: RawAwsSqs.ReceiveMessageRequest, callback?: (err: Error, data: RawAwsSqs.ReceiveMessageResult) => void): void

  deleteMessage(params: RawAwsSqs.DeleteMessageRequest, callback?: (err: Error, data: {}) => void): void
}

export declare namespace RawAwsSqs {
  export interface GetQueueAttributesRequest {
    QueueUrl: string
    AttributeNames?: string[]
  }

  export interface GetQueueAttributesResult {
    Attributes?: {[key: string]: string}
  }

  export interface PurgeQueueRequest {
    QueueUrl: string
  }

  export interface SendMessageRequest {
    QueueUrl: string
    MessageBody: string
    DelaySeconds?: number
    MessageDeduplicationId?: string
    MessageGroupId?: string
  }

  export interface SendMessageResult {
    MD5OfMessageBody?: string
    MD5OfMessageAttributes?: string
    MessageId?: string
    SequenceNumber?: string
  }

  export interface ReceiveMessageRequest {
    QueueUrl: string
    AttributeNames?: string[]
    MessageAttributeNames?: string[]
    MaxNumberOfMessages?: number
    VisibilityTimeout?: number
    WaitTimeSeconds?: number
    ReceiveRequestAttemptId?: string
  }

  export interface ReceiveMessageResult {
    Messages?: Message[]
  }

  export interface Message {
    MessageId?: string
    ReceiptHandle?: string
    MD5OfBody?: string
    Body?: string
    MD5OfMessageAttributes?: string
  }

  export interface DeleteMessageRequest {
    QueueUrl: string
    ReceiptHandle: string
  }
}
