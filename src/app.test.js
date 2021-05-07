import express from 'express'
const app = express()

app.get('/profiles/:pid', (req, res) => {
  res.send("YELLO")
})

export default app