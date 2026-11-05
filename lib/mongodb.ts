import { MongoClient, Db } from "mongodb";

const uri = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/booknook";
const dbName = process.env.DB_NAME || "booknook";

declare global {
  // eslint-disable-next-line no-var
  var _mongoClientPromise: Promise<MongoClient> | undefined;
  // eslint-disable-next-line no-var
  var _mongoClientInstance: MongoClient | undefined;
}

let client: MongoClient;

if (process.env.NODE_ENV === "development") {
  if (!global._mongoClientInstance) {
    global._mongoClientInstance = new MongoClient(uri);
  }
  client = global._mongoClientInstance;
} else {
  client = new MongoClient(uri);
}

export const mongoClient = client;
export const mongoDb: Db = client.db(dbName);

export default mongoClient;

