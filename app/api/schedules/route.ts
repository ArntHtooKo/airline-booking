import clientPromise from "@/lib/mongodb";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const origin = searchParams.get("orig");
    const destination = searchParams.get("dest");
    const date1 = searchParams.get("date1");
    const date2 = searchParams.get("date2");

    // Validate required parameters
    if (!origin || !destination || !date1 || !date2) {
      return NextResponse.json(
        { error: "Missing required parameters: orig, dest, date1, date2" },
        { status: 400 }
      );
    }

    // Parse dates
    const startDate = new Date(date1);
    const endDate = new Date(date2);
    endDate.setHours(23, 59, 59, 999);

    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
      return NextResponse.json(
        { error: "Invalid date format. Use YYYY-MM-DD" },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db();

    const schedules = await db.collection("schedules")
      .find({
        origin: origin,
        destination: destination,
        departureDateTime: {
          $gte: startDate,
          $lte: endDate
        }
      })
      .sort({ departureDateTime: 1 })
      .toArray();

    // Format the response
    const formattedSchedules = schedules.map((schedule: any) => ({
      id: schedule._id.toString(),
      flightNumber: schedule.flightNumber,
      aircraft: schedule.aircraft,
      origin: schedule.origin,
      destination: schedule.destination,
      departureDateTime: schedule.departureDateTime,
      arrivalDateTime: schedule.arrivalDateTime,
      price: schedule.price,
      capacity: schedule.capacity,
      availableSeats: schedule.capacity - (schedule.bookings?.length || 0)
    }));

    return NextResponse.json({
      success: true,
      count: formattedSchedules.length,
      flights: formattedSchedules
    });
  } catch (error) {
    console.error("Search error:", error);
    return NextResponse.json(
      { success: false, error: String(error) },
      { status: 500 }
    );
  }
}
