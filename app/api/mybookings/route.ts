import clientPromise from "@/lib/mongodb";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const email = searchParams.get("email");

    if (!email) {
      return NextResponse.json(
        { error: "Email is required" },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db();

    // Find all schedules that have bookings with this email
    const schedules = await db.collection("schedules")
      .find({
        "bookings.passengerEmail": email
      })
      .toArray();

    // Extract all bookings for this passenger
    const bookings: any[] = [];

    for (const schedule of schedules) {
      const passengerBookings = schedule.bookings.filter(
        (b: any) => b.passengerEmail === email
      );

      for (const booking of passengerBookings) {
        bookings.push({
          bookingReference: booking.bookingReference,
          bookingDate: booking.bookingDate,
          seatNumber: booking.seatNumber,
          passengerName: booking.passengerName,
          flight: {
            flightNumber: schedule.flightNumber,
            aircraft: schedule.aircraft,
            origin: schedule.origin,
            destination: schedule.destination,
            departureDateTime: schedule.departureDateTime,
            arrivalDateTime: schedule.arrivalDateTime,
            price: schedule.price
          }
        });
      }
    }

    // Sort by departure date (upcoming first)
    bookings.sort((a, b) => {
      return new Date(a.flight.departureDateTime).getTime() - new Date(b.flight.departureDateTime).getTime();
    });

    return NextResponse.json({
      success: true,
      count: bookings.length,
      bookings: bookings
    });
  } catch (error) {
    console.error("Error fetching bookings:", error);
    return NextResponse.json(
      { error: String(error) },
      { status: 500 }
    );
  }
}
