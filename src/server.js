import { app, ensureIndexes } from './app.js'

const startApiServer = async() => {
  await ensureIndexes()
    .then(() => {
      app.listen(process.env.APP_PORT,
        () => console.info(`Running on port ${process.env.APP_PORT}...`)
      )
    })
}

startApiServer()
