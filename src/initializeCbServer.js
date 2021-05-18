
import qs from 'qs'
import axios from 'axios'

var username = process.env.CB_USER
var password = process.env.CB_PASS
var auth = `Basic ${Buffer.from(username + ':' + password).toString('base64')}`

const delay = (t, val) => {
  return new Promise(function(resolve) {
    setTimeout(function() {
      resolve(val)
    }, t)
  })
}

const restCreateBucket = async() => {
  const data = { name: process.env.CB_BUCKET, ramQuotaMB: 150 }
  await axios({
    method: 'POST',
    headers: { 'content-type': 'application/x-www-form-urlencoded', 'Authorization': auth },
    data: qs.stringify(data),
    url: 'http://127.0.0.1:8091/pools/default/buckets',
  })
  .catch(error => console.log(`Bucket may already exist: ${error.message}`))
}

const restCreateCollection = async() => {
  const data = { name: 'profile' }
  await axios({
    method: 'POST',
    headers: { 'content-type': 'application/x-www-form-urlencoded', 'Authorization': auth },
    data: qs.stringify(data),
    url: `http://127.0.0.1:8091/pools/default/buckets/${process.env.CB_BUCKET}/collections/_default`,
  })
  .catch(error => console.log(`Collection may already exist: ${error.message}`))
}

const initializeBucketAndCollection = async() => {
  await restCreateBucket()
  await delay(3000)
  await restCreateCollection()
  await delay(3000)
}

initializeBucketAndCollection()

// module.exports = {
//   restCreateBucket, 
//   restCreateCollection,
//   delay
// }