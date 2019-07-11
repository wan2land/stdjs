
// import { SQS } from "aws-sdk"
import { RawAwsSqs as SQS } from './interfaces'

export function getQueueAttributes(client: SQS, request: SQS.GetQueueAttributesRequest): Promise<SQS.GetQueueAttributesResult> {
  return new Promise((resolve, reject) => {
    client.getQueueAttributes(request, (err, params) => {
      if (err) {
        reject(err)
        return
      }
      resolve(params)
    })
  })
}

export function purgeQueue(client: SQS, request: SQS.PurgeQueueRequest): Promise<void> {
  return new Promise((resolve, reject) => {
    client.purgeQueue(request, (err) => {
      if (err) {
        reject(err)
        return
      }
      resolve()
    })
  })
}

export function sendMessage(client: SQS, request: SQS.SendMessageRequest): Promise<SQS.SendMessageResult> {
  return new Promise((resolve, reject) => {
    client.sendMessage(request, (err, result) => {
      if (err) {
        reject(err)
        return
      }
      resolve(result)
    })
  })
}

export function receiveMessages(client: SQS, request: SQS.ReceiveMessageRequest): Promise<SQS.Message[]> {
  return new Promise((resolve, reject) => {
    client.receiveMessage(request, (err, data) => {
      if (err) {
        reject(err)
        return
      }
      resolve(data.Messages || [])
    })
  })
}
