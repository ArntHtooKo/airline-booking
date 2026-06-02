import clientPromise from "@/lib/mongodb";
import { NextRequest, NextResponse } from "next/server";
import { ObjectId } from "mongodb";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { bookingReference, email } = body;

    if (!bookingReference || !email) {
      return NextResponse.json(
        { error: "Booking reference and email are required" },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db();

    // Find the schedule containing this booking
    const schedule = await db.collection("schedules").findOne({
      "bookings.bookingReference": bookingReference
    });

    if (!schedule) {
      return NextResponse.json(
        { error: "Booking not found" },
        { status: 404 }
      );
    }

    // Find the specific booking
    const booking = schedule.bookings.find(
      (b: any) => b.bookingReference === bookingReference
    );

    if (!booking) {
      return NextResponse.json(
        { error: "Booking not found" },
        { status: 404 }
      );
    }

    // Verify email matches
    if (booking.passengerEmail !== email) {
      return NextResponse.json(
        { error: "Email does not match the booking" },
        { status: 403 }
      );
    }

    // Remove the booking from the array
    await db.collection("schedules").updateOne(
      { _id: schedule._id },
      { $pull: { bookings: { bookingReference: bookingReference } } }
    );

    return NextResponse.json({
      success: true,
      message: "Booking cancelled successfully",
      bookingReference: bookingReference,
      flight: {
        flightNumber: schedule.flightNumber,
        origin: schedule.origin,
        destination: schedule.destination,
        departureDateTime: schedule.departureDateTime
      }
    });
  } catch (error) {
    console.error("Cancel error:", error);
    return NextResponse.json(
      { error: String(error) },
      { status: 500 }
    );
  }
}
