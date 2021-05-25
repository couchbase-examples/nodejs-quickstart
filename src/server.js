import { app, ensureProfileIndex } from './app.js'

const startApiServer = async() => {
  await ensureProfileIndex()
    .then(() => {
      app.listen(process.env.APP_PORT, '0.0.0.0',
        () => console.info(`Running on port ${process.env.APP_PORT}...`)
      )
    })
}

startApiServer()
