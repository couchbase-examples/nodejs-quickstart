import { ensureProfileIndex } from './app.js'
import { delay } from './delay.js'

const initializeIndex = async() => {
  await ensureProfileIndex()
  await delay(process.env.DELAY)
  console.log("## init-test-index script end ##")
}

initializeIndex()
  .then(() => process.exit())
