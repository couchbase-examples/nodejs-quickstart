# Profile Store in Couchbase with Node JS and Express

This is a companion repository for: "Profile Store in Couchbase with Node JS and Express" at [developer.couchbase.com](https://developer.couchbase.com), which aims to get you up and running with Couchbase and the NodeJS SDK, connect to a Couchbase cluster, create, read, update, and delete documents, and how to write simple parametrized N1QL queries.

We will be using the latest version of Couchbase (version 7) that enables scopes and collections.

## Prerequisites

To run this prebuilt project, you will need:

- Couchbase 7 installed
- NodeJS & NPM (v12+)
- Code Editor

After cloning the repo, install required dependencies:

## Install Dependencies

```sh
npm install
```

*After installation of Couchbase 7, and if it is running on localhost (http://127.0.0.1:8091) we can create a bucket named `user_profile` and a collection named `profile`, (required to run the REST API) by running the following commands:

## Initialize Bucket and Collection

```sh
npm run init-db
```

## Running The Application

```sh
npm start
```

## Running The Tests

```sh
npm test
```
