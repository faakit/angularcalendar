import { createActionGroup, props } from '@ngrx/store';
import { IEvent } from './events.reducers';

export const EventsActions = createActionGroup({
  source: 'Events',
  events: {
    'Create Event': props<{ event: IEvent }>(),
    'Delete Event': props<{ id: number }>(),
    'Change Event Date': props<{ id: number; date: Date }>(),
    'Get Day Events': props<{ date: Date }>(),
  },
});
