import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { FormsModule } from '@angular/forms';
import { CustomerService } from '../services/customer.service';
import { CustomerFormComponent } from '../customer-form/customer-form.component';
import { Customer, GENDERS } from '../../../shared/models/customer.model';
import { CountByPipe } from '../../../shared/pipes/count-by.pipe';
import { parseError } from '../../../shared/utils/parse-error.util';

@Component({
  selector: 'app-customers-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDialogModule,
    MatSnackBarModule,
    MatTooltipModule,
    CountByPipe,
  ],
  templateUrl: './customers-list.component.html',
  styleUrl: './customers-list.component.scss',
})
export class CustomersListComponent implements OnInit {
  customers: Customer[] = [];
  displayedColumns = ['name', 'email', 'phone', 'location', 'id_doc', 'actions'];

  genders = GENDERS;
  searchQuery = '';
  selectedGender = '';
  selectedCountry = '';

  constructor(
    private customerService: CustomerService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
  ) {}

  ngOnInit(): void {
    this.loadCustomers();
  }

  loadCustomers(): void {
    this.customerService
      .getCustomers({
        search: this.searchQuery || undefined,
        gender: this.selectedGender || undefined,
        country: this.selectedCountry || undefined,
      })
      .subscribe((customers) => (this.customers = customers));
  }

  applyFilters(): void {
    this.loadCustomers();
  }

  clearFilters(): void {
    this.searchQuery = '';
    this.selectedGender = '';
    this.selectedCountry = '';
    this.loadCustomers();
  }

  openAddCustomer(): void {
    const ref = this.dialog.open(CustomerFormComponent, { data: {} });
    ref.afterClosed().subscribe((result) => {
      if (result) {
        this.customerService.createCustomer(result).subscribe({
          next: () => {
            this.showMessage('Customer registered successfully!');
            this.loadCustomers();
          },
          error: (err) => this.showMessage(parseError(err), true),
        });
      }
    });
  }

  openEditCustomer(customer: Customer): void {
    const ref = this.dialog.open(CustomerFormComponent, { data: { customer } });
    ref.afterClosed().subscribe((result) => {
      if (result && customer.id) {
        this.customerService.updateCustomer(customer.id, result).subscribe({
          next: () => {
            this.showMessage('Customer updated successfully!');
            this.loadCustomers();
          },
          error: (err) => this.showMessage(parseError(err), true),
        });
      }
    });
  }

  deleteCustomer(customer: Customer): void {
    if (!confirm(`Delete ${customer.full_name}? This cannot be undone.`)) return;
    this.customerService.deleteCustomer(customer.id!).subscribe({
      next: () => {
        this.showMessage('Customer deleted.');
        this.loadCustomers();
      },
      error: () => this.showMessage('Failed to delete customer.', true),
    });
  }

  getInitials(customer: Customer): string {
    return `${customer.first_name[0]}${customer.last_name[0]}`.toUpperCase();
  }

  private showMessage(message: string, isError = false): void {
    this.snackBar.open(message, 'Close', {
      duration: 3000,
      panelClass: isError ? ['snack-error'] : ['snack-success'],
    });
  }
}
