export type BeddingSetsStatesReport = {
  days: BeddingSetsStateOnDate[];
};

export type BeddingSetsStateOnDate = BeddingSetsState & {
  date: Date;
};

export type BeddingSetsState = {
  cleaned: number;
  in_use: number;
  dirty: number;
  cleaning: number;
  in_laundery: number;
};

export type Booking = {
  checkInDate: Date;
  checkOutDate: Date;
  beddingSets: number;
};
