import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { RoomService } from '../../rooms/services/room.service';
import { Room } from '../../../shared/models/room.model';
import { HYGIENE_RATINGS } from '../../../shared/models/housekeeping.model';

@Component({
  selector: 'app-report-form',
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
    MatSlideToggleModule,
  ],
  templateUrl: './report-form.component.html',
  styleUrl: './report-form.component.scss',
})
export class ReportFormComponent implements OnInit {
  reportForm!: FormGroup;
  rooms: Room[] = [];
  ratings = HYGIENE_RATINGS;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<ReportFormComponent>,
    private roomService: RoomService,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {}

  ngOnInit(): void {
    this.reportForm = this.fb.group({
      room: ['', Validators.required],
      rating: ['', Validators.required],
      notes: [''],
      issues_found: [''],
      passed: [true],
    });

    this.roomService.getRooms().subscribe((rooms) => (this.rooms = rooms));
  }

  onSave(): void {
    if (this.reportForm.valid) this.dialogRef.close(this.reportForm.value);
  }
  onCancel(): void {
    this.dialogRef.close();
  }
}
