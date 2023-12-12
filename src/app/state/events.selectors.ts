import { createFeatureSelector, createSelector } from '@ngrx/store';
import { IEventsState } from './events.reducers';

const selectEventsFeature =
  createFeatureSelector<Readonly<IEventsState>>('events');

export const selectEvents = createSelector(
  selectEventsFeature,
  eventsState => eventsState.events,
);

export const selectDayEvents = createSelector(
  selectEventsFeature,
  eventsState => eventsState.dayEvents.events,
);

export const selectDay = createSelector(
  selectEventsFeature,
  eventsState => eventsState.dayEvents.day,
);
