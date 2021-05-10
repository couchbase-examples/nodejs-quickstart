import { app, createProfileIndex } from './app.js'

const startServer = async () => {
  await createProfileIndex()
    .then(() => {
      app.listen(3000,
        () => console.info(`Running on port 3000...`)
      )
    })
}

startServer()