import { app, ensureProfileIndex } from './app.js'

const startApiServer = async () => {
  await ensureProfileIndex()
    .then(() => {
      app.listen(process.env.PORT,
        () => console.info(`Running on port ${process.env.PORT}...`)
      )
    })
}

startApiServer()
