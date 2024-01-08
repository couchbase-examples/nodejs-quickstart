import { app } from './app.js'

const startApiServer = async () => {
  const port = process.env.APP_PORT
  app.listen(port, () => {
    console.log(`API started at http://localhost:${port}`)
  })
}

startApiServer()
