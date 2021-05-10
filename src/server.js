import app from './app.js'

const createProfileIndex = async () => {
  try {
    const query = `
      CREATE INDEX profile_lower_firstName 
      ON default:user_profile._default.profile(lower(\`firstName\`));
    `
    await cluster.query(query)
    console.log(`Index Creation: ${result.meta.status}\n`)
  } catch (err) {
    if (err instanceof errors.IndexExistsError) {
      console.info('Index Already Exists');
    } else {
      console.error(error);
    }
  }
}

app.listen(3000, 
  () => console.info(`Running on port 3000...`)
)