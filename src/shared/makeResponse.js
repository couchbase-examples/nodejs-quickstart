const { CouchbaseError } = require('couchbase');

async function makeResponse(res, action) {
  try {
    const result = await action();
    res.json(result);
  } catch (e) {
    console.error(e);
    let status;

    if (e instanceof CouchbaseError && e.message.indexOf('not found') !== -1) {
      status = 404;
    } else {
      status = e instanceof CouchbaseError ? 400 : 500;
    }

    res.status(status);
    res.json({ message: e.message });
  }
}

module.exports = {
  makeResponse,
};
