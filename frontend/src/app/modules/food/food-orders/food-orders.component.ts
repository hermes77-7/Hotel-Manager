import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTabsModule } from '@angular/material/tabs';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { FormsModule } from '@angular/forms';
import { FoodService } from '../services/food.service';
import { MenuFormComponent } from '../menu-form/menu-form.component';
import { OrderFormComponent } from '../order-form/order-form.component';
import { MenuItem, MENU_CATEGORIES, CATEGORY_ICONS } from '../../../shared/models/menu-item.model';
import { FoodOrder, ORDER_STATUSES } from '../../../shared/models/food-order.model';
import { parseError } from '../../../shared/utils/parse-error.util';

@Component({
  selector: 'app-food-orders',
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
    MatTabsModule,
    MatDialogModule,
    MatSnackBarModule,
    MatTooltipModule,
  ],
  templateUrl: './food-orders.component.html',
  styleUrl: './food-orders.component.scss',
})
export class FoodOrdersComponent implements OnInit {
  // Menu
  menuItems: MenuItem[] = [];
  menuColumns = ['name', 'category', 'price', 'available', 'actions'];
  menuCategories = MENU_CATEGORIES;
  categoryIcons = CATEGORY_ICONS;
  menuSearch = '';
  selectedCategory = '';

  // Orders
  orders: FoodOrder[] = [];
  orderColumns = ['id', 'guest', 'room', 'items', 'total', 'status', 'actions'];
  orderStatuses = ORDER_STATUSES;
  orderSearch = '';
  selectedStatus = '';

  constructor(
    private foodService: FoodService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
  ) {}

  ngOnInit(): void {
    this.loadMenu();
    this.loadOrders();
  }

  // ── Menu ──────────────────────────────────────
  loadMenu(): void {
    this.foodService
      .getMenuItems({
        search: this.menuSearch || undefined,
        category: this.selectedCategory || undefined,
      })
      .subscribe((items) => (this.menuItems = items));
  }

  openAddMenuItem(): void {
    const ref = this.dialog.open(MenuFormComponent, { data: {} });
    ref.afterClosed().subscribe((result) => {
      if (result) {
        this.foodService.createMenuItem(result).subscribe({
          next: () => {
            this.showMessage('Menu item added!');
            this.loadMenu();
          },
          error: (err) => this.showMessage(parseError(err), true),
        });
      }
    });
  }

  openEditMenuItem(item: MenuItem): void {
    const ref = this.dialog.open(MenuFormComponent, { data: { item } });
    ref.afterClosed().subscribe((result) => {
      if (result && item.id) {
        this.foodService.updateMenuItem(item.id, result).subscribe({
          next: () => {
            this.showMessage('Menu item updated!');
            this.loadMenu();
          },
          error: (err) => this.showMessage(parseError(err), true),
        });
      }
    });
  }

  deleteMenuItem(item: MenuItem): void {
    if (!confirm(`Delete "${item.name}" from the menu?`)) return;
    this.foodService.deleteMenuItem(item.id!).subscribe({
      next: () => {
        this.showMessage('Item removed.');
        this.loadMenu();
      },
      error: (err) => this.showMessage(parseError(err), true),
    });
  }

  // ── Orders ────────────────────────────────────
  loadOrders(): void {
    this.foodService
      .getOrders({
        status: this.selectedStatus || undefined,
        search: this.orderSearch || undefined,
      })
      .subscribe((orders) => (this.orders = orders));
  }

  openNewOrder(): void {
    const ref = this.dialog.open(OrderFormComponent, {
      data: {},
      width: '820px',
      maxWidth: '95vw',
    });
    ref.afterClosed().subscribe((result) => {
      if (result) {
        this.foodService.createOrder(result).subscribe({
          next: () => {
            this.showMessage('Order placed!');
            this.loadOrders();
          },
          error: (err) => this.showMessage(parseError(err), true),
        });
      }
    });
  }

  startPreparing(order: FoodOrder): void {
    this.foodService.startPreparing(order.id!).subscribe({
      next: () => {
        this.showMessage('Order is being prepared!');
        this.loadOrders();
      },
      error: (err) => this.showMessage(parseError(err), true),
    });
  }

  markReady(order: FoodOrder): void {
    this.foodService.markReady(order.id!).subscribe({
      next: () => {
        this.showMessage('Order is ready!');
        this.loadOrders();
      },
      error: (err) => this.showMessage(parseError(err), true),
    });
  }

  markDelivered(order: FoodOrder): void {
    this.foodService.markDelivered(order.id!).subscribe({
      next: () => {
        this.showMessage('Order delivered!');
        this.loadOrders();
      },
      error: (err) => this.showMessage(parseError(err), true),
    });
  }

  cancelOrder(order: FoodOrder): void {
    if (!confirm('Cancel this order?')) return;
    this.foodService.cancelOrder(order.id!).subscribe({
      next: () => {
        this.showMessage('Order cancelled.');
        this.loadOrders();
      },
      error: (err) => this.showMessage(parseError(err), true),
    });
  }

  getStatCount(status: string): number {
    return this.orders.filter((o) => o.status === status).length;
  }

  private showMessage(message: string, isError = false): void {
    this.snackBar.open(message, 'Close', {
      duration: 3000,
      panelClass: isError ? ['snack-error'] : ['snack-success'],
    });
  }
}
