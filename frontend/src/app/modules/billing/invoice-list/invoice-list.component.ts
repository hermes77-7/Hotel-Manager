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
import { InvoiceService } from '../services/invoice.service';
import { PaymentDialogComponent } from '../payment-dialog/payment-dialog.component';
import { Invoice } from '../../../shared/models/invoice.model';
import { parseError } from '../../../shared/utils/parse-error.util';

@Component({
  selector: 'app-invoice-list',
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
  templateUrl: './invoice-list.component.html',
  styleUrl: './invoice-list.component.scss',
})
export class InvoiceListComponent implements OnInit {
  invoices: Invoice[] = [];
  displayedColumns = [
    'id',
    'guest',
    'room',
    'charges',
    'total',
    'paid',
    'balance',
    'status',
    'actions',
  ];

  searchQuery = '';
  selectedStatus = '';

  invoiceStatuses = [
    { value: 'unpaid', label: 'Unpaid' },
    { value: 'partial', label: 'Partially Paid' },
    { value: 'paid', label: 'Paid' },
    { value: 'cancelled', label: 'Cancelled' },
  ];

  constructor(
    private invoiceService: InvoiceService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
  ) {}

  ngOnInit(): void {
    this.loadInvoices();
  }

  loadInvoices(): void {
    this.invoiceService
      .getInvoices({
        status: this.selectedStatus || undefined,
        search: this.searchQuery || undefined,
      })
      .subscribe((invoices) => (this.invoices = invoices));
  }

  applyFilters(): void {
    this.loadInvoices();
  }

  clearFilters(): void {
    this.searchQuery = '';
    this.selectedStatus = '';
    this.loadInvoices();
  }

  openPaymentDialog(invoice: Invoice): void {
    const ref = this.dialog.open(PaymentDialogComponent, {
      data: { invoice },
      width: '440px',
    });

    ref.afterClosed().subscribe((result) => {
      if (!result) return;

      if (result.payment_type === 'full') {
        this.invoiceService.markPaid(invoice.id!, result.payment_method).subscribe({
          next: () => {
            this.showMessage('Invoice marked as paid!');
            this.loadInvoices();
          },
          error: (err) => this.showMessage(parseError(err), true),
        });
      } else {
        this.invoiceService
          .recordPayment(invoice.id!, result.amount, result.payment_method)
          .subscribe({
            next: () => {
              this.showMessage('Payment recorded!');
              this.loadInvoices();
            },
            error: (err) => this.showMessage(parseError(err), true),
          });
      }
    });
  }

  getStatTotal(status: string): number {
    return this.invoices.filter((i) => i.status === status).length;
  }

  getTotalOutstanding(): number {
    return this.invoices
      .filter((i) => i.status !== 'paid' && i.status !== 'cancelled')
      .reduce((sum, i) => sum + +(i.balance_due ?? 0), 0);
  }

  private showMessage(message: string, isError = false): void {
    this.snackBar.open(message, 'Close', {
      duration: 3000,
      panelClass: isError ? ['snack-error'] : ['snack-success'],
    });
  }
}
