import { CouchbaseError } from 'couchbase'
import { connectToDatabase } from '../../db/connection'

/**
 * Runs a request handler's database work and writes the JSON response.
 *
 * The action receives the database handles (`cluster`, `bucket`, `scope`,
 * and the inventory collections) from `connectToDatabase()`. Acquiring the
 * connection here keeps connection failures inside the same JSON error
 * contract as query/KV failures instead of escaping to Express's default
 * HTML error handler.
 */
async function makeResponse(res, action) {
  try {
    const db = await connectToDatabase()
    const result = await action(db)
    res.json(result)
  } catch (e) {
    console.error(e)
    let status

    if (e instanceof CouchbaseError && e.message.indexOf('not found') !== -1) {
      status = 404
    } else {
      status = e instanceof CouchbaseError ? 400 : 500
    }

    res.status(status)
    res.json({ message: e.message })
  }
}

export { makeResponse }
