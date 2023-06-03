# Profile Store in Couchbase with Node JS and Express

[![Try it now!](https://da-demo-images.s3.amazonaws.com/runItNow_outline.png?couchbase-example=nodejs-quickstart-repo&source=github)](https://gitpod.io/#https://github.com/couchbase-examples/nodejs-quickstart)

This is a companion repository for: "[Quickstart in Couchbase with Node JS and Express](https://developer.couchbase.com/tutorial-quickstart-nodejs/)" at [developer.couchbase.com](https://developer.couchbase.com), which aims to get you up and running with Couchbase and the [NodeJS SDK](https://docs.couchbase.com/nodejs-sdk/current/hello-world/start-using-sdk.html). Connect to a Couchbase cluster, create, read, update, and delete documents, and learn how to write simple parameterized SQL++ queries.

We will be using the latest version of Couchbase (version 7) that enables scopes and collections. For the easiest setup experience, we recommend trying Couchbase Capella, our fully-managed DBaaS offering. [Claim your free trial!](https://cloud.couchbase.com/sign-up)

Alternatively, you can [install Couchbase with docker](https://docs.couchbase.com/server/current/getting-started/do-a-quick-install.html) or [directly on your local device](https://docs.couchbase.com/server/current/install/install-intro.html). 

## Prerequisites

To run this prebuilt project, you will need:

- A Couchbase Capella cluster or Couchbase 7 installed locally
- NodeJS & NPM (v12+)
- Code Editor


## Update environment variables appropriately

We've included a `dev.env` file with some basic default values, but you may need to update these according to your configuration.
- `CB_URL` - The Couchbase endpoint to connect to. Use `localhost` for a local/Docker cluster, or the Wide Area Network address for a Capella instance (formatted like `cb.<xxxxxx>.cloud.couchbase.com`)
- `CB_USER` - The username of an authorized user on your cluster. Follow [these instructions](https://docs.couchbase.com/cloud/clusters/manage-database-users.html#create-database-credentials) to create database credentials on Capella
- `CB_PASS` - The password that corresponds to the user specified above
- `CB_BUCKET` - The bucket to connect to. We'll use `user_profile` for this
- `IS_CAPELLA` - `true` if you are using Capella, `false` otherwise

**NOTE on TLS:** The connection logic in this sample app ignores mismatched certificates with the parameter `tls_verify=none`. While this is super helpful in streamlining the connection process for development purposes, it's not very secure and should **not** be used in production. To learn how to secure your connection with proper certificates, see [the Node.js TLS connection tutorial](https://developer.couchbase.com/tutorial-nodejs-tls-connection).

## Setup and Run The Application

After cloning the repo, install required dependencies:

```sh
npm install
```

If you are using Capella, you'll have to manually create a bucket named `user_profile` and a collection named `profile`. See the documentation on [managing buckets](https://docs.couchbase.com/cloud/clusters/data-service/manage-buckets.html) and [creating a collection](https://docs.couchbase.com/cloud/clusters/data-service/scopes-collections.html#create-a-collection) for more information. Note that this collection should be created on the `_default` scope. 


If you have Couchbase running locally, we can the bucket and collection by running the following command:

```sh
npm run init-db
```

This bucket and collection can also be created manually on local clusters by accessing the Couchbase dashboard at http://localhost:8091 and following [these instructions](https://docs.couchbase.com/server/current/tutorials/buckets-scopes-and-collections.html)

At this point our application is ready to run:

```sh
npm start
```

**_NOTE:_** The connection is handled by the `db/connection.js` file. This connection is automatically cached so subsequent calls won't spawn excess connections. The `connnectToDatabase()` function must be called to obtain a reference to the cluster, bucket, collection (default), or profileCollection. You'll notice in this example that the function is called by each route's handler function. This is merely an implementation detail and can be customized to fit your needs and application.


## Running The Tests

The first two commands are only required to be run once before running the integration tests to ensure the database is set up in the right configuration:

```sh
npm run init-test-db && \
npm run init-test-index
```
