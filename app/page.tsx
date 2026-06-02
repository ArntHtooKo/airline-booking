"use client";

import { useState, useEffect } from "react";
import BookingModal from "@/components/BookingModal";
import BookingConfirmation from "@/components/BookingConfirmation";
import { AirplaneIcon, LocationIcon, CalendarIcon, EmailIcon, TicketIcon, ArrowRightIcon } from "@/components/Icons";

interface Flight {
  id: string;
  flightNumber: string;
  aircraft: string;
  origin: string;
  destination: string;
  departureDateTime: string;
  arrivalDateTime: string;
  price: number;
  capacity: number;
  availableSeats: number;
}

interface MyBooking {
  bookingReference: string;
  bookingDate: string;
  seatNumber: number;
  passengerName: string;
  flight: {
    flightNumber: string;
    aircraft: string;
    origin: string;
    destination: string;
    departureDateTime: string;
    arrivalDateTime: string;
    price: number;
  };
}

const airports = [
  { code: "NZNE", city: "Auckland", country: "New Zealand" },
  { code: "YSSY", city: "Sydney", country: "Australia" },
  { code: "NZRO", city: "Rotorua", country: "New Zealand" },
  { code: "NZGB", city: "Great Barrier Island", country: "New Zealand" },
  { code: "NZCI", city: "Chatham Islands", country: "New Zealand" },
  { code: "NZTL", city: "Tekapo", country: "New Zealand" },
];

