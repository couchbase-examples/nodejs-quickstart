# Profile Store in Couchbase with Node JS and Express

[![Try it now!](https://da-demo-images.s3.amazonaws.com/runItNow_outline.png?couchbase-example=nodejs-quickstart-repo&source=github)](https://gitpod.io/#https://github.com/couchbase-examples/nodejs-quickstart)

This is a companion repository for: "[Quickstart in Couchbase with Node JS and Express](https://developer.couchbase.com/tutorial-quickstart-nodejs/)" at [developer.couchbase.com](https://developer.couchbase.com), which aims to get you up and running with Couchbase and the [NodeJS SDK](https://docs.couchbase.com/nodejs-sdk/current/hello-world/start-using-sdk.html), connect to a Couchbase cluster, create, read, update, and delete documents, and how to write simple parameterized N1QL queries.

We will be using the latest version of Couchbase (version 7) that enables scopes and collections.

## Prerequisites

To run this prebuilt project, you will need:

- Couchbase 7 installed
- NodeJS & NPM (v12+)
- Code Editor

After cloning the repo, install required dependencies:

## Setup and Run The Application

*After installation of Couchbase 7, and if it is running on localhost (http://127.0.0.1:8091) we can create a bucket named `user_profile` and a collection named `profile`, (required to run the REST API) by running the following command:

```sh
npm install
```

```sh
npm run init-db
```

At this point our application is ready and we can simply run:

```sh
npm start
```

## Running The Tests

The first two commands are only required to be run once before running the integration tests to ensure the database is set up in the right configuration:

```sh
npm run init-test-db && \
npm run init-test-index
```
