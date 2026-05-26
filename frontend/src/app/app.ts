import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',        // This becomes <app-root> in index.html
  standalone: true,            // Modern Angular — no need for NgModules
  imports: [RouterOutlet],     // We need RouterOutlet to render routes
  template: `<router-outlet></router-outlet>`  // Just a placeholder for pages
})
export class AppComponent {}