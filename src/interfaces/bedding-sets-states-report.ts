export type BeddingSetsStatesReport = {
  days: BeddingSetsStateOnDate[];
};


export type EventName = 'Check In' | 'Check Out' | 'In Cleaning' | 'Finish Cleaning' | 'Pickup' | 'Add Bedding Set' ;
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
  inUse: number;
  dirty: number;
  cleaning: number;
  inLaundery: number;
};

