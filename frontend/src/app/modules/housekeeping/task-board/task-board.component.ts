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
import { MatChipsModule } from '@angular/material/chips';
import { FormsModule } from '@angular/forms';
import { HousekeepingService } from '../services/housekeeping.service';
import { TaskFormComponent } from '../task-form/task-form.component';
import { ReportFormComponent } from '../report-form/report-form.component';
import { SupplyFormComponent } from '../supply-form/supply-form.component';
import { CountPassedPipe } from '../../../shared/pipes/count-passed.pipe';
import {
  CleaningTask,
  HygieneReport,
  SupplyLog,
  TASK_STATUSES,
  PRIORITIES,
  TASK_TYPES,
} from '../../../shared/models/housekeeping.model';
import { parseError } from '../../../shared/utils/parse-error.util';

@Component({
  selector: 'app-task-board',
  standalone: true,
  imports: [
    CommonModule,
    CountPassedPipe,
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
    MatChipsModule,
  ],
  templateUrl: './task-board.component.html',
  styleUrl: './task-board.component.scss',
})
export class TaskBoardComponent implements OnInit {
  // Tasks
  tasks: CleaningTask[] = [];
  taskColumns = ['room', 'task_type', 'priority', 'scheduled', 'status', 'actions'];
  taskStatuses = TASK_STATUSES;
  taskPriorities = PRIORITIES;
  taskTypes = TASK_TYPES;
  taskSearch = '';
  selectedStatus = '';
  selectedPriority = '';

  // Reports
  reports: HygieneReport[] = [];
  reportColumns = ['room', 'rating', 'passed', 'issues', 'date', 'actions'];
  selectedRating = '';

  // Supplies
  supplies: SupplyLog[] = [];
  supplyColumns = ['item', 'quantity', 'room', 'date', 'actions'];

  constructor(
    private hkService: HousekeepingService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
  ) {}

  ngOnInit(): void {
    this.loadTasks();
    this.loadReports();
    this.loadSupplies();
  }

  // ── Tasks ─────────────────────────────────────
  loadTasks(): void {
    this.hkService
      .getTasks({
        status: this.selectedStatus || undefined,
        priority: this.selectedPriority || undefined,
        search: this.taskSearch || undefined,
      })
      .subscribe((tasks) => (this.tasks = tasks));
  }

  openAddTask(): void {
    const ref = this.dialog.open(TaskFormComponent, { data: {} });
    ref.afterClosed().subscribe((result) => {
      if (result) {
        this.hkService.createTask(result).subscribe({
          next: () => {
            this.showMessage('Task created!');
            this.loadTasks();
          },
          error: (err) => this.showMessage(parseError(err), true),
        });
      }
    });
  }

  openEditTask(task: CleaningTask): void {
    const ref = this.dialog.open(TaskFormComponent, { data: { task } });
    ref.afterClosed().subscribe((result) => {
      if (result && task.id) {
        this.hkService.updateTask(task.id, result).subscribe({
          next: () => {
            this.showMessage('Task updated!');
            this.loadTasks();
          },
          error: (err) => this.showMessage(parseError(err), true),
        });
      }
    });
  }

  startTask(task: CleaningTask): void {
    this.hkService.startTask(task.id!).subscribe({
      next: () => {
        this.showMessage('Task started!');
        this.loadTasks();
      },
      error: (err) => this.showMessage(parseError(err), true),
    });
  }

  completeTask(task: CleaningTask): void {
    this.hkService.completeTask(task.id!).subscribe({
      next: () => {
        this.showMessage('Task completed!');
        this.loadTasks();
      },
      error: (err) => this.showMessage(parseError(err), true),
    });
  }

  inspectTask(task: CleaningTask): void {
    this.hkService.inspectTask(task.id!).subscribe({
      next: () => {
        this.showMessage('Task inspected!');
        this.loadTasks();
      },
      error: (err) => this.showMessage(parseError(err), true),
    });
  }

  deleteTask(task: CleaningTask): void {
    if (!confirm('Delete this task?')) return;
    this.hkService.deleteTask(task.id!).subscribe({
      next: () => {
        this.showMessage('Task deleted.');
        this.loadTasks();
      },
      error: (err) => this.showMessage(parseError(err), true),
    });
  }

  getTaskCount(status: string): number {
    return this.tasks.filter((t) => t.status === status).length;
  }

  // ── Reports ───────────────────────────────────
  loadReports(): void {
    this.hkService
      .getReports({
        rating: this.selectedRating || undefined,
      })
      .subscribe((reports) => (this.reports = reports));
  }

  openAddReport(): void {
    const ref = this.dialog.open(ReportFormComponent, { data: {} });
    ref.afterClosed().subscribe((result) => {
      if (result) {
        this.hkService.createReport(result).subscribe({
          next: () => {
            this.showMessage('Report submitted!');
            this.loadReports();
          },
          error: (err) => this.showMessage(parseError(err), true),
        });
      }
    });
  }

  deleteReport(report: HygieneReport): void {
    if (!confirm('Delete this report?')) return;
    this.hkService.deleteReport(report.id!).subscribe({
      next: () => {
        this.showMessage('Report deleted.');
        this.loadReports();
      },
      error: (err) => this.showMessage(parseError(err), true),
    });
  }

  getPassRate(): number {
    if (!this.reports.length) return 0;
    const passed = this.reports.filter((r) => r.passed).length;
    return Math.round((passed / this.reports.length) * 100);
  }

  // ── Supplies ──────────────────────────────────
  loadSupplies(): void {
    this.hkService.getSupplies().subscribe((supplies) => (this.supplies = supplies));
  }

  openLogSupply(): void {
    const ref = this.dialog.open(SupplyFormComponent, { data: {} });
    ref.afterClosed().subscribe((result) => {
      if (result) {
        this.hkService.logSupply(result).subscribe({
          next: () => {
            this.showMessage('Supply logged!');
            this.loadSupplies();
          },
          error: (err) => this.showMessage(parseError(err), true),
        });
      }
    });
  }

  deleteSupply(supply: SupplyLog): void {
    if (!confirm('Delete this supply log?')) return;
    this.hkService.deleteSupply(supply.id!).subscribe({
      next: () => {
        this.showMessage('Log deleted.');
        this.loadSupplies();
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
