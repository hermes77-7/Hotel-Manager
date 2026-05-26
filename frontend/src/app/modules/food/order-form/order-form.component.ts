import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormArray, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { FoodService } from '../services/food.service';
import { CustomerService } from '../../customers/services/customer.service';
import { RoomService } from '../../rooms/services/room.service';
import { MenuItem, CATEGORY_ICONS } from '../../../shared/models/menu-item.model';
import { Customer } from '../../../shared/models/customer.model';
import { Room } from '../../../shared/models/room.model';

@Component({
  selector: 'app-order-form',
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
  templateUrl: './order-form.component.html',
  styleUrl: './order-form.component.scss',
})
export class OrderFormComponent implements OnInit {
  orderForm!: FormGroup;
  menuItems: MenuItem[] = [];
  customers: Customer[] = [];
  rooms: Room[] = [];
  categoryIcons = CATEGORY_ICONS;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<OrderFormComponent>,
    private foodService: FoodService,
    private customerService: CustomerService,
    private roomService: RoomService,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {}

  ngOnInit(): void {
    this.orderForm = this.fb.group({
      customer: ['', Validators.required],
      room: ['', Validators.required],
      notes: [''],
      items: this.fb.array([this.createItemRow()]),
    });

    this.foodService
      .getMenuItems({ is_available: true })
      .subscribe((items) => (this.menuItems = items));
    this.customerService.getCustomers().subscribe((customers) => (this.customers = customers));
    this.roomService.getRooms({ status: 'occupied' }).subscribe((rooms) => (this.rooms = rooms));
  }

  get itemsArray(): FormArray {
    return this.orderForm.get('items') as FormArray;
  }

  createItemRow(): FormGroup {
    return this.fb.group({
      menu_item: ['', Validators.required],
      quantity: [1, Validators.required],
    });
  }

  addItem(): void {
    this.itemsArray.push(this.createItemRow());
  }

  removeItem(index: number): void {
    if (this.itemsArray.length > 1) this.itemsArray.removeAt(index);
  }

  getItemPrice(index: number): number {
    const menuItemId = this.itemsArray.at(index).get('menu_item')?.value;
    const quantity = this.itemsArray.at(index).get('quantity')?.value || 1;
    const item = this.menuItems.find((m) => m.id === menuItemId);
    return item ? +item.price * quantity : 0;
  }

  getOrderTotal(): number {
    return this.itemsArray.controls.reduce((sum, _, i) => sum + this.getItemPrice(i), 0);
  }

  getMenuItemName(id: number): string {
    return this.menuItems.find((m) => m.id === id)?.name ?? '';
  }

  onSave(): void {
    if (this.orderForm.valid) this.dialogRef.close(this.orderForm.value);
  }
  onCancel(): void {
    this.dialogRef.close();
  }
}
