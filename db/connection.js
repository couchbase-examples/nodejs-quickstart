import * as couchbase from 'couchbase'

const options = { username: process.env.CB_USER, password: process.env.CB_PASS }
const cluster = new couchbase.Cluster(process.env.CB_URL, options)
const bucket = cluster.bucket(process.env.CB_BUCKET)
const defaultScope = bucket.scope('_default')
const profileCollection = defaultScope.collection('profile')

module.exports = { couchbase, cluster, profileCollection }