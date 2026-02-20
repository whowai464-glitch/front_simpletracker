export interface EventVolumeByHour {
  hour: string;
  event_name: string;
  count: number;
}

export interface EventVolumeReport {
  workspace_id: string;
  from: string;
  to: string;
  rows: EventVolumeByHour[];
}
