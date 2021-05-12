import { app, createProfileIndex } from './app.js'

const startServer = async () => {
  await createProfileIndex()
    .then(() => {
      app.listen(process.env.PORT,
        () => console.info(`Running on port ${process.env.PORT}...`)
      )
    })
}

startServer()