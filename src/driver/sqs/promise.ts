
import { SQS } from "aws-sdk"

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
