export type BeddingSetsStatusReport = {
  days: BeddingSetsStatus[];
};

export type BeddingSetsStatus = BeddingSetsState & {
  date: Date;
};

export type BeddingSetsState = {
  cleaned: number;
  in_use: number;
  dirty: number;
  in_laundery: number;
};

export type Booking = {
  checkInDate: Date;
  checkOutDate: Date;
  beddingSets: number;
};
