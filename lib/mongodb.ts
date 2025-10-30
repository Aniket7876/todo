import { Db, MongoClient, Collection, Document } from 'mongodb';

declare global {
  // eslint-disable-next-line no-var
  var _mongoClientPromise: Promise<MongoClient> | undefined;
}

const options = {};

let clientPromise: Promise<MongoClient> | undefined;

function createClientPromise(): Promise<MongoClient> {
  const uri = process.env.MONGODB_URI;

  if (!uri) {
    throw new Error('Missing MONGODB_URI environment variable');
  }

  const client = new MongoClient(uri, options);
  return client.connect();
}

export async function getClient(): Promise<MongoClient> {
  if (process.env.NODE_ENV === 'production') {
    if (!global._mongoClientPromise) {
      global._mongoClientPromise = createClientPromise();
    }

    const promise = global._mongoClientPromise;

    if (!promise) {
      throw new Error('Failed to initialize MongoDB client');
    }

    return promise;
  }

  if (!clientPromise) {
    clientPromise = createClientPromise();
  }

  return clientPromise;
}

export async function getDb(): Promise<Db> {
  const client = await getClient();
  return client.db();
}

export async function getCollection<TSchema extends Document = Document>(name: string): Promise<Collection<TSchema>> {
  const db = await getDb();
  return db.collection<TSchema>(name);
}
