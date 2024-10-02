/* 5.1 Dissecting Promise.all():
Implement your own version of Promise.all()
leveraging promises, async/await, or a combination of the two.
The function must be functionally equivalent to its original counterpart.
 */

function PromiseAll (promises) {
  return new Promise((resolve, reject) => {
    const results = []
    let pending = promises.length
    if (pending === 0) resolve(results)
    promises.forEach((promise, index) => {
      promise
        .then((result) => {
          results[index] = result
          pending--
          if (pending === 0) resolve(results)
        })
        .catch(reject)
    })
  })
}

function delay (ms, data, err) {
  return new Promise((resolve, reject) =>
    setTimeout(() => (err ? reject(new Error('something')) : resolve(data)), ms)
  )
}

async function main () {
  await PromiseAll([
    delay(1000, 'a', true),
    delay(2000, 'b'),
    delay(3000, 'c')
  ]).then(console.log)
}

main()
