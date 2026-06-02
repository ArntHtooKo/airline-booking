export interface Schedule {
  _id?: string;
  flightNumber: string;
  aircraft: string;
  origin: string;
  destination: string;
  departureDateTime: Date;
  arrivalDateTime: Date;
  price: number;
  capacity: number;
  bookings: Booking[];
}

export interface Booking {
  bookingReference: string;
  passengerId: string;
  passengerName: string;
  passengerEmail: string;
  seatNumber?: number;
  bookingDate: Date;
}
