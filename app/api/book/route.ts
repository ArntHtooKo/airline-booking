import clientPromise from "@/lib/mongodb";
import { NextRequest, NextResponse } from "next/server";
import { ObjectId } from "mongodb";

function generateBookingReference(): string {
  const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const numbers = "0123456789";
  let ref = "";
  for (let i = 0; i < 2; i++) {
    ref += letters[Math.floor(Math.random() * letters.length)];
  }
  for (let i = 0; i < 4; i++) {
    ref += numbers[Math.floor(Math.random() * numbers.length)];
  }
  return ref;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { flightId, passengerName, passengerEmail, passengerTitle, passengerGender } = body;

    if (!flightId || !passengerName || !passengerEmail) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db();

    const flight = await db.collection("schedules").findOne({
      _id: new ObjectId(flightId)
    });

    if (!flight) {
      return NextResponse.json(
        { error: "Flight not found" },
        { status: 404 }
      );
    }

    const currentBookings = flight.bookings || [];
    if (currentBookings.length >= flight.capacity) {
      return NextResponse.json(
        { error: "Flight is full" },
        { status: 400 }
      );
    }

    const bookingReference = generateBookingReference();

    const newBooking = {
      bookingReference: bookingReference,
      passengerName: passengerName,
      passengerEmail: passengerEmail,
      passengerTitle: passengerTitle || "",
      passengerGender: passengerGender || "",
      bookingDate: new Date(),
      seatNumber: currentBookings.length + 1
    };

    // Fix: Use proper update syntax
    await db.collection("schedules").updateOne(
      { _id: new ObjectId(flightId) },
      { $push: { bookings: newBooking } as any }
    );

    return NextResponse.json({
      success: true,
      bookingReference: bookingReference,
      flight: {
        flightNumber: flight.flightNumber,
        origin: flight.origin,
        destination: flight.destination,
        departureDateTime: flight.departureDateTime,
        arrivalDateTime: flight.arrivalDateTime,
        price: flight.price,
        seatNumber: newBooking.seatNumber
      },
      passenger: {
        name: passengerName,
        email: passengerEmail
      }
    });
  } catch (error) {
    console.error("Booking error:", error);
    return NextResponse.json(
      { error: String(error) },
      { status: 500 }
    );
  }
}
