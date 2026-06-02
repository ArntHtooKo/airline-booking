"use client";

import { useState } from "react";
import { AirplaneIcon, LocationIcon, CalendarIcon, EmailIcon, UserIcon, CloseIcon } from "@/components/Icons";

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  flight: {
    id: string;
    flightNumber: string;
    origin: string;
    destination: string;
    departureDateTime: string;
    arrivalDateTime: string;
    price: number;
  };
  onBookingComplete: (bookingData: any) => void;
}

export default function BookingModal({ isOpen, onClose, flight, onBookingComplete }: BookingModalProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [title, setTitle] = useState("");
  const [gender, setGender] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (!isOpen) return null;

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/book", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          flightId: flight.id,
          passengerName: name,
          passengerEmail: email,
          passengerTitle: title,
          passengerGender: gender,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        // Pass the complete booking data to parent
        onBookingComplete({
          bookingReference: data.bookingReference,
          seatNumber: data.seatNumber,
          flight: data.flight,
          passenger: data.passenger
        });
        onClose();
        // Reset form
        setName("");
        setEmail("");
        setTitle("");
        setGender("");
      } else {
        setError(data.error || "Booking failed");
      }
    } catch (err) {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-5 py-4 sticky top-0">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-xl font-bold text-white">Complete Booking</h2>
              <p className="text-blue-100 text-sm">Secure your seat</p>
            </div>
            <button onClick={onClose} className="text-white/80 hover:text-white transition">
              <CloseIcon className="w-5 h-5" />
            </button>
          </div>
        </div>
        
        <div className="p-5 border-b border-gray-100">
          <div className="bg-gray-50 rounded-xl p-3">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <AirplaneIcon className="w-4 h-4 text-blue-500" />
                <span className="font-semibold text-gray-800 text-sm">{flight.flightNumber}</span>
              </div>
              <span className="text-xs text-gray-500">{flight.origin} → {flight.destination}</span>
            </div>
            <div className="flex justify-between items-center">
              <div>
                <p className="text-lg font-bold text-gray-800">{formatTimeOnly(flight.departureDateTime)}</p>
                <p className="text-xs text-gray-500">{formatDate(flight.departureDateTime)}</p>
              </div>
              <div className="text-gray-300 text-sm">✈️</div>
              <div className="text-right">
                <p className="text-lg font-bold text-gray-800">{formatTimeOnly(flight.arrivalDateTime)}</p>
                <p className="text-xs text-gray-500">{flight.destination}</p>
              </div>
            </div>
            <div className="mt-2 pt-2 border-t border-gray-200 flex justify-between">
              <span className="text-sm text-gray-500">Total</span>
              <span className="text-xl font-bold text-blue-600">${flight.price}</span>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
            <select
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full border border-gray-300 rounded-xl p-2.5 focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-800 text-sm"
            >
              <option value="">Select title</option>
              <option value="Mr">Mr</option>
              <option value="Mrs">Mrs</option>
              <option value="Ms">Ms</option>
              <option value="Miss">Miss</option>
              <option value="Dr">Dr</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
            <div className="relative">
              <UserIcon className="absolute left-3 top-3 text-gray-400 w-4 h-4" />
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full pl-9 pr-3 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-800 text-sm placeholder-gray-400"
                required
                placeholder="John Smith"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
            <select
              value={gender}
              onChange={(e) => setGender(e.target.value)}
              className="w-full border border-gray-300 rounded-xl p-2.5 focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-800 text-sm"
            >
              <option value="">Select gender</option>
              <option value="m">Male</option>
              <option value="f">Female</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
            <div className="relative">
              <EmailIcon className="absolute left-3 top-3 text-gray-400 w-4 h-4" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-9 pr-3 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-800 text-sm placeholder-gray-400"
                required
                placeholder="john@example.com"
              />
            </div>
          </div>

          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">
              {error}
            </div>
          )}

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-gray-100 text-gray-700 py-2.5 rounded-xl hover:bg-gray-200 transition font-semibold text-sm"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-2.5 rounded-xl hover:from-blue-700 hover:to-indigo-700 transition font-semibold text-sm disabled:opacity-50"
            >
              {loading ? "Processing..." : "Confirm Booking"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
