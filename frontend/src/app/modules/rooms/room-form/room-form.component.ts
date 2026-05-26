import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Room, ROOM_TYPES, ROOM_STATUSES } from '../../../shared/models/room.model';

@Component({
  selector: 'app-room-form',
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
  template: `
    <div class="dialog-wrap">
      <!-- Header -->
      <div class="dialog-header">
        <div class="dialog-title-block">
          <div class="dialog-icon">
            <mat-icon>{{ isEdit ? 'edit' : 'add' }}</mat-icon>
          </div>
          <div>
            <h2 class="dialog-title">{{ isEdit ? 'Edit Room' : 'New Room' }}</h2>
            <p class="dialog-sub">
              {{ isEdit ? 'Update room details below' : 'Fill in the details to add a new room' }}
            </p>
          </div>
        </div>
        <button class="close-btn" (click)="onCancel()">
          <mat-icon>close</mat-icon>
        </button>
      </div>

      <!-- Body -->
      <form [formGroup]="roomForm" class="dialog-body">
        <!-- Row 1 -->
        <div class="form-row">
          <div class="field-wrap">
            <label class="field-label">Room Number <span class="required">*</span></label>
            <mat-form-field appearance="outline" class="full-width">
              <input matInput formControlName="number" placeholder="e.g. 101" />
              <mat-error *ngIf="roomForm.get('number')?.hasError('required')"> Required </mat-error>
            </mat-form-field>
          </div>

          <div class="field-wrap">
            <label class="field-label">Floor <span class="required">*</span></label>
            <mat-form-field appearance="outline" class="full-width">
              <input matInput type="number" formControlName="floor" placeholder="1" />
              <mat-error *ngIf="roomForm.get('floor')?.hasError('required')"> Required </mat-error>
            </mat-form-field>
          </div>
        </div>

        <!-- Row 2 -->
        <div class="form-row">
          <div class="field-wrap">
            <label class="field-label">Room Type <span class="required">*</span></label>
            <mat-form-field appearance="outline" class="full-width">
              <mat-select formControlName="room_type" placeholder="Select type">
                <mat-option *ngFor="let type of roomTypes" [value]="type.value">
                  {{ type.label }}
                </mat-option>
              </mat-select>
              <mat-error *ngIf="roomForm.get('room_type')?.hasError('required')">
                Required
              </mat-error>
            </mat-form-field>
          </div>

          <div class="field-wrap">
            <label class="field-label">Capacity</label>
            <mat-form-field appearance="outline" class="full-width">
              <input matInput type="number" formControlName="capacity" placeholder="2" />
              <mat-icon matSuffix class="suffix-icon">person</mat-icon>
            </mat-form-field>
          </div>
        </div>

        <!-- Row 3 -->
        <div class="form-row">
          <div class="field-wrap">
            <label class="field-label">Price per Night <span class="required">*</span></label>
            <mat-form-field appearance="outline" class="full-width">
              <input matInput type="number" formControlName="price" placeholder="0.00" />
              <span matPrefix class="prefix-text">$&nbsp;</span>
              <mat-error *ngIf="roomForm.get('price')?.hasError('required')"> Required </mat-error>
            </mat-form-field>
          </div>

          <div class="field-wrap">
            <label class="field-label">Status</label>
            <mat-form-field appearance="outline" class="full-width">
              <mat-select formControlName="status">
                <mat-option *ngFor="let s of roomStatuses" [value]="s.value">
                  <span class="status-option">
                    <span class="status-dot" [ngClass]="s.value"></span>
                    {{ s.label }}
                  </span>
                </mat-option>
              </mat-select>
            </mat-form-field>
          </div>
        </div>

        <!-- Description -->
        <div class="field-wrap full">
          <label class="field-label">Description</label>
          <mat-form-field appearance="outline" class="full-width">
            <textarea
              matInput
              formControlName="description"
              rows="3"
              placeholder="Optional notes about this room..."
            ></textarea>
          </mat-form-field>
        </div>
      </form>

      <!-- Footer -->
      <div class="dialog-footer">
        <button class="btn-cancel" (click)="onCancel()">Cancel</button>
        <button class="btn-save" [disabled]="roomForm.invalid" (click)="onSave()">
          <mat-icon>{{ isEdit ? 'save' : 'add' }}</mat-icon>
          {{ isEdit ? 'Save Changes' : 'Add Room' }}
        </button>
      </div>
    </div>
  `,
  styles: [
    `
      .dialog-wrap {
        background: var(--primary-light);
        border-radius: var(--radius-lg);
        overflow: hidden;
        width: 540px;
        display: flex;
        flex-direction: column;
      }

      /* ── Header ───────────────────────────── */
      .dialog-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 24px 28px;
        border-bottom: 1px solid var(--border);
        background: var(--primary-dark);
      }
      .dialog-title-block {
        display: flex;
        align-items: center;
        gap: 14px;
      }
      .dialog-icon {
        width: 40px;
        height: 40px;
        border-radius: var(--radius-sm);
        background: rgba(201, 168, 106, 0.12);
        border: 1px solid var(--border-strong);
        display: flex;
        align-items: center;
        justify-content: center;
        color: var(--accent);
      }
      .dialog-title {
        font-family: 'Cormorant Garamond', serif;
        font-size: 22px;
        font-weight: 600;
        color: var(--text-inverse);
        line-height: 1;
        margin-bottom: 4px;
      }
      .dialog-sub {
        font-size: 12px;
        color: var(--text-muted);
      }
      .close-btn {
        background: none;
        border: none;
        cursor: pointer;
        color: var(--text-muted);
        width: 32px;
        height: 32px;
        border-radius: var(--radius-sm);
        display: flex;
        align-items: center;
        justify-content: center;
        transition: var(--transition);
      }
      .close-btn:hover {
        background: rgba(255, 255, 255, 0.06);
        color: var(--text-inverse);
      }

      /* ── Body ─────────────────────────────── */
      .dialog-body {
        padding: 7px 28px;
        display: flex;
        flex-direction: column;
        gap: .3px;
      }

      .form-row {
        display: flex;
        gap: 16px;
      }
      .form-row .field-wrap {
        flex: 1;
      }
      .field-wrap.full {
        width: 100%;
      }

      .field-label {
        display: block;
        font-size: 11px;
        font-weight: 600;
        color: var(--text-muted);
        text-transform: uppercase;
        letter-spacing: 0.08em;
        margin-bottom: 6px;
      }
      .required {
        color: var(--accent);
      }
      .full-width {
        width: 100%;
      }

      /* Make form field inputs dark themed */
      ::ng-deep .dialog-body .mat-mdc-text-field-wrapper {
        background: var(--primary) !important;
      }
      ::ng-deep .dialog-body .mat-mdc-input-element {
        color: var(--text-inverse) !important;
      }
      ::ng-deep .dialog-body .mat-mdc-select-value-text {
        color: var(--text-inverse) !important;
      }
      ::ng-deep .dialog-body .mat-mdc-floating-label {
        color: var(--text-muted) !important;
      }
      ::ng-deep .dialog-body textarea {
        color: var(--text-inverse) !important;
      }
      ::ng-deep .dialog-body input::placeholder,
      ::ng-deep .dialog-body textarea::placeholder {
        color: var(--text-muted) !important;
        opacity: 0.7;
      }

      .suffix-icon {
        font-size: 16px !important;
        color: var(--text-muted);
      }
      .prefix-text {
        color: var(--accent);
        font-weight: 600;
        font-size: 14px;
      }

      /* Status dot in dropdown */
      .status-option {
        display: flex;
        align-items: center;
        gap: 8px;
      }
      .status-dot {
        width: 8px;
        height: 8px;
        border-radius: 50%;
        flex-shrink: 0;
      }
      .status-dot.available {
        background: #66bb6a;
      }
      .status-dot.occupied {
        background: #ffa726;
      }
      .status-dot.maintenance {
        background: #ef5350;
      }
      .status-dot.cleaning {
        background: #42a5f5;
      }

      /* ── Footer ───────────────────────────── */
      .dialog-footer {
        display: flex;
        justify-content: flex-end;
        gap: 12px;
        padding: 16px 28px 10px;
        border-top: 1px solid var(--border);
      }

      .btn-cancel {
        background: none;
        border: 1px solid var(--border-strong);
        color: var(--text-muted);
        padding: 0 20px;
        height: 40px;
        border-radius: var(--radius-sm);
        font-family: 'DM Sans', sans-serif;
        font-size: 13px;
        font-weight: 500;
        cursor: pointer;
        transition: var(--transition);
      }
      .btn-cancel:hover {
        border-color: var(--text-muted);
        color: var(--text-inverse);
        background: rgba(255, 255, 255, 0.04);
      }

      .btn-save {
        display: flex;
        align-items: center;
        gap: 8px;
        background: var(--accent);
        color: var(--primary);
        border: none;
        padding: 0 24px;
        height: 40px;
        border-radius: var(--radius-sm);
        font-family: 'DM Sans', sans-serif;
        font-size: 13px;
        font-weight: 600;
        cursor: pointer;
        transition: var(--transition);
        box-shadow: 0 2px 12px rgba(201, 168, 106, 0.25);
      }
      .btn-save mat-icon {
        font-size: 16px !important;
        width: 16px !important;
        height: 16px !important;
      }
      .btn-save:hover:not(:disabled) {
        background: var(--accent-light);
        box-shadow: 0 4px 16px rgba(201, 168, 106, 0.35);
        transform: translateY(-1px);
      }
      .btn-save:disabled {
        opacity: 0.4;
        cursor: not-allowed;
        transform: none;
      }
    `,
  ],
})
export class RoomFormComponent implements OnInit {
  roomForm!: FormGroup;
  roomTypes = ROOM_TYPES;
  roomStatuses = ROOM_STATUSES;
  isEdit = false;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<RoomFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { room?: Room },
  ) {}

  ngOnInit(): void {
    this.isEdit = !!this.data?.room;
    this.roomForm = this.fb.group({
      number: [this.data?.room?.number ?? '', Validators.required],
      room_type: [this.data?.room?.room_type ?? '', Validators.required],
      floor: [this.data?.room?.floor ?? 1, Validators.required],
      price: [this.data?.room?.price ?? '', Validators.required],
      capacity: [this.data?.room?.capacity ?? 1],
      status: [this.data?.room?.status ?? 'available'],
      description: [this.data?.room?.description ?? ''],
    });
  }

  onSave(): void {
    if (this.roomForm.valid) this.dialogRef.close(this.roomForm.value);
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
