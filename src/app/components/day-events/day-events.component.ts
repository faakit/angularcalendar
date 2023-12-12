import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatMenuTrigger } from '@angular/material/menu';
import { Store } from '@ngrx/store';
import { EventsActions } from 'src/app/state/events.actions';
import { selectDay, selectDayEvents } from 'src/app/state/events.selectors';
import { eventColorsMap } from 'src/app/utils/eventColors';
import { EventDialogComponent } from './event-dialog/event-dialog.component';

@Component({
  selector: 'app-day-events',
  templateUrl: './day-events.component.html',
  styleUrls: ['./day-events.component.scss'],
})
export class DayEventsComponent implements OnInit {
  displayedColumns: string[] = [
    'title',
    'description',
    'startDate',
    'endDate',
    'delete',
  ];
  events$ = this.store.select(selectDayEvents);
  date: Date = new Date();

  @ViewChild('menuTrigger') menuTrigger!: MatMenuTrigger;

  constructor(public dialog: MatDialog, private store: Store) {}

  ngOnInit(): void {
    // eslint-disable-next-line @ngrx/no-store-subscription
    this.store.select(selectDay).subscribe(day => {
      this.date = day;
    });
  }

  openDialog(eventType: 'event' | 'task') {
    const dialogRef = this.dialog.open(EventDialogComponent, {
      restoreFocus: false,
      data: {
        eventType,
        date: this.date,
        dialogClose: () => this.dialog.closeAll(),
      },
    });

    dialogRef.afterClosed().subscribe(() => this.menuTrigger.focus());
  }

  deleteEvent(id: number) {
    this.store.dispatch(EventsActions.deleteEvent({ id }));
  }

  eventBackgroundColor(eventColor: string) {
    return eventColorsMap[eventColor];
  }
}
