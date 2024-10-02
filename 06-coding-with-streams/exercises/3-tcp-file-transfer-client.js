/*
6.3 File share over TCP: Build a client and a server to transfer files over
TCP. Extra points if you add a layer of encryption on top of that and if you
can transfer multiple files at once. Once you have your implementation
ready, give the client code and your IP address to a friend or a colleague,
then ask them to send you some files! Hint: You could use mux/demux to
receive multiple files at once.
*/

import { Socket } from 'net'
import { createReadStream } from 'fs'
import { createCipheriv, randomBytes, createHash } from 'crypto'

const ENCRYPTION_KEY = 'some-secret-key'
const key = createHash('sha256').update(ENCRYPTION_KEY).digest()
var client = new Socket()

client.connect(1337, '127.0.0.1', function () {
  console.log('Connected')
  const iv = randomBytes(16)
  const cipher = createCipheriv('aes-256-cbc', key, iv)
  client.write(iv)

  const file = createReadStream('test2.txt')

  file.pipe(cipher).pipe(client)
  file.on('end', () => {
    console.log('File sent successfully')
    client.end()
  })
})

client.on('close', function () {
  console.log('Connection closed')
})
