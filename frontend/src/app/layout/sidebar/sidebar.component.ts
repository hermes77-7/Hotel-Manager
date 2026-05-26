import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, RouterLinkActive } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { Subscription } from 'rxjs';
import { AuthService } from '../../core/auth/auth.service';

interface NavItem {
  label: string;
  icon: string;
  route: string;
  roles: string[]; // Which roles can see this item
}

interface NavGroup {
  group: string;
  items: NavItem[];
  roles: string[]; // Which roles can see this group
}

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule, RouterLinkActive, MatIconModule],
  template: `
    <nav class="sidebar">
      <div class="nav-groups">
        <ng-container *ngFor="let group of navGroups">
          <!-- Only show group if user has access to at least one item -->
          <div class="nav-group" *ngIf="hasGroupAccess(group)">
            <span class="group-label">{{ group.group }}</span>

            <ng-container *ngFor="let item of group.items">
              <a
                *ngIf="hasAccess(item.roles)"
                class="nav-item"
                [routerLink]="item.route"
                routerLinkActive="active"
              >
                <mat-icon class="nav-icon">{{ item.icon }}</mat-icon>
                <span class="nav-label">{{ item.label }}</span>
                <span class="active-indicator"></span>
              </a>
            </ng-container>
          </div>
        </ng-container>
      </div>

      <div class="sidebar-footer">
        <div class="user-role-indicator" *ngIf="currentRole">
          <mat-icon>verified_user</mat-icon>
          <span>{{ currentRole | titlecase }}</span>
        </div>
        <span class="version">v1.0.0 — Prototype</span>
      </div>
    </nav>
  `,
  styles: [
    `
      .sidebar {
        width: 240px;
        height: 100%;
        background: var(--primary);
        border-right: 1px solid var(--border);
        display: flex;
        flex-direction: column;
        overflow-y: auto;
        overflow-x: hidden;
      }
      .nav-groups {
        flex: 1;
        padding: 16px 12px;
        display: flex;
        flex-direction: column;
        gap: 24px;
      }
      .group-label {
        display: block;
        font-size: 10px;
        font-weight: 600;
        color: var(--text-muted);
        text-transform: uppercase;
        letter-spacing: 0.1em;
        padding: 0 10px;
        margin-bottom: 6px;
      }
      .nav-item {
        display: flex;
        align-items: center;
        gap: 10px;
        padding: 9px 10px;
        border-radius: var(--radius-sm);
        color: #8a8a8a;
        text-decoration: none;
        transition: var(--transition);
        position: relative;
        overflow: hidden;
      }
      .nav-item:hover {
        background: rgba(255, 255, 255, 0.05);
        color: var(--text-inverse);
      }
      .nav-item.active {
        background: rgba(201, 168, 106, 0.1);
        color: var(--accent);
      }
      .nav-item.active .nav-icon {
        color: var(--accent);
      }
      .active-indicator {
        position: absolute;
        left: 0;
        top: 50%;
        transform: translateY(-50%);
        width: 3px;
        height: 0;
        background: var(--accent);
        border-radius: 0 2px 2px 0;
        transition: var(--transition);
      }
      .nav-item.active .active-indicator {
        height: 60%;
      }
      .nav-icon {
        font-size: 18px !important;
        width: 18px !important;
        height: 18px !important;
        transition: var(--transition);
        flex-shrink: 0;
      }
      .nav-label {
        font-size: 13px;
        font-weight: 400;
        white-space: nowrap;
      }
      .nav-item.active .nav-label {
        font-weight: 500;
      }
      .sidebar-footer {
        padding: 16px;
        border-top: 1px solid var(--border);
        display: flex;
        flex-direction: column;
        gap: 8px;
      }
      .user-role-indicator {
        display: flex;
        align-items: center;
        gap: 6px;
        font-size: 11px;
        color: var(--accent);
      }
      .user-role-indicator mat-icon {
        font-size: 14px !important;
        width: 14px !important;
        height: 14px !important;
      }
      .version {
        font-size: 11px;
        color: var(--text-muted);
        letter-spacing: 0.04em;
      }
    `,
  ],
})
export class SidebarComponent implements OnInit, OnDestroy {
  currentRole = '';
  private sub!: Subscription;

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.sub = this.authService.currentUser$.subscribe((user) => {
      this.currentRole = user?.role ?? '';
    });
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

  navGroups: NavGroup[] = [
    {
      group: 'Overview',
      roles: ['admin', 'receptionist', 'housekeeping', 'kitchen'],
      items: [
        {
          label: 'Dashboard',
          icon: 'dashboard',
          route: '/dashboard',
          roles: ['admin', 'receptionist', 'housekeeping', 'kitchen'],
        },
      ],
    },
    {
      group: 'Operations',
      roles: ['admin', 'receptionist', 'housekeeping'],
      items: [
        {
          label: 'Rooms',
          icon: 'bed',
          route: '/rooms',
          roles: ['admin', 'receptionist', 'housekeeping'],
        },
        {
          label: 'Customers',
          icon: 'people',
          route: '/customers',
          roles: ['admin', 'receptionist'],
        },
        {
          label: 'Reservations',
          icon: 'calendar_month',
          route: '/reservations',
          roles: ['admin', 'receptionist'],
        },
      ],
    },
    {
      group: 'Services',
      roles: ['admin', 'receptionist', 'housekeeping', 'kitchen'],
      items: [
        {
          label: 'Billing',
          icon: 'receipt_long',
          route: '/billing',
          roles: ['admin', 'receptionist'],
        },
        {
          label: 'Food & Orders',
          icon: 'restaurant',
          route: '/food',
          roles: ['admin', 'receptionist', 'kitchen'],
        },
        {
          label: 'Housekeeping',
          icon: 'cleaning_services',
          route: '/housekeeping',
          roles: ['admin', 'housekeeping'],
        },
      ],
    },
    {
      group: 'Insights',
      roles: ['admin'],
      items: [
        {
          label: 'Reports',
          icon: 'bar_chart',
          route: '/reports',
          roles: ['admin'],
        },
      ],
    },
  ];

  hasAccess(roles: string[]): boolean {
    if (!this.currentRole) return false;
    return roles.includes(this.currentRole);
  }

  hasGroupAccess(group: NavGroup): boolean {
    if (!this.currentRole) return false;
    // Show group only if user has access to at least one item in it
    return group.items.some((item) => item.roles.includes(this.currentRole));
  }
}
