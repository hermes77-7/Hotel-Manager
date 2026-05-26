import { Component, Input, Output, EventEmitter, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Subscription } from 'rxjs';
import { AuthService, User } from '../../core/auth/auth.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatIconModule, MatMenuModule, MatTooltipModule],
  template: `
    <header class="header">
      <!-- Left — Toggle + Brand -->
      <div class="header-left">
        <button
          class="toggle-btn"
          (click)="toggleSidebar.emit()"
          [matTooltip]="sidebarOpen ? 'Collapse sidebar' : 'Expand sidebar'"
        >
          <mat-icon>{{ sidebarOpen ? 'menu_open' : 'menu' }}</mat-icon>
        </button>
        <div class="brand">
          <span class="brand-icon">⬡</span>
          <div class="brand-text">
            <span class="brand-name">AURUM</span>
            <span class="brand-sub">Hotel Management</span>
          </div>
        </div>
      </div>

      <!-- Right — User -->
      <div class="header-right">
        <div class="user-pill" *ngIf="currentUser; else loading" [matMenuTriggerFor]="userMenu">
          <div class="user-avatar">{{ currentUser.username[0].toUpperCase() }}</div>
          <div class="user-info">
            <span class="user-name">{{ currentUser.username }}</span>
            <span class="user-role">{{ currentUser.role }}</span>
          </div>
          <mat-icon class="chevron">expand_more</mat-icon>
        </div>

        <ng-template #loading>
          <div class="user-pill" *ngIf="isLoggedIn">
            <div class="user-avatar">—</div>
          </div>
        </ng-template>

        <mat-menu #userMenu="matMenu" xPosition="before">
          <div class="menu-header">
            <span>{{ currentUser?.username }}</span>
            <span class="menu-role">{{ currentUser?.role }}</span>
          </div>
          <hr class="menu-divider" />
          <button mat-menu-item (click)="logout()">
            <mat-icon>logout</mat-icon>
            <span>Sign out</span>
          </button>
        </mat-menu>
      </div>
    </header>
  `,
  styles: [
    `
      .header {
        height: 64px;
        background: var(--primary-dark);
        border-bottom: 1px solid var(--border);
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 0 16px;
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        z-index: 100;
      }
      .header-left {
        display: flex;
        align-items: center;
        gap: 12px;
      }
      .toggle-btn {
        background: none;
        border: none;
        cursor: pointer;
        color: var(--text-muted);
        width: 36px;
        height: 36px;
        border-radius: var(--radius-sm);
        display: flex;
        align-items: center;
        justify-content: center;
        transition: var(--transition);
        flex-shrink: 0;
      }
      .toggle-btn:hover {
        background: rgba(255, 255, 255, 0.06);
        color: var(--accent);
      }
      .toggle-btn mat-icon {
        font-size: 20px;
      }
      .brand {
        display: flex;
        align-items: center;
        gap: 10px;
      }
      .brand-icon {
        color: var(--accent);
        font-size: 22px;
        line-height: 1;
      }
      .brand-text {
        display: flex;
        flex-direction: column;
      }
      .brand-name {
        font-family: 'Cormorant Garamond', serif;
        font-size: 18px;
        font-weight: 700;
        color: var(--text-inverse);
        letter-spacing: 0.12em;
        line-height: 1;
      }
      .brand-sub {
        font-size: 10px;
        color: var(--text-muted);
        letter-spacing: 0.08em;
        text-transform: uppercase;
        line-height: 1.4;
      }
      .spacer {
        flex: 1;
      }
      .user-pill {
        display: flex;
        align-items: center;
        gap: 8px;
        padding: 6px 10px 6px 6px;
        border-radius: 40px;
        border: 1px solid var(--border);
        cursor: pointer;
        transition: var(--transition);
      }
      .user-pill:hover {
        border-color: var(--border-strong);
        background: rgba(255, 255, 255, 0.04);
      }
      .user-avatar {
        width: 30px;
        height: 30px;
        border-radius: 50%;
        background: linear-gradient(135deg, var(--accent-dark), var(--accent));
        color: var(--primary);
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: 700;
        font-size: 13px;
        flex-shrink: 0;
      }
      .user-info {
        display: flex;
        flex-direction: column;
      }
      .user-name {
        font-size: 13px;
        font-weight: 500;
        color: var(--text-inverse);
        line-height: 1.2;
      }
      .user-role {
        font-size: 10px;
        color: var(--accent);
        text-transform: capitalize;
      }
      .chevron {
        font-size: 16px !important;
        width: 16px !important;
        height: 16px !important;
        color: var(--text-muted);
      }
      .menu-header {
        padding: 12px 16px 8px;
        display: flex;
        flex-direction: column;
        font-size: 13px;
        color: var(--text-primary);
        font-weight: 500;
      }
      .menu-role {
        font-size: 11px;
        color: var(--accent);
        text-transform: capitalize;
        margin-top: 2px;
      }
      .menu-divider {
        border: none;
        border-top: 1px solid var(--border);
        margin: 4px 0;
      }

      /* Hide brand subtitle and user info text on small screens */
      @media (max-width: 480px) {
        .brand-sub {
          display: none;
        }
        .user-info {
          display: none;
        }
        .user-pill {
          padding: 4px;
        }
        .chevron {
          display: none;
        }
      }
    `,
  ],
})
export class HeaderComponent implements OnInit, OnDestroy {
  @Input() sidebarOpen = true;
  @Output() toggleSidebar = new EventEmitter<void>();

  currentUser: User | null = null;
  isLoggedIn = false;
  private userSub!: Subscription;

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.isLoggedIn = this.authService.isLoggedIn();
    this.userSub = this.authService.currentUser$.subscribe((user) => {
      this.currentUser = user;
    });
  }

  ngOnDestroy(): void {
    this.userSub.unsubscribe();
  }
  logout(): void {
    this.authService.logout();
  }
}
