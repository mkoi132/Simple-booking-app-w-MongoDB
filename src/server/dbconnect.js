import { MongoClient } from "mongodb";
import './loadEnvironment.mjs'
const connectionString = process.env.MONGO_URI;
const client = new MongoClient(connectionString);
let conn;
try {
  conn = await client.connect();
} catch (e) {
  console.error(e);
}
let db = conn.db("sample_airbnb");
export default db;