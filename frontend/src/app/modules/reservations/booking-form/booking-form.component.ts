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
import { CustomerService } from '../../customers/services/customer.service';
import { Room } from '../../../shared/models/room.model';
import { Customer } from '../../../shared/models/customer.model';
import { Booking } from '../../../shared/models/booking.model';

@Component({
  selector: 'app-booking-form',
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
  templateUrl: './booking-form.component.html',
  styleUrl: './booking-form.component.scss',
})
export class BookingFormComponent implements OnInit {
  bookingForm!: FormGroup;
  availableRooms: Room[] = [];
  customers: Customer[] = [];
  isEdit = false;
  nights = 0;
  total = 0;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<BookingFormComponent>,
    private roomService: RoomService,
    private customerService: CustomerService,
    @Inject(MAT_DIALOG_DATA) public data: { booking?: Booking },
  ) {}

  ngOnInit(): void {
    this.isEdit = !!this.data?.booking;
    const b = this.data?.booking;

    this.bookingForm = this.fb.group({
      room: [b?.room ?? '', Validators.required],
      customer: [b?.customer ?? '', Validators.required],
      check_in: [b?.check_in ?? '', Validators.required],
      check_out: [b?.check_out ?? '', Validators.required],
      adults: [b?.adults ?? 1, Validators.required],
      children: [b?.children ?? 0],
      notes: [b?.notes ?? ''],
    });

    // Recalculate summary whenever dates or room change
    this.bookingForm.valueChanges.subscribe(() => this.calculateSummary());

    this.loadRooms();
    this.loadCustomers();
  }

  loadRooms(): void {
    // Only show available rooms when creating
    // When editing show all rooms
    const filters = this.isEdit ? {} : { status: 'available' };
    this.roomService.getRooms(filters).subscribe((rooms) => {
      this.availableRooms = rooms;
    });
  }

  loadCustomers(): void {
    this.customerService.getCustomers().subscribe((customers) => {
      this.customers = customers;
    });
  }

  calculateSummary(): void {
    const { check_in, check_out, room } = this.bookingForm.value;
    if (check_in && check_out && room) {
      const start = new Date(check_in);
      const end = new Date(check_out);
      this.nights = Math.max(
        0,
        Math.floor((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)),
      );
      const selectedRoom = this.availableRooms.find((r) => r.id === room);
      this.total = selectedRoom ? this.nights * +selectedRoom.price : 0;
    } else {
      this.nights = 0;
      this.total = 0;
    }
  }

  getSelectedRoom(): Room | undefined {
    return this.availableRooms.find((r) => r.id === this.bookingForm.value.room);
  }

  getSelectedCustomer(): Customer | undefined {
    return this.customers.find((c) => c.id === this.bookingForm.value.customer);
  }

  onSave(): void {
    if (this.bookingForm.valid) this.dialogRef.close(this.bookingForm.value);
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
