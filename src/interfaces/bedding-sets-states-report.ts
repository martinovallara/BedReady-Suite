export type BeddingSetsStatesReport = {
  days: BeddingSetsStateOnDate[];
};


export type EventName = 'Check In' | 'Check Out' | 'InCleaning' | 'Pickup' | 'Add Bedding Set' ;
export type Event = {
  name: EventName;
  sets: number;
};

export type BeddingSetsStateOnDate = BeddingSetsState & {
  date: Date;
  events: Event[];
};

export type InitialState = BeddingSetsState & {
  date: Date;
}

export type BeddingSetsState = {
  cleaned: number;
  in_use: number;
  dirty: number;
  cleaning: number;
  in_laundery: number;
};

