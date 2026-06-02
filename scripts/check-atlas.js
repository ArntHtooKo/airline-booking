const { MongoClient } = require("mongodb");

const MONGODB_URI = "mongodb://airline_user:q8xFhWYY02YrjfdH@ac-uk9eroh-shard-00-00.a0rutf4.mongodb.net:27017,ac-uk9eroh-shard-00-01.a0rutf4.mongodb.net:27017,ac-uk9eroh-shard-00-02.a0rutf4.mongodb.net:27017/airlineDB?ssl=true&replicaSet=atlas-rloed9-shard-0&authSource=admin";

async function checkFlights() {
  const client = new MongoClient(MONGODB_URI);
  await client.connect();
  const db = client.db();
  
  const count = await db.collection("schedules").countDocuments();
  console.log(`Total flights in Atlas: ${count}`);
  
  const sample = await db.collection("schedules").findOne({});
  console.log("Sample flight:", JSON.stringify(sample, null, 2));
  
  process.exit(0);
}

checkFlights();
