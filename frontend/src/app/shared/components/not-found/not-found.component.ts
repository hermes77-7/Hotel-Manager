import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-not-found',
  standalone: true,
  imports: [MatButtonModule, MatIconModule, RouterModule],
  template: `
    <div class="not-found">
      <div class="nf-icon">⬡</div>
      <h1 class="nf-code">403</h1>
      <h2 class="nf-title">Access Denied</h2>
      <p class="nf-sub">You don't have permission to view this page.</p>
      <a mat-raised-button color="primary" routerLink="/dashboard">
        <mat-icon>home</mat-icon>
        Back to Dashboard
      </a>
    </div>
  `,
  styles: [
    `
      .not-found {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        height: 80vh;
        text-align: center;
        gap: 16px;
      }
      .nf-icon {
        font-size: 64px;
        color: var(--accent);
        opacity: 0.4;
        animation: float 4s ease-in-out infinite;
      }
      @keyframes float {
        0%,
        100% {
          transform: translateY(0);
        }
        50% {
          transform: translateY(-10px);
        }
      }
      .nf-code {
        font-family: 'Cormorant Garamond', serif;
        font-size: 80px;
        font-weight: 700;
        color: var(--accent);
        line-height: 1;
        margin: 0;
      }
      .nf-title {
        font-family: 'Cormorant Garamond', serif;
        font-size: 28px;
        color: var(--text-inverse);
        margin: 0;
      }
      .nf-sub {
        font-size: 14px;
        color: var(--text-muted);
        margin: 0;
      }
    `,
  ],
})
export class NotFoundComponent {}
