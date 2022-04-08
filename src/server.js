import { app, ensureIndexes } from './app.js'

const startApiServer = async() => {
  await ensureIndexes()
    .then(() => {
      app.listen(process.env.APP_PORT, () => {
        console.log(`API started at http://localhost:${process.env.APP_PORT}`)
        console.log(`API docs at http://localhost:${process.env.APP_PORT}/api-docs/`)
      })
    })
}

startApiServer()
