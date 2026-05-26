import { Component, HostListener } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '../header/header.component';
import { SidebarComponent } from '../sidebar/sidebar.component';

@Component({
  selector: 'app-shell',
  standalone: true,
  imports: [RouterOutlet, CommonModule, HeaderComponent, SidebarComponent],
  template: `
    <app-header [sidebarOpen]="sidebarOpen" (toggleSidebar)="toggleSidebar()"> </app-header>

    <div class="shell-body">
      <!-- Mobile overlay — closes sidebar when tapping outside -->
      <div
        class="sidebar-overlay"
        *ngIf="sidebarOpen && isMobile"
        (click)="sidebarOpen = false"
      ></div>

      <!-- Sidebar -->
      <div class="sidebar-wrapper" [class.collapsed]="!sidebarOpen" [class.mobile]="isMobile">
        <app-sidebar (click)="onSidebarClick()"></app-sidebar>
      </div>

      <!-- Main content -->
      <main class="content" [class.expanded]="!sidebarOpen">
        <router-outlet></router-outlet>
      </main>
    </div>
  `,
  styles: [
    `
      .shell-body {
        display: flex;
        height: 100vh;
        padding-top: 64px;
        overflow: hidden;
        background: var(--primary);
        position: relative;
      }

      /* Desktop sidebar */
      .sidebar-wrapper {
        width: 240px;
        min-width: 240px;
        transition:
          width 0.3s cubic-bezier(0.4, 0, 0.2, 1),
          min-width 0.3s cubic-bezier(0.4, 0, 0.2, 1),
          opacity 0.2s ease;
        overflow: hidden;
        opacity: 1;
        flex-shrink: 0;
      }
      .sidebar-wrapper.collapsed {
        width: 0;
        min-width: 0;
        opacity: 0;
      }

      /* Mobile sidebar — slides over content */
      .sidebar-wrapper.mobile {
        position: fixed;
        top: 64px;
        left: 0;
        height: calc(100vh - 64px);
        z-index: 99;
        width: 240px;
        min-width: 240px;
        transition:
          transform 0.3s cubic-bezier(0.4, 0, 0.2, 1),
          opacity 0.2s ease;
        transform: translateX(0);
        opacity: 1;
      }
      .sidebar-wrapper.mobile.collapsed {
        width: 240px;
        min-width: 240px;
        transform: translateX(-100%);
        opacity: 0;
      }

      /* Dark overlay behind mobile sidebar */
      .sidebar-overlay {
        position: fixed;
        top: 64px;
        left: 0;
        width: 100vw;
        height: calc(100vh - 64px);
        background: rgba(0, 0, 0, 0.6);
        z-index: 98;
        backdrop-filter: blur(2px);
      }

      .content {
        flex: 1;
        overflow-y: auto;
        background: var(--primary);
        padding: 28px 32px;
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        min-width: 0;
      }

      @media (max-width: 768px) {
        .content {
          padding: 16px !important;
          width: 100%;
        }
      }
    `,
  ],
})
export class ShellComponent {
  sidebarOpen = true;
  isMobile = false;

  constructor() {
    this.checkScreenSize();
  }

  @HostListener('window:resize')
  onResize(): void {
    this.checkScreenSize();
  }

  checkScreenSize(): void {
    const wasMobile = this.isMobile;
    this.isMobile = window.innerWidth <= 768;

    // Auto close sidebar on mobile, auto open on desktop
    if (this.isMobile && !wasMobile) {
      this.sidebarOpen = false;
    } else if (!this.isMobile && wasMobile) {
      this.sidebarOpen = true;
    }
  }

  toggleSidebar(): void {
    this.sidebarOpen = !this.sidebarOpen;
  }

  onSidebarClick(): void {
    // Close sidebar on mobile after navigating
    if (this.isMobile) {
      this.sidebarOpen = false;
    }
  }
}
