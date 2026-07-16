export type UiTableSortDirection = 'asc' | 'desc';
export type UiTableDensity = 'compact' | 'default' | 'touch';

export interface UiTableRange {
  readonly start: number;
  readonly end: number;
}

export interface UiTableEndReachedEvent {
  readonly loadedRows: number;
  readonly renderedEnd: number;
}
