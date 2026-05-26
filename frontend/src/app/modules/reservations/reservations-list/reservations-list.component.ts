import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { FormsModule } from '@angular/forms';
import { BookingService } from '../services/booking.service';
import { BookingFormComponent } from '../booking-form/booking-form.component';
import { Booking, BOOKING_STATUSES } from '../../../shared/models/booking.model';
import { parseError } from '../../../shared/utils/parse-error.util';

@Component({
  selector: 'app-reservations-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDialogModule,
    MatSnackBarModule,
    MatTooltipModule,
  ],
  templateUrl: './reservations-list.component.html',
  styleUrl: './reservations-list.component.scss',
})
export class ReservationsListComponent implements OnInit {
  bookings: Booking[] = [];
  displayedColumns = ['id', 'guest', 'room', 'dates', 'duration', 'total', 'status', 'actions'];

  bookingStatuses = BOOKING_STATUSES;
  searchQuery = '';
  selectedStatus = '';

  constructor(
    private bookingService: BookingService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
  ) {}

  ngOnInit(): void {
    this.loadBookings();
  }

  loadBookings(): void {
    this.bookingService
      .getBookings({
        status: this.selectedStatus || undefined,
        search: this.searchQuery || undefined,
      })
      .subscribe((bookings) => (this.bookings = bookings));
  }

  applyFilters(): void {
    this.loadBookings();
  }

  clearFilters(): void {
    this.searchQuery = '';
    this.selectedStatus = '';
    this.loadBookings();
  }

  openAddBooking(): void {
    const ref = this.dialog.open(BookingFormComponent, {
      data: {},
      maxWidth: '95vw',
      width: '920px',
    });
    ref.afterClosed().subscribe((result) => {
      if (result) {
        this.bookingService.createBooking(result).subscribe({
          next: () => {
            this.showMessage('Reservation created!');
            this.loadBookings();
          },
          error: (err) => this.showMessage(parseError(err), true),
        });
      }
    });
  }

  openEditBooking(booking: Booking): void {
    const ref = this.dialog.open(BookingFormComponent, {
      data: { booking },
      maxWidth: '95vw',
      width: '920px',
    });
    ref.afterClosed().subscribe((result) => {
      if (result && booking.id) {
        this.bookingService.updateBooking(booking.id, result).subscribe({
          next: () => {
            this.showMessage('Reservation updated!');
            this.loadBookings();
          },
          error: (err) => this.showMessage(parseError(err), true),
        });
      }
    });
  }

  checkIn(booking: Booking): void {
    if (!confirm(`Check in ${booking.customer_detail?.full_name}?`)) return;
    this.bookingService.checkIn(booking.id!).subscribe({
      next: () => {
        this.showMessage('Guest checked in!');
        this.loadBookings();
      },
      error: (err) => this.showMessage(parseError(err), true),
    });
  }

  checkOut(booking: Booking): void {
    if (!confirm(`Check out ${booking.customer_detail?.full_name}?`)) return;
    this.bookingService.checkOut(booking.id!).subscribe({
      next: () => {
        this.showMessage('Guest checked out!');
        this.loadBookings();
      },
      error: (err) => this.showMessage(parseError(err), true),
    });
  }

  cancel(booking: Booking): void {
    if (!confirm('Cancel this reservation?')) return;
    this.bookingService.cancel(booking.id!).subscribe({
      next: () => {
        this.showMessage('Reservation cancelled.');
        this.loadBookings();
      },
      error: (err) => this.showMessage(parseError(err), true),
    });
  }

  getStatCount(status: string): number {
    return this.bookings.filter((b) => b.status === status).length;
  }

  private showMessage(message: string, isError = false): void {
    this.snackBar.open(message, 'Close', {
      duration: 3000,
      panelClass: isError ? ['snack-error'] : ['snack-success'],
    });
  }
}
