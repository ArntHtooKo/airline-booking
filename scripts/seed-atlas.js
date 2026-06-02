const { MongoClient } = require("mongodb");

const MONGODB_URI = "mongodb://airline_user:q8xFhWYY02YrjfdH@ac-uk9eroh-shard-00-00.a0rutf4.mongodb.net:27017,ac-uk9eroh-shard-00-01.a0rutf4.mongodb.net:27017,ac-uk9eroh-shard-00-02.a0rutf4.mongodb.net:27017/?ssl=true&replicaSet=atlas-rloed9-shard-0&authSource=admin";

const flights = [
  { flightNumber: "SJ101", aircraft: "SyberJet SJ30i", origin: "NZNE", destination: "YSSY", departureTime: "10:30", arrivalTime: "12:15", price: 1200, capacity: 6, daysOfWeek: [5] },
  { flightNumber: "SJ102", aircraft: "SyberJet SJ30i", origin: "YSSY", destination: "NZNE", departureTime: "15:30", arrivalTime: "19:15", price: 1200, capacity: 6, daysOfWeek: [0] },
  { flightNumber: "CS201", aircraft: "Cirrus SF50", origin: "NZNE", destination: "NZRO", departureTime: "07:00", arrivalTime: "07:55", price: 250, capacity: 4, daysOfWeek: [1,2,3,4,5] },
  { flightNumber: "CS202", aircraft: "Cirrus SF50", origin: "NZRO", destination: "NZNE", departureTime: "08:30", arrivalTime: "09:25", price: 250, capacity: 4, daysOfWeek: [1,2,3,4,5] },
  { flightNumber: "CS203", aircraft: "Cirrus SF50", origin: "NZNE", destination: "NZRO", departureTime: "16:00", arrivalTime: "16:55", price: 250, capacity: 4, daysOfWeek: [1,2,3,4,5] },
  { flightNumber: "CS204", aircraft: "Cirrus SF50", origin: "NZRO", destination: "NZNE", departureTime: "17:30", arrivalTime: "18:25", price: 250, capacity: 4, daysOfWeek: [1,2,3,4,5] },
  { flightNumber: "GB301", aircraft: "Cirrus SF50", origin: "NZNE", destination: "NZGB", departureTime: "09:00", arrivalTime: "09:35", price: 180, capacity: 4, daysOfWeek: [1,3,5] },
  { flightNumber: "GB302", aircraft: "Cirrus SF50", origin: "NZGB", destination: "NZNE", departureTime: "10:00", arrivalTime: "10:35", price: 180, capacity: 4, daysOfWeek: [2,4,6] },
  { flightNumber: "HJ401", aircraft: "HondaJet Elite", origin: "NZNE", destination: "NZCI", departureTime: "08:00", arrivalTime: "11:15", price: 750, capacity: 5, daysOfWeek: [2,5] },
  { flightNumber: "HJ402", aircraft: "HondaJet Elite", origin: "NZCI", destination: "NZNE", departureTime: "12:00", arrivalTime: "14:15", price: 750, capacity: 5, daysOfWeek: [3,6] },
  { flightNumber: "HJ501", aircraft: "HondaJet Elite", origin: "NZNE", destination: "NZTL", departureTime: "13:00", arrivalTime: "15:15", price: 550, capacity: 5, daysOfWeek: [1] },
  { flightNumber: "HJ502", aircraft: "HondaJet Elite", origin: "NZTL", destination: "NZNE", departureTime: "09:00", arrivalTime: "11:15", price: 550, capacity: 5, daysOfWeek: [2] }
];

const timezoneOffsets = { "NZNE": 12, "YSSY": 10, "NZRO": 12, "NZGB": 12, "NZCI": 12.75, "NZTL": 12 };

function parseLocalTime(timeStr) {
  const [hours, minutes] = timeStr.split(":").map(Number);
  return { hours, minutes };
}

function addDays(date, days) {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

async function seedDatabase() {
  let client;
  try {
    client = new MongoClient(MONGODB_URI);
    await client.connect();
    console.log("Connected to MongoDB Atlas");
    
    const db = client.db("airlineDB");
    
    await db.collection("schedules").deleteMany({});
    console.log("Cleared existing schedules");
    
    const startDate = new Date(2026, 5, 1);
    const endDate = new Date(2026, 5, 22);
    
    const schedules = [];
    
    for (let date = new Date(startDate); date <= endDate; date = addDays(date, 1)) {
      for (const flight of flights) {
        if (flight.daysOfWeek.includes(date.getDay())) {
          const departureLocal = parseLocalTime(flight.departureTime);
          const arrivalLocal = parseLocalTime(flight.arrivalTime);
          
          const departureDateTime = new Date(date);
          departureDateTime.setHours(departureLocal.hours, departureLocal.minutes, 0, 0);
          const departureUTC = new Date(departureDateTime);
          departureUTC.setHours(departureUTC.getHours() - timezoneOffsets[flight.origin]);
          
          const arrivalDateTime = new Date(date);
          arrivalDateTime.setHours(arrivalLocal.hours, arrivalLocal.minutes, 0, 0);
          if (arrivalLocal.hours < departureLocal.hours && (arrivalLocal.hours + 12) < departureLocal.hours) {
            arrivalDateTime.setDate(arrivalDateTime.getDate() + 1);
          }
          const arrivalUTC = new Date(arrivalDateTime);
          arrivalUTC.setHours(arrivalUTC.getHours() - timezoneOffsets[flight.destination]);
          
          schedules.push({
            flightNumber: flight.flightNumber,
            aircraft: flight.aircraft,
            origin: flight.origin,
            destination: flight.destination,
            departureDateTime: departureUTC,
            arrivalDateTime: arrivalUTC,
            price: flight.price,
            capacity: flight.capacity,
            bookings: []
          });
        }
      }
    }
    
    if (schedules.length > 0) {
      const result = await db.collection("schedules").insertMany(schedules);
      console.log(`Inserted ${result.insertedCount} scheduled flights into Atlas`);
    }
    
    console.log("Database seeding complete!");
    process.exit(0);
  } catch (error) {
    console.error("Seeding error:", error);
    process.exit(1);
  }
}

seedDatabase();
