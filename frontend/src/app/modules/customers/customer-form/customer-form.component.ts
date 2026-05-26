import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Customer, GENDERS, ID_TYPES } from '../../../shared/models/customer.model';

@Component({
  selector: 'app-customer-form',
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
  templateUrl: './customer-form.component.html',
  styleUrl: './customer-form.component.scss',
})
export class CustomerFormComponent implements OnInit {
  customerForm!: FormGroup;
  genders = GENDERS;
  idTypes = ID_TYPES;
  isEdit = false;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<CustomerFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { customer?: Customer },
  ) {}

  ngOnInit(): void {
    this.isEdit = !!this.data?.customer;
    const c = this.data?.customer;

    this.customerForm = this.fb.group({
      first_name: [c?.first_name ?? '', Validators.required],
      last_name: [c?.last_name ?? '', Validators.required],
      email: [c?.email ?? '', [Validators.required, Validators.email]],
      phone: [c?.phone ?? '', Validators.required],
      gender: [c?.gender ?? ''],
      date_of_birth: [c?.date_of_birth ?? ''],
      id_type: [c?.id_type ?? ''],
      id_number: [c?.id_number ?? ''],
      address: [c?.address ?? ''],
      city: [c?.city ?? ''],
      country: [c?.country ?? ''],
      notes: [c?.notes ?? ''],
    });
  }

  onSave(): void {
    if (this.customerForm.valid) this.dialogRef.close(this.customerForm.value);
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
