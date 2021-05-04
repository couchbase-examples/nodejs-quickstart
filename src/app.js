import express from 'express'
import couchbase from 'couchbase'
import bcrypt from 'bcryptjs'
import { v4 } from 'uuid';
import cors from 'cors'

const app = express()

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

const options = { username: 'Administrator', password: 'password' };
const cluster = new couchbase.Cluster('localhost', options);
const bucket = cluster.bucket('user_profile');
const defaultScope = bucket.scope('_default');
const profileCollection = defaultScope.collection('profile');

app.post("/profiles", async(req, res) => {
  if (!req.body.email) {
    return res.status(401).send({ "message": "An `email` is required" })
  } else if (!req.body.pass) {
    return res.status(401).send({ "message": "A `password` is required" })
  }

  const id = v4()
  const profile = { pid: id, ...req.body, pass: bcrypt.hashSync(req.body.pass, 10) }

  await profileCollection.insert(id, profile)
    .then((result) => res.send({...profile, ...result}))
    .catch((e) => res.status(500).send({ 
      "message": `Profile Insert Failed: ${e.message}` 
    }))
})

app.put("/profiles/:pid", async(req, res) => {
  try {
    await profileCollection.get(req.params.pid)
    .then(async(result) => {
      /* Create a New Document with new values, 
        if they are not passed from request, use existing values */
      const newDoc = {
        pid: result.value.pid,
        firstName: req.body.firstName ? req.body.firstName : result.value.firstName,
        lastName: req.body.lastName ? req.body.lastName : result.value.lastName,
        email: req.body.email ? req.body.email : result.value.email,
        pass: req.body.pass ? bcrypt.hashSync(req.body.pass, 10) : result.value.pass,
      }
      /* Persist updates with new doc */
      await profileCollection.upsert(req.params.pid, newDoc)
      .then((result) => res.send({...newDoc, ...result}))
      .catch((e) => res.status(500).send(e))
    })
    .catch((e) => res.status(500).send({ 
      "message": `Profile Not Found, cannot update: ${e.message}` 
    }))
  } catch (e) {
    console.error(e)
  }
})

app.delete("/profiles/:pid", async(req, res) => {
  try {
    await profileCollection.remove(req.params.pid)
      .then(() => {
        return res.status(500).send(e)
      })
      .catch((e) => res.status(500).send(e))
  } catch (e) {
    console.error(e)
  }
})

app.get("/profiles/:pid", async(req, res) => {
  try {
    await profileCollection.get(req.params.pid)
      .then((result) => res.send(result.value))
      .catch((e) => res.status(500).send(e))
  } catch (e) {
    console.error(e)
  }
})

app.get("/profiles/", async (req, res) => {
  try {
    const { skip, limit, searchFirstName } = req.body
    const options = { parameters: { 
      LIMIT: Number(limit || 5), 
      SKIP: Number(skip || 0),
      FNAME: `%${searchFirstName.toLowerCase()}%`
    }}
    const query = `
      SELECT p.*
      FROM user_profile._default.profile p
      WHERE lower(p.firstName) LIKE $FNAME
      LIMIT $LIMIT OFFSET $SKIP;
    `
    await cluster.query(query, options)
      .then((result) => res.send(result.rows))
      .catch((e) => res.status(500).send(e))
  } catch (e) {
    console.error(e)
  }
})
/* We will build our endpoints here */

export default app