// Pushes postman/nestjs-rest-template.postman_collection.json to the Postman workspace,
// replacing the imported collection with the same name. Requires POSTMAN_API_KEY.
const { readFileSync } = require('fs');
const { resolve } = require('path');

const API = 'https://api.getpostman.com';
const COLLECTION_FILE = resolve(__dirname, '..', 'postman', 'nestjs-rest-template.postman_collection.json');

async function postman(path, options = {}) {
  const response = await fetch(`${API}${path}`, {
    ...options,
    headers: { 'X-Api-Key': process.env.POSTMAN_API_KEY, 'Content-Type': 'application/json', ...options.headers },
  });
  const body = await response.json();

  if (!response.ok) {
    throw new Error(`Postman API ${response.status}: ${JSON.stringify(body.error ?? body)}`);
  }
  return body;
}

async function sync() {
  if (!process.env.POSTMAN_API_KEY) {
    throw new Error('POSTMAN_API_KEY is not set. Create one at https://postman.co/settings/me/api-keys');
  }

  const collection = JSON.parse(readFileSync(COLLECTION_FILE, 'utf8'));
  const { name } = collection.info;

  const { collections } = await postman('/collections');
  const matches = collections.filter((c) => c.name === name);

  if (matches.length === 0) {
    const { collection: created } = await postman('/collections', {
      method: 'POST',
      body: JSON.stringify({ collection }),
    });
    console.log(`Created Postman collection "${name}" (${created.uid})`);
    return;
  }

  if (matches.length > 1) {
    throw new Error(`Found ${matches.length} Postman collections named "${name}"; delete the extras first.`);
  }

  await postman(`/collections/${matches[0].uid}`, {
    method: 'PUT',
    body: JSON.stringify({ collection }),
  });
  console.log(`Updated Postman collection "${name}" (${matches[0].uid})`);
}

sync().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
