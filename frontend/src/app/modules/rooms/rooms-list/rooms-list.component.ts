import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { FormsModule } from '@angular/forms';
import { RoomService } from '../services/room.service';
import { RoomFormComponent } from '../room-form/room-form.component';
import { Room, ROOM_TYPES, ROOM_STATUSES } from '../../../shared/models/room.model';
import { parseError } from '../../../shared/utils/parse-error.util';

@Component({
  selector: 'app-rooms-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatChipsModule,
    MatSelectModule,
    MatFormFieldModule,
    MatInputModule,
    MatDialogModule,
    MatSnackBarModule,
    MatTooltipModule,
  ],
  templateUrl: './rooms-list.component.html', // ← changed
  styleUrl: './rooms-list.component.scss', // ← changed
})
export class RoomsListComponent implements OnInit {
  rooms: Room[] = [];
  displayedColumns = ['number', 'room_type', 'floor', 'capacity', 'price', 'status', 'actions'];

  roomTypes = ROOM_TYPES;
  roomStatuses = ROOM_STATUSES;

  searchQuery = '';
  selectedStatus = '';
  selectedType = '';

  // Stats shown at the top of the page
  roomStats = [
    { label: 'Total', count: 0, color: '#1a237e' },
    { label: 'Available', count: 0, color: '#2e7d32' },
    { label: 'Occupied', count: 0, color: '#e65100' },
    { label: 'Maintenance', count: 0, color: '#c62828' },
    { label: 'Cleaning', count: 0, color: '#1565c0' },
  ];

  constructor(
    private roomService: RoomService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
  ) {}

  ngOnInit(): void {
    this.loadRooms();
  }

  loadRooms(): void {
    const filters = {
      status: this.selectedStatus || undefined,
      room_type: this.selectedType || undefined,
      search: this.searchQuery || undefined,
    };

    this.roomService.getRooms(filters).subscribe((rooms) => {
      this.rooms = rooms;
      this.updateStats(rooms);
    });
  }

  updateStats(rooms: Room[]): void {
    this.roomStats[0].count = rooms.length;
    this.roomStats[1].count = rooms.filter((r) => r.status === 'available').length;
    this.roomStats[2].count = rooms.filter((r) => r.status === 'occupied').length;
    this.roomStats[3].count = rooms.filter((r) => r.status === 'maintenance').length;
    this.roomStats[4].count = rooms.filter((r) => r.status === 'cleaning').length;
  }

  applyFilters(): void {
    this.loadRooms();
  }

  clearFilters(): void {
    this.searchQuery = '';
    this.selectedStatus = '';
    this.selectedType = '';
    this.loadRooms();
  }

  openAddRoom(): void {
    const dialogRef = this.dialog.open(RoomFormComponent, { data: {} });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.roomService.createRoom(result).subscribe({
          next: () => {
            this.showMessage('Room added successfully!');
            this.loadRooms();
          },
          error: (err) => this.showMessage(parseError(err), true),
        });
      }
    });
  }

  openEditRoom(room: Room): void {
    const dialogRef = this.dialog.open(RoomFormComponent, { data: { room } });

    dialogRef.afterClosed().subscribe((result) => {
      if (result && room.id) {
        this.roomService.updateRoom(room.id, result).subscribe({
          next: () => {
            this.showMessage('Room updated successfully!');
            this.loadRooms();
          },
          error: (err) => this.showMessage(parseError(err), true),
        });
      }
    });
  }

  deleteRoom(room: Room): void {
    if (!confirm(`Are you sure you want to delete Room ${room.number}?`)) return;

    this.roomService.deleteRoom(room.id!).subscribe({
      next: () => {
        this.showMessage('Room deleted.');
        this.loadRooms();
      },
      error: (err) => this.showMessage(parseError(err), true),
    });
  }

  private showMessage(message: string, isError = false): void {
    this.snackBar.open(message, 'Close', {
      duration: 3000,
      panelClass: isError ? ['snack-error'] : ['snack-success'],
    });
  }
}