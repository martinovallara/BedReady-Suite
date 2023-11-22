export interface BeddingSetsStatusReport {
    days: BeddingSetsStatus[]; // Replace `any` with the appropriate type for the `days` array
  }

export interface BeddingSetsStatus {
    date: Date;
}
