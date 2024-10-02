/*
Data compression efficiency: Write a command-line script that takes
a file as input and compresses it using the different algorithms available in
the zlib module (Brotli, Deflate, Gzip). You want to produce a summary
table that compares the algorithm's compression time and compression
efficiency on the given file. Hint: This could be a good use case for the fork
pattern, but remember that we made some important performance considerations
when we discussed it earlier in this chapter.
*/

import { createReadStream, createWriteStream, statSync, mkdirSync } from 'fs'
import { PassThrough, Transform } from 'stream'
import { createBrotliCompress, createDeflate, createGzip } from 'zlib'
import { basename, join } from 'path'
import { stdout } from 'process'

const SUPPORTED_METHODS = ['brotli', 'deflate', 'gzip']
const OUTPUT_DIRECTORY = 'files'

function compressFiles () {
  const fileName = process.argv[2]
  if (!fileName) {
    console.error('Please provide a file to compress.')
    process.exit(1)
  }

  const fileStats = statSync(fileName)
  if (!fileStats) {
    console.error(`File "${fileName}" does not exist or cannot be accessed.`)
    process.exit(1)
  }

  ensureOutputDirectory()

  const passThrough = new PassThrough()

  SUPPORTED_METHODS.forEach((method) => {
    compressWithMethod(method, passThrough, fileName, fileStats)
  })
  const stream = createReadStream(fileName)
  stream.pipe(passThrough)
}

function compressWithMethod (method, passThroughStream, fileName, fileStats) {
  let startTime
  let endTime
  const compressPipeline = getCompressPipeline(method)
  compressPipeline.once('data', () => (startTime = Date.now()))
  compressPipeline.on('end', () => {
    endTime = Date.now()
    stdout.write(`${method} time: ${endTime - startTime}ms\n`)
  })
  passThroughStream
    .pipe(compressPipeline)
    .pipe(createWriteStream(join('files', `${basename(fileName)}.${method}`)))

  compressPipeline
    .pipe(new Summary(fileStats.size, method))
    .pipe(process.stdout)
}

function ensureOutputDirectory () {
  try {
    mkdirSync(OUTPUT_DIRECTORY, { recursive: true })
  } catch (err) {
    console.error('Could not create output directory:', err.message)
    process.exit(1)
  }
}

function getCompressPipeline (method) {
  switch (method) {
    case 'brotli':
      return createBrotliCompress()
    case 'deflate':
      return createDeflate()
    case 'gzip':
      return createGzip()
  }
}

export class Summary extends Transform {
  constructor (fileSize, method, options = {}) {
    options.objectMode = true
    super(options)
    this.compressedSize = 0
    this.fileSize = fileSize
    this.method = method
  }

  _transform (chunk, _, cb) {
    this.compressedSize += chunk.byteLength
    cb()
  }

  _flush (cb) {
    this.push(
      `${this.method} compression ratio: ${(this.compressedSize / this.fileSize).toFixed(5)}. Size was ${this.fileSize / 1000}KB and now is ${this.compressedSize / 1000}KB\n`
    )
    cb()
  }
}

compressFiles()
