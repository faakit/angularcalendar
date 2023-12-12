/* eslint-disable @ngrx/no-store-subscription */
import { CdkDragDrop } from '@angular/cdk/drag-drop';
import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { EventsActions } from 'src/app/state/events.actions';
import { IEvent } from 'src/app/state/events.reducers';
import { selectDay, selectEvents } from 'src/app/state/events.selectors';
import { eventColorsMap } from 'src/app/utils/eventColors';
import { removeDateHours } from 'src/app/utils/removeDateHours';
const DAY_MS = 60 * 60 * 24 * 1000;

@Component({
  selector: 'app-calendar-table',
  templateUrl: './calendar-table.component.html',
  styleUrls: ['./calendar-table.component.scss'],
})
export class CalendarTableComponent implements OnInit {
  monthNames = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];

  daysOfWeek = [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
  ];

  selectedDate = new Date();
  month = new Date().getMonth();
  year = new Date().getFullYear();
  days = this.getCalendarDays(this.selectedDate);
  allEvents$: IEvent[] = [];

  constructor(private store: Store) {}

  ngOnInit(): void {
    this.store.select(selectDay).subscribe(day => {
      this.selectedDate = day;
    });
    this.store.select(selectEvents).subscribe(events => {
      this.allEvents$ = events;
    });
  }

  dateEvents(date: Date): IEvent[] {
    return this.allEvents$.filter(
      event => removeDateHours(event.startDate) === removeDateHours(date),
    );
  }

  selectDate(date: Date): void {
    this.store.dispatch(EventsActions.getDayEvents({ date }));
  }

  changeMonth(direction: 'next' | 'previous'): void {
    if (direction === 'next') {
      this.month++;
      if (this.month > 11) {
        this.month = 0;
        this.year++;
      }
      this.days = this.getCalendarDays(
        new Date(this.year, this.month, new Date().getDay()),
      );
    } else {
      this.month--;
      if (this.month < 0) {
        this.month = 11;
        this.year--;
      }
      this.days = this.getCalendarDays(
        new Date(this.year, this.month, new Date().getDay()),
      );
    }
  }

  private getCalendarDays(date = new Date()) {
    const calendarStartTime = this.getCalendarStartDay(date).getTime();

    return this.range(0, 41).map(
      num => new Date(calendarStartTime + DAY_MS * num),
    );
  }

  private getCalendarStartDay(date = new Date()) {
    const [year, month] = [date.getFullYear(), date.getMonth()];
    const firstDayOfMonth = new Date(year, month, 1).getTime();

    return (
      this.range(1, 7)
        .map(num => new Date(firstDayOfMonth - DAY_MS * num))
        .find(dt => dt.getDay() === 0) || new Date(firstDayOfMonth)
    );
  }

  private range(start: number, end: number, length = end - start + 1) {
    return Array.from({ length }, (_, i) => start + i);
  }

  eventBackgroundColor(eventColor: string) {
    return eventColorsMap[eventColor];
  }

  drop(event: CdkDragDrop<IEvent>, droppedDate: Date) {
    const id = event.item.data;

    this.store.dispatch(
      EventsActions.changeEventDate({ id, date: droppedDate }),
    );
  }
}
