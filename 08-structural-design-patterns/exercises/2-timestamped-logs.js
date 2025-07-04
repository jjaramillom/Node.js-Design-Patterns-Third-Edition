/*
8.2 Timestamped logs: Create a proxy for the console object that enhances every logging function
( error(), error(), debug(), and info()) by prepending the current timestamp to the message you
want to print in the logs. For instance, executing consoleProxy. log('hello') should print something
like 2020-02-18T15:59:30.699Z hello in the console.
*/

const enhancedLog = new Proxy(console.log, {
  apply: async (target, _, [message, ...args]) => {
    target(`${new Date().toISOString()} ${message}`, ...args)
  }
})

async function main () {
  enhancedLog('something')
  await new Promise((resolve) => setTimeout(resolve, 1000))
  enhancedLog('different here')
}

main()
