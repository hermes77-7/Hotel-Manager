import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MenuItem, MENU_CATEGORIES } from '../../../shared/models/menu-item.model';

@Component({
  selector: 'app-menu-form',
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
    MatSlideToggleModule,
  ],
  templateUrl: './menu-form.component.html',
  styleUrl: './menu-form.component.scss',
})
export class MenuFormComponent implements OnInit {
  menuForm!: FormGroup;
  categories = MENU_CATEGORIES;
  isEdit = false;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<MenuFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { item?: MenuItem },
  ) {}

  ngOnInit(): void {
    this.isEdit = !!this.data?.item;
    const i = this.data?.item;
    this.menuForm = this.fb.group({
      name: [i?.name ?? '', Validators.required],
      category: [i?.category ?? '', Validators.required],
      description: [i?.description ?? ''],
      price: [i?.price ?? '', Validators.required],
      is_available: [i?.is_available ?? true],
    });
  }

  onSave(): void {
    if (this.menuForm.valid) this.dialogRef.close(this.menuForm.value);
  }
  onCancel(): void {
    this.dialogRef.close();
  }
}
