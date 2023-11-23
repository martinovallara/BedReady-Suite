export interface BeddingSetsStatusReport {
    days: BeddingSetsStatus[]; // Replace `any` with the appropriate type for the `days` array
  }

export interface BeddingSetsStatus {
    date: Date;
    cleaned: number;
    in_use: number;
    dirty: number;
    in_laundery: number;
}

export interface Booking {
  check_in_date: Date,
  check_out_date: Date,
  bedding_sets: number
}
