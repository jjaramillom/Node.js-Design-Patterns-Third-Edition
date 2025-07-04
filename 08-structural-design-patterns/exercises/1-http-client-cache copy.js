/*
8.1 HTTP client cache: Write a proxy for your favorite HTTP client library
that caches the response of a given HTTP request, so that if you make the
same request again, the response is immediately returned from the local cache,
rather than being fetched from the remote URL. If you need inspiration,
you can check out the superagent-cache module (nodejsdp.link/superagent-cache).
*/
const cache = new Map()
const fetchProxy = new Proxy(fetch, {
  apply: async (target, _, args) => {
    const cacheKey = args[0]
    const cachedValue = cache.get(cacheKey)

    if (cachedValue) {
      console.log('returning cache')
      return cachedValue
    } else {
      console.log('calling API')
      const res = await target(...args)
      if (!res.ok) throw new Error('something went wrong')
      const data = await res.json()
      cache.set(cacheKey, data)
      return data
    }
  }
})

async function callApi () {
  try {
    const data = await fetchProxy('https://pokeapi.co/api/v2/pokemon/ditto')
    console.log('Pokemon name:', data.name)
  } catch (error) {
    console.error('There has been a problem with your fetch operation:', error)
  }
}

async function main () {
  await callApi()
  await callApi()
}

main()
