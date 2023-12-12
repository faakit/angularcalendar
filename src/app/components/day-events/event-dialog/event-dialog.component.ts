import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { eventColors } from 'src/app/utils/eventColors';
import { Store } from '@ngrx/store';
import { selectEvents } from 'src/app/state/events.selectors';
import { EventsActions } from 'src/app/state/events.actions';
import { Actions } from '@ngrx/effects';

interface DialogData {
  eventType: 'event' | 'task';
  date: Date;
  dialogClose: () => void;
}

@Component({
  selector: 'app-event-dialog',
  templateUrl: './event-dialog.component.html',
  styleUrls: ['./event-dialog.component.scss'],
})
export class EventDialogComponent implements OnInit {
  events$ = this.store.select(selectEvents);
  eventForm!: FormGroup;
  eventColors = eventColors;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private formBuilder: FormBuilder,
    private store: Store,
    private actions: Actions,
  ) {}

  ngOnInit(): void {
    this.eventForm = this.formBuilder.group({
      title: ['', [Validators.minLength(1), Validators.required]],
      description: '',
      startDate: [
        new Date(
          this.data.date.getFullYear(),
          this.data.date.getMonth(),
          this.data.date.getDate(),
        ),
      ],
      endDate: new Date(
        this.data.date.getFullYear(),
        this.data.date.getMonth(),
        this.data.date.getDate(),
      ),
      color: 'black',
      isTask: this.data.eventType === 'task',
      status: this.data.eventType === 'task' ? 'pending' : undefined,
    });
  }

  setDate(event: MatDatepickerInputEvent<unknown, unknown>) {
    const target = event.target as unknown as HTMLTextAreaElement;
    this.eventForm.patchValue({
      startDate: new Date(new Date(target.value).setHours(0, 0, 0)),
      endDate: new Date(new Date(target.value).setHours(0, 0, 0)),
    });
  }

  setDateTime(event: Event, type: 'start' | 'end') {
    const target = event.target as HTMLTextAreaElement;
    const date = new Date(this.eventForm.get('startDate')?.value);
    this.eventForm.patchValue({
      [type === 'start' ? 'startDate' : 'endDate']: new Date(
        date.setHours(+target.value.split(':')[0], +target.value.split(':')[1]),
      ),
    });
  }

  async submit() {
    if (!this.eventForm.valid) return;
    this.store.dispatch(
      EventsActions.createEvent({ event: this.eventForm.value }),
    );
    this.data.dialogClose();
  }
}
