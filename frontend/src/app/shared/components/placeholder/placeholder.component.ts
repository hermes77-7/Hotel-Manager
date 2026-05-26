import { Component, Input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-placeholder',
  standalone: true,
  imports: [MatIconModule],
  template: `
    <div class="placeholder-container">
      <mat-icon class="placeholder-icon">{{ icon }}</mat-icon>
      <h2>{{ title }}</h2>
      <p>This module is coming soon. Check back after the next sprint!</p>
    </div>
  `,
  styles: [`
    .placeholder-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      height: 60vh;
      color: #9e9e9e;
      gap: 16px;
      text-align: center;
    }
    .placeholder-icon {
      font-size: 64px;
      width: 64px;
      height: 64px;
      color: #bdbdbd;
    }
    h2 { color: #616161; font-size: 24px; }
    p { font-size: 14px; max-width: 300px; }
  `]
})
export class PlaceholderComponent {
  @Input() title = 'Coming Soon';
  @Input() icon = 'construction';
}