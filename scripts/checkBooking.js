const { MongoClient } = require("mongodb");

async function checkBooking() {
  const client = new MongoClient("mongodb://localhost:27017/airlineDB");
  await client.connect();
  const db = client.db();
  
  const schedule = await db.collection("schedules").findOne({
    flightNumber: "SJ101"
  });
  
  console.log("Bookings on SJ101:", JSON.stringify(schedule?.bookings, null, 2));
  process.exit(0);
}

checkBooking();
