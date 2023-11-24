export type BeddingSetsStatesReport = {
  days: BeddingSetsStateOnDate[];
};

// definisci tipo evento stringa che possiede solo i seguenti valori: 'checkIn', 'checkOut', 'delivery', 'pickup'
export type Event = 'Check In' | 'Check Out' | 'Delivery' | 'Pickup';

export type BeddingSetsStateOnDate = BeddingSetsState & {
  date: Date;
  events: Event[];
};

export type BeddingSetsState = {
  cleaned: number;
  in_use: number;
  dirty: number;
  cleaning: number;
  in_laundery: number;
};

