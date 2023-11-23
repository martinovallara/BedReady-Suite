export interface BeddingSetsStatusReport {
    days: BeddingSetsStatus[];
  }

export interface BeddingSetsStatus extends BeddingSetsState {
    date: Date;
}

export interface BeddingSetsState {
    cleaned: number;
    in_use: number;
    dirty: number;
    in_laundery: number;
}

export interface Booking {
  checkInDate: Date,
  checkOutDate: Date,
  beddingSets: number
}

