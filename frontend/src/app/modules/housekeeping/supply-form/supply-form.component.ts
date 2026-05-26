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

@Component({
  selector: 'app-supply-form',
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
  templateUrl: './supply-form.component.html',
  styleUrl: './supply-form.component.scss',
})
export class SupplyFormComponent implements OnInit {
  supplyForm!: FormGroup;
  rooms: Room[] = [];

  units = ['units', 'sets', 'pieces', 'bottles', 'rolls', 'bags', 'boxes', 'liters'];

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<SupplyFormComponent>,
    private roomService: RoomService,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {}

  ngOnInit(): void {
    this.supplyForm = this.fb.group({
      item_name: ['', Validators.required],
      quantity: [1, Validators.required],
      unit: ['units'],
      room: [null],
      notes: [''],
    });

    this.roomService.getRooms().subscribe((rooms) => (this.rooms = rooms));
  }

  onSave(): void {
    if (this.supplyForm.valid) this.dialogRef.close(this.supplyForm.value);
  }
  onCancel(): void {
    this.dialogRef.close();
  }
}
