import * as couchbase from 'couchbase'

const DB_USERNAME = process.env.DB_USERNAME
const DB_PASSWORD = process.env.DB_PASSWORD
const DB_CONN_STR = process.env.DB_CONN_STR
const DB_BUCKET_NAME = process.env.DB_BUCKET_NAME
const IS_CAPELLA = process.env.IS_CAPELLA

console.log(process.env)

if (!DB_USERNAME) {
  throw new Error(
    'Please define the DB_USERNAME environment variable inside dev.env'
  )
}

if (!DB_PASSWORD) {
  throw new Error(
    'Please define the DB_PASSWORD environment variable inside dev.env'
  )
}

if (!DB_CONN_STR) {
  throw new Error(
    'Please define the DB_CONN_STR environment variable inside dev.env'
  )
}

if (!DB_BUCKET_NAME) {
  throw new Error(
    'Please define the DB_BUCKET_NAME environment variable inside dev.env'
  )
}

if (!IS_CAPELLA) {
  throw new Error(
    'Please define the IS_CAPELLA environment variable inside dev.env. \nSet to \`true\` if you are connecting to a Capella cluster, and \`false\` otherwise.\n'
  )
}

/**
 * Global is used here to maintain a cached connection across hot reloads
 * in development. This prevents connections growing exponentially
 * during API Route usage.
 */
let cached = global.couchbase

if (!cached) {
  cached = global.couchbase = { conn: null }
}

async function createCouchbaseCluster() {
  if (cached.conn) {
    return cached.conn
  }

  if (IS_CAPELLA === 'true') {
    // Use wan profile to avoid latency issues
    cached.conn = await couchbase.connect(DB_CONN_STR, {
      username: DB_USERNAME,
      password: DB_PASSWORD,
      configProfile: 'wanDevelopment',
    })
  } else {
    // no TLS needed, use traditional connection string
    cached.conn = await couchbase.connect('couchbase://' + DB_CONN_STR, {
      username: DB_USERNAME,
      password: DB_PASSWORD,
    })
  }

  return cached.conn
}

export async function connectToDatabase() {
  const cluster = await createCouchbaseCluster()
  const bucket = cluster.bucket(DB_BUCKET_NAME);
  const scope = bucket.scope('inventory');
  const airlineCollection = bucket.scope('inventory').collection('airline');
  const airportCollection = bucket.scope('inventory').collection('airport');
  const routeCollection = bucket.scope('inventory').collection('route');

  let dbConnection = {
    cluster,
    bucket,
    scope,
    airlineCollection,
    airportCollection,
    routeCollection,
  }

  return dbConnection;
}



