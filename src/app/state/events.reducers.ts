import { createReducer, on } from '@ngrx/store';
import { removeDateHours } from '../utils/removeDateHours';
import { EventsActions } from './events.actions';

export interface IEvent {
  id: number;
  title: string;
  startDate: Date;
  endDate: Date;
  description: string;
  color: string;
}

export interface IEventsState {
  events: IEvent[];
  dayEvents: { day: Date; events: IEvent[] };
}

export const initialState: Readonly<IEventsState> = {
  events: [],
  dayEvents: { day: new Date(), events: [] },
};

export const eventsReducer = createReducer(
  initialState,
  on(EventsActions.createEvent, (state, { event }): IEventsState => {
    const id = Math.random() * (99999999999 - 0) + 0;
    const events = [...state.events, { ...event, id }];
    return {
      events,
      dayEvents: {
        day: state.dayEvents.day,
        events: events.filter(
          ev =>
            removeDateHours(ev.startDate) ===
            removeDateHours(state.dayEvents.day),
        ),
      },
    };
  }),
  on(EventsActions.deleteEvent, (state, { id }): IEventsState => {
    const events = state.events.filter(event => event.id !== id);
    return {
      events,
      dayEvents: {
        day: state.dayEvents.day,
        events: events.filter(
          ev =>
            removeDateHours(ev.startDate) ===
            removeDateHours(state.dayEvents.day),
        ),
      },
    };
  }),
  on(EventsActions.getDayEvents, (state, { date }): IEventsState => {
    return {
      events: state.events,
      dayEvents: {
        day: date,
        events: state.events.filter(
          ev => removeDateHours(ev.startDate) === removeDateHours(date),
        ),
      },
    };
  }),
  on(EventsActions.changeEventDate, (state, { id, date }): IEventsState => {
    const events = state.events.map(event => {
      if (event.id === id) {
        return { ...event, startDate: date, endDate: date };
      }
      return event;
    });
    return {
      events,
      dayEvents: {
        day: state.dayEvents.day,
        events: events.filter(
          ev =>
            removeDateHours(ev.startDate) ===
            removeDateHours(state.dayEvents.day),
        ),
      },
    };
  }),
);
