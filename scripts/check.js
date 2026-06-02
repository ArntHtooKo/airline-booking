import clientPromise from "./lib/mongodb";

async function checkData() {
  const client = await clientPromise;
  const db = client.db();
  const count = await db.collection("schedules").countDocuments();
  console.log(`Found ${count} schedules in database`);
  
  const sample = await db.collection("schedules").findOne({});
  console.log("Sample schedule:", JSON.stringify(sample, null, 2));
  process.exit(0);
}

checkData();
