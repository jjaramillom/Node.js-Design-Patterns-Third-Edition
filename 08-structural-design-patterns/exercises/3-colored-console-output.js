/*
8.3 Colored console output: Write a decorator for the console that adds the red(message),
yellow(message), and green(message) methods. These methods will have to behave like con-
sole. log(message) except they will print the message in red, yellow, or green, respectively. In one of
the exercises from the previous chapter, we already pointed you to some useful packages to to create
colored console output. If you want to try something different this time, have a look at ansi-styles
(nodejsdp.link/ansi-styles).
*/

function decorateLogger (log) {
  const colors = {
    red: '\x1b[31m',
    green: '\x1b[32m',
    yellow: '\x1b[33m'
  }
  const logWithColor = (color, message) => {
    const reset = '\x1b[0m'
    console.log(`${color} ${message} ${reset}`)
  }

  log.red = function (message) {
    logWithColor(colors.red, message)
  }
  log.green = function (message) {
    logWithColor(colors.green, message)
  }
  log.yellow = function (message) {
    logWithColor(colors.yellow, message)
  }
  return log
}

const withColors = decorateLogger(console.log)

async function main () {
  withColors.red('hello')
  withColors.green("it's me")
  withColors.yellow('how are you doing?')
}

main()
