/*
6.3 File share over TCP: Build a client and a server to transfer files over
TCP. Extra points if you add a layer of encryption on top of that and if you
can transfer multiple files at once. Once you have your implementation
ready, give the client code and your IP address to a friend or a colleague,
then ask them to send you some files! Hint: You could use mux/demux to
receive multiple files at once.
*/

import { createServer } from 'net'
import { createDecipheriv, createHash } from 'crypto'
import { createWriteStream } from 'fs'

const ENCRYPTION_KEY = 'some-secret-key'
const key = createHash('sha256').update(ENCRYPTION_KEY).digest()
const server = createServer((socket) => {
  socket.write('Echo server\r\n')
  socket.pipe(socket)
})

server.on('connection', (socket) => {
  console.log('Client connected')
  socket.on('end', () => {
    console.log('Client disconnected')
  })
  socket.on('error', (err) => {
    console.log('Error', err)
  })

  socket.once('data', (data) => {
    const iv = data.slice(0, 16)
    try {
      const decipher = createDecipheriv('aes-256-cbc', key, iv)
      socket.pipe(decipher).pipe(createWriteStream('received.txt'))
    } catch (error) {
      console.error('Error', error)
      socket.end('internal error')
    }
  })
})

server.listen(1337)