export default function Home() {
  const [origin, setOrigin] = useState("");
  const [destination, setDestination] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [flights, setFlights] = useState<Flight[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedFlight, setSelectedFlight] = useState<Flight | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [bookingResult, setBookingResult] = useState<any>(null);
  const [scrolled, setScrolled] = useState(false);
  
  const [cancelRef, setCancelRef] = useState("");
  const [cancelEmail, setCancelEmail] = useState("");
  const [cancelLoading, setCancelLoading] = useState(false);
  const [cancelMessage, setCancelMessage] = useState("");
  const [cancelError, setCancelError] = useState("");

  const [myBookingsEmail, setMyBookingsEmail] = useState("");
  const [myBookings, setMyBookings] = useState<MyBooking[]>([]);
  const [showMyBookings, setShowMyBookings] = useState(false);
  const [bookingsLoading, setBookingsLoading] = useState(false);
  const [bookingsError, setBookingsError] = useState("");
  const [activeTab, setActiveTab] = useState<"search" | "bookings" | "cancel">("search");

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const searchFlights = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!origin || !destination || !startDate || !endDate) {
      setError("Please fill in all fields");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await fetch(
        `/api/schedules?orig=${origin}&dest=${destination}&date1=${startDate}&date2=${endDate}`
      );
      const data = await response.json();

      if (data.success) {
        setFlights(data.flights);
        if (data.flights.length === 0) {
          setError("No flights found for your search criteria");
        }
      } else {
        setError("Error searching flights");
      }
    } catch (err) {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const fetchMyBookings = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!myBookingsEmail) {
      setBookingsError("Please enter your email");
      return;
    }

    setBookingsLoading(true);
    setBookingsError("");
    setShowMyBookings(true);

    try {
      const response = await fetch(`/api/mybookings?email=${encodeURIComponent(myBookingsEmail)}`);
      const data = await response.json();

      if (data.success) {
        setMyBookings(data.bookings);
        if (data.bookings.length === 0) {
          setBookingsError("No bookings found for this email");
        }
      } else {
        setBookingsError("Error fetching bookings");
      }
    } catch (err) {
      setBookingsError("Network error. Please try again.");
    } finally {
      setBookingsLoading(false);
    }
  };

  const handleBookClick = (flight: Flight) => {
    if (flight.availableSeats === 0) {
      alert("Sorry, this flight is fully booked.");
      return;
    }
    setSelectedFlight(flight);
    setShowModal(true);
  };

  const handleBookingComplete = (bookingRef: string, passengerName: string, passengerEmail: string) => {
    setBookingResult({ 
      bookingRef, 
      passengerName, 
      passengerEmail,
      seatNumber: 1 
    });
    setShowConfirmation(true);
    // Refresh flights to update available seats
    setTimeout(() => {
      searchFlights(new Event("submit") as any);
    }, 500);
  };

  const handleCancelBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!cancelRef || !cancelEmail) {
      setCancelError("Please enter both booking reference and email");
      return;
    }

    setCancelLoading(true);
    setCancelError("");
    setCancelMessage("");

    try {
      const response = await fetch("/api/cancel", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          bookingReference: cancelRef,
          email: cancelEmail
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setCancelMessage(`Booking ${cancelRef} cancelled successfully`);
        setCancelRef("");
        setCancelEmail("");
        searchFlights(new Event("submit") as any);
      } else {
        setCancelError(data.error || "Cancellation failed");
      }
    } catch (err) {
      setCancelError("Network error. Please try again.");
    } finally {
      setCancelLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString("en-NZ", {
      weekday: "short",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      timeZone: "Pacific/Auckland",
    });
  };

  const formatTimeOnly = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString("en-NZ", {
      hour: "2-digit",
      minute: "2-digit",
      timeZone: "Pacific/Auckland",
    });
  };

  const getCityName = (code: string) => {
    const airport = airports.find(a => a.code === code);
    return airport ? airport.city : code;
  };

  return (
    <>
      <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${scrolled ? "bg-white/95 shadow-lg backdrop-blur-md" : "bg-black/30 backdrop-blur-sm"}`}>
        <div className="container mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <AirplaneIcon className="w-8 h-8 text-white" />
              <span className={`font-bold text-xl ${scrolled ? "text-gray-800" : "text-white"}`}>Dairy Flat Airlines</span>
            </div>
            <div className="hidden md:flex gap-8">
              <a href="#" className={`${scrolled ? "text-gray-600" : "text-white/80"} hover:text-white transition`}>Experience</a>
              <a href="#" className={`${scrolled ? "text-gray-600" : "text-white/80"} hover:text-white transition`}>Fleet</a>
              <a href="#" className={`${scrolled ? "text-gray-600" : "text-white/80"} hover:text-white transition`}>Destinations</a>
            </div>
          </div>
        </div>
      </nav>

      <div className="relative min-h-screen overflow-hidden bg-cover bg-center bg-no-repeat" style={{ backgroundImage: "url('/bg-plane.jpg')" }}>
        <div className="absolute inset-0 bg-black/50"></div>
        <div className="relative z-10 container mx-auto px-6 pt-32 pb-20">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 mb-6">
              <AirplaneIcon className="w-4 h-4 text-white" />
              <span className="text-sm text-white/90">Luxury Private Aviation</span>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-4 tracking-tight">Elevate Your Journey</h1>
            <p className="text-lg text-white/80 max-w-2xl mx-auto">Experience unparalleled comfort aboard New Zealand's premier private airline</p>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
              <div className="flex border-b border-gray-100">
                <button onClick={() => setActiveTab("search")} className={`flex-1 py-4 font-semibold transition-all relative ${activeTab === "search" ? "text-blue-600" : "text-gray-500 hover:text-gray-700"}`}>
                  <span className="mr-2">✈️</span> Book a Flight
                  {activeTab === "search" && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 rounded-full"></div>}
                </button>
                <button onClick={() => setActiveTab("bookings")} className={`flex-1 py-4 font-semibold transition-all relative ${activeTab === "bookings" ? "text-blue-600" : "text-gray-500 hover:text-gray-700"}`}>
                  <span className="mr-2">📋</span> My Trips
                  {activeTab === "bookings" && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 rounded-full"></div>}
                </button>
                <button onClick={() => setActiveTab("cancel")} className={`flex-1 py-4 font-semibold transition-all relative ${activeTab === "cancel" ? "text-blue-600" : "text-gray-500 hover:text-gray-700"}`}>
                  <span className="mr-2">❌</span> Cancel Booking
                  {activeTab === "cancel" && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 rounded-full"></div>}
                </button>
              </div>

              <div className="p-6 md:p-8">
                {activeTab === "search" && (
                  <form onSubmit={searchFlights}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">From</label>
                        <div className="relative">
                          <LocationIcon className="absolute left-3 top-3 text-gray-400 w-4 h-4" />
                          <select value={origin} onChange={(e) => setOrigin(e.target.value)} className="w-full pl-9 pr-3 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 bg-gray-50 text-gray-800 text-sm" required>
                            <option value="">Select city</option>
                            {airports.map((airport) => (<option key={airport.code} value={airport.code}>{airport.city}, {airport.country} ({airport.code})</option>))}
                          </select>
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">To</label>
                        <div className="relative">
                          <LocationIcon className="absolute left-3 top-3 text-gray-400 w-4 h-4" />
                          <select value={destination} onChange={(e) => setDestination(e.target.value)} className="w-full pl-9 pr-3 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 bg-gray-50 text-gray-800 text-sm" required>
                            <option value="">Select city</option>
                            {airports.map((airport) => (<option key={airport.code} value={airport.code}>{airport.city}, {airport.country} ({airport.code})</option>))}
                          </select>
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Departure</label>
                        <div className="relative">
                          <CalendarIcon className="absolute left-3 top-3 text-gray-400 w-4 h-4" />
                          <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="w-full pl-9 pr-3 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 bg-gray-50 text-gray-800 text-sm" required />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Return</label>
                        <div className="relative">
                          <CalendarIcon className="absolute left-3 top-3 text-gray-400 w-4 h-4" />
                          <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="w-full pl-9 pr-3 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 bg-gray-50 text-gray-800 text-sm" required />
                        </div>
                      </div>
                    </div>
                    <button type="submit" disabled={loading} className="w-full mt-6 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold py-3 rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all disabled:opacity-50 flex items-center justify-center gap-2 text-sm">
                      <AirplaneIcon className="w-4 h-4" />
                      {loading ? "Searching..." : "Search Flights"}
                    </button>
                  </form>
                )}

                {activeTab === "bookings" && (
                  <div>
                    <form onSubmit={fetchMyBookings}>
                      <div className="flex gap-3">
                        <div className="flex-1 relative">
                          <EmailIcon className="absolute left-3 top-3 text-gray-400 w-4 h-4" />
                          <input type="email" value={myBookingsEmail} onChange={(e) => setMyBookingsEmail(e.target.value)} placeholder="Enter your email" className="w-full pl-9 pr-3 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 bg-gray-50 text-gray-800 text-sm placeholder-gray-400" required />
                        </div>
                        <button type="submit" disabled={bookingsLoading} className="bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold px-6 py-2.5 rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all flex items-center gap-2 text-sm">
                          <TicketIcon className="w-4 h-4" />
                          {bookingsLoading ? "Loading..." : "Find"}
                        </button>
                      </div>
                    </form>
                    {showMyBookings && myBookings.length > 0 && (
                      <div className="mt-6">
                        <h3 className="text-lg font-bold text-gray-800 mb-3">Your Trips ({myBookings.length})</h3>
                        <div className="space-y-3">
                          {myBookings.map((booking) => (
                            <div key={booking.bookingReference} className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                              <div className="flex justify-between items-start flex-wrap gap-3">
                                <div>
                                  <div className="flex items-center gap-2 mb-2">
                                    <span className="bg-blue-100 text-blue-700 text-xs font-mono font-bold px-2 py-0.5 rounded">{booking.bookingReference}</span>
                                    <span className="text-gray-400 text-xs">Seat {booking.seatNumber}</span>
                                  </div>
                                  <div className="flex items-center gap-3">
                                    <div><p className="text-xl font-bold text-gray-800">{booking.flight.origin}</p><p className="text-xs text-gray-500">{formatTimeOnly(booking.flight.departureDateTime)}</p></div>
                                    <ArrowRightIcon className="w-3 h-3 text-gray-400" />
                                    <div><p className="text-xl font-bold text-gray-800">{booking.flight.destination}</p><p className="text-xs text-gray-500">{formatTimeOnly(booking.flight.arrivalDateTime)}</p></div>
                                  </div>
                                  <p className="text-xs text-gray-400 mt-2">{formatDate(booking.flight.departureDateTime)}</p>
                                </div>
                                <div className="text-right"><p className="text-xl font-bold text-blue-600">${booking.flight.price}</p></div>
                              </div>
                            </div>
                          ))}
                        </div>
                        <button onClick={() => { setShowMyBookings(false); setMyBookings([]); setMyBookingsEmail(""); }} className="mt-3 text-gray-400 hover:text-gray-600 text-sm transition">Close</button>
                      </div>
                    )}
                    {bookingsError && <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">{bookingsError}</div>}
                  </div>
                )}

                {activeTab === "cancel" && (
                  <form onSubmit={handleCancelBooking}>
                    <div className="space-y-4">
                      <div><label className="block text-sm font-medium text-gray-700 mb-1">Booking Reference</label><input type="text" value={cancelRef} onChange={(e) => setCancelRef(e.target.value.toUpperCase())} placeholder="e.g., AB1234" className="w-full px-3 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 bg-gray-50 text-gray-800 text-sm uppercase" required /></div>
                      <div><label className="block text-sm font-medium text-gray-700 mb-1">Email</label><div className="relative"><EmailIcon className="absolute left-3 top-3 text-gray-400 w-4 h-4" /><input type="email" value={cancelEmail} onChange={(e) => setCancelEmail(e.target.value)} placeholder="email used for booking" className="w-full pl-9 pr-3 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 bg-gray-50 text-gray-800 text-sm" required /></div></div>
                    </div>
                    <button type="submit" disabled={cancelLoading} className="w-full mt-5 bg-gradient-to-r from-red-600 to-red-700 text-white font-semibold py-2.5 rounded-xl hover:from-red-700 hover:to-red-800 transition-all disabled:opacity-50 text-sm">{cancelLoading ? "Processing..." : "Cancel Booking"}</button>
                  </form>
                )}

                {error && activeTab === "search" && <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">{error}</div>}
                {cancelError && activeTab === "cancel" && <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">{cancelError}</div>}
                {cancelMessage && activeTab === "cancel" && <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-xl text-green-600 text-sm">{cancelMessage}</div>}
              </div>
            </div>
          </div>

          {flights.length > 0 && activeTab === "search" && (
            <div className="max-w-4xl mx-auto mt-8">
              <h2 className="text-white text-lg font-semibold mb-3">Available Flights</h2>
              <div className="space-y-3">
                {flights.map((flight) => (
                  <div key={flight.id} className="bg-white rounded-xl p-4 shadow-md hover:shadow-lg transition">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <AirplaneIcon className="w-3 h-3 text-blue-500" />
                          <span className="bg-blue-50 text-blue-700 text-xs font-semibold px-2 py-0.5 rounded">{flight.flightNumber}</span>
                          <span className="text-gray-400 text-xs">•</span>
                          <span className="text-gray-500 text-xs">{flight.aircraft}</span>
                          {flight.availableSeats <= 2 && flight.availableSeats > 0 && <span className="bg-amber-100 text-amber-700 text-xs px-2 py-0.5 rounded">{flight.availableSeats} left</span>}
                        </div>
                        <div className="flex items-center gap-4">
                          <div><p className="text-xl font-bold text-gray-800">{formatTimeOnly(flight.departureDateTime)}</p><p className="text-xs text-gray-500">{getCityName(flight.origin)}</p></div>
                          <div className="flex-1 text-center"><div className="text-gray-300 text-xs">✈️</div><p className="text-xs text-gray-400">{Math.round((new Date(flight.arrivalDateTime).getTime() - new Date(flight.departureDateTime).getTime()) / 60000)} min</p></div>
                          <div><p className="text-xl font-bold text-gray-800">{formatTimeOnly(flight.arrivalDateTime)}</p><p className="text-xs text-gray-500">{getCityName(flight.destination)}</p></div>
                        </div>
                        <p className="text-xs text-gray-400 mt-2">{formatDate(flight.departureDateTime)}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-blue-600">${flight.price}</p>
                        <button onClick={() => handleBookClick(flight)} disabled={flight.availableSeats === 0} className={`mt-1 px-4 py-1.5 rounded-lg text-sm font-semibold transition ${flight.availableSeats === 0 ? "bg-gray-200 text-gray-400 cursor-not-allowed" : "bg-blue-600 text-white hover:bg-blue-700"}`}>{flight.availableSeats === 0 ? "Sold" : "Book"}</button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <footer className="bg-gray-900 text-white py-8"><div className="container mx-auto px-6 text-center text-gray-500 text-sm">© 2026 Dairy Flat Airlines. All rights reserved.</div></footer>

      {selectedFlight && (
        <BookingModal 
          isOpen={showModal} 
          onClose={() => { setShowModal(false); setSelectedFlight(null); }} 
          flight={selectedFlight} 
          onBookingComplete={(bookingRef, passengerName, passengerEmail) => handleBookingComplete(bookingRef, passengerName, passengerEmail)} 
        />
      )}

      {bookingResult && selectedFlight && (
        <BookingConfirmation 
          isOpen={showConfirmation} 
          onClose={() => { setShowConfirmation(false); setBookingResult(null); setSelectedFlight(null); }} 
          bookingRef={bookingResult.bookingRef} 
          flight={{ 
            flightNumber: selectedFlight.flightNumber, 
            origin: selectedFlight.origin, 
            destination: selectedFlight.destination, 
            departureDateTime: selectedFlight.departureDateTime, 
            arrivalDateTime: selectedFlight.arrivalDateTime, 
            price: selectedFlight.price, 
            seatNumber: bookingResult.seatNumber || 1 
          }} 
          passenger={{ name: bookingResult.passengerName || "", email: bookingResult.passengerEmail || "" }} 
        />
      )}
    </>
  );
}
