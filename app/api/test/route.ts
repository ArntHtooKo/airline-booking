import clientPromise from "@/lib/mongodb";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db();
    
    // Test the connection by listing collections
    const collections = await db.listCollections().toArray();
    
    return NextResponse.json({ 
      success: true, 
      message: "Connected to MongoDB!",
      collections: collections.map(c => c.name)
    });
  } catch (error) {
    console.error("Connection error:", error);
    return NextResponse.json({ 
      success: false, 
      error: String(error) 
    }, { status: 500 });
  }
}
