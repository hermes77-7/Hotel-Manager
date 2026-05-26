import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RoomService } from '../../rooms/services/room.service';
import { Room } from '../../../shared/models/room.model';
import { CleaningTask, TASK_TYPES, PRIORITIES } from '../../../shared/models/housekeeping.model';

@Component({
  selector: 'app-task-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
  ],
  templateUrl: './task-form.component.html',
  styleUrl: './task-form.component.scss',
})
export class TaskFormComponent implements OnInit {
  taskForm!: FormGroup;
  rooms: Room[] = [];
  taskTypes = TASK_TYPES;
  priorities = PRIORITIES;
  isEdit = false;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<TaskFormComponent>,
    private roomService: RoomService,
    @Inject(MAT_DIALOG_DATA) public data: { task?: CleaningTask },
  ) {}

  ngOnInit(): void {
    this.isEdit = !!this.data?.task;
    const t = this.data?.task;

    this.taskForm = this.fb.group({
      room: [t?.room ?? '', Validators.required],
      task_type: [t?.task_type ?? '', Validators.required],
      priority: [t?.priority ?? 'medium'],
      status: [t?.status ?? 'pending'],
      scheduled_for: [t?.scheduled_for ?? ''],
      notes: [t?.notes ?? ''],
    });

    this.roomService.getRooms().subscribe((rooms) => (this.rooms = rooms));
  }

  onSave(): void {
    if (this.taskForm.valid) this.dialogRef.close(this.taskForm.value);
  }
  onCancel(): void {
    this.dialogRef.close();
  }
}
