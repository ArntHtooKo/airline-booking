"use client";

import { AirplaneIcon, CheckIcon, CloseIcon } from "@/components/Icons";

interface BookingConfirmationProps {
  isOpen: boolean;
  onClose: () => void;
  bookingRef: string;
  flight: {
    flightNumber: string;
    origin: string;
    destination: string;
    departureDateTime: string;
    arrivalDateTime: string;
    price: number;
    seatNumber: number;
  };
  passenger: {
    name: string;
    email: string;
  };
}

export default function BookingConfirmation({ isOpen, onClose, bookingRef, flight, passenger }: BookingConfirmationProps) {
  if (!isOpen) return null;

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString("en-NZ", {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric",
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

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-green-600 to-green-700 px-5 py-4 text-center">
          <CheckIcon className="w-12 h-12 text-white mx-auto mb-2" />
          <h2 className="text-xl font-bold text-white">Booking Confirmed!</h2>
          <p className="text-green-100 text-sm">Your journey is booked</p>
        </div>

        <div className="p-5">
          {/* Booking Reference */}
          <div className="text-center mb-5">
            <p className="text-gray-500 text-xs uppercase tracking-wide">Booking Reference</p>
            <p className="text-2xl font-mono font-bold text-blue-600 tracking-wider">{bookingRef}</p>
            <p className="text-xs text-gray-400 mt-1">Save this for future reference</p>
          </div>

          {/* Flight Details */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4 mb-5">
            <h3 className="font-bold text-gray-800 text-sm mb-3 flex items-center gap-2">
              <AirplaneIcon className="w-4 h-4 text-blue-500" />
              Flight Details
            </h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Flight Number</span>
                <span className="font-semibold text-gray-800">{flight.flightNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Route</span>
                <span className="font-semibold text-gray-800">{flight.origin} → {flight.destination}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Date</span>
                <span className="font-semibold text-gray-800">{formatDate(flight.departureDateTime).split(",")[0]}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Departure</span>
                <span className="font-semibold text-gray-800">{formatTimeOnly(flight.departureDateTime)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Arrival</span>
                <span className="font-semibold text-gray-800">{formatTimeOnly(flight.arrivalDateTime)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Seat</span>
                <span className="font-semibold text-gray-800 text-lg">{flight.seatNumber}</span>
              </div>
              <div className="flex justify-between pt-2 border-t border-blue-200">
                <span className="text-gray-600 font-medium">Total</span>
                <span className="text-xl font-bold text-blue-600">${flight.price}</span>
              </div>
            </div>
          </div>

          {/* Important Note */}
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 mb-5">
            <p className="text-xs text-amber-800">
              <strong>✈️ Important:</strong> Please save your booking reference. You'll need it to:
            </p>
            <ul className="text-xs text-amber-700 mt-1 ml-4 space-y-0.5">
              <li>• Cancel your booking</li>
              <li>• View your booking history</li>
            </ul>
          </div>

          <button
            onClick={onClose}
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-2.5 rounded-xl hover:from-blue-700 hover:to-indigo-700 transition font-semibold text-sm"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
