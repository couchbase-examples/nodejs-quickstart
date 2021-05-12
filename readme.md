# Profile Store in Couchbase with Node JS and Express

This is a companion repository for: "Profile Store in Couchbase with Node JS and Express" at link:https://developer.couchbase.com[developer.couchbase.com], which aims to get you up and running with Couchbase and the NodeJS SDK, connect to a Couchbase cluster, create, read, update, and delete documents, and how to write simple parametrized N1QL queries.

We will be using the latest version of Couchbase (version 7) that enables scopes and collections.

## Prerequisites

To run this prebuilt project, you will need:

- Couchbase 7 installed
- Couchbase Bucket: `user_profile` *
- Couchbase Collection: `profile` *
- NodeJS & NPM (v12+)
- Code Editor
- cURL

*After installation of Couchbase 7, and if it is running on localhost (http://127.0.0.1:8091) we can create a bucket named `user_profile` and a collection named `profile` using two curl commands that uses the Couchbase REST API:

*Create Bucket First:*

```sh
curl -v -X POST http://127.0.0.1:8091/pools/default/buckets \
-u Administrator:password \
-d name=user_profile \
-d ramQuotaMB=256
```

*Then Create Collection:*

```sh
curl http://127.0.0.1:8091/pools/default/buckets/user_profile/collections/_default \
-u Administrator:password -X POST \
-d name=profile
```

If you would like to enable testing, you can run the same cURL commands replacing `user_profile` with `test_profile`.

Once the database and the bucket(s) are set up you can run the development environment or the test environment.

## Install Dependencies

```sh
npm install
```

## Running The Application

```sh
npm start
```

## Running The Tests

```sh
npm test
```
