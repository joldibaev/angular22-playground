export type UiTableDensity = 'compact' | 'comfortable';

export type UiTableSortDirection = 'asc' | 'desc';

export interface UiTableRange {
  readonly start: number;
  readonly end: number;
}

export interface UiTableEndReachedEvent {
  readonly loadedRows: number;
  readonly renderedEnd: number;
}
