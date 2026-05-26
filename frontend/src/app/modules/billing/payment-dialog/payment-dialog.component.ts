import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Invoice, PAYMENT_METHODS } from '../../../shared/models/invoice.model';

@Component({
  selector: 'app-payment-dialog',
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
  templateUrl: './payment-dialog.component.html',
  styleUrl: './payment-dialog.component.scss',
})
export class PaymentDialogComponent implements OnInit {
  paymentForm!: FormGroup;
  paymentMethods = PAYMENT_METHODS;
  isFullPayment = true;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<PaymentDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { invoice: Invoice },
  ) {}

  ngOnInit(): void {
    this.paymentForm = this.fb.group({
      payment_type: ['full'],
      amount: [this.data.invoice.balance_due],
      payment_method: ['cash', Validators.required],
    });

    this.paymentForm.get('payment_type')?.valueChanges.subscribe((type) => {
      this.isFullPayment = type === 'full';
      if (type === 'full') {
        this.paymentForm.get('amount')?.setValue(this.data.invoice.balance_due);
      }
    });
  }

  onConfirm(): void {
    if (this.paymentForm.valid) {
      this.dialogRef.close(this.paymentForm.value);
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
