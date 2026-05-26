import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { AuthService } from '../../../core/auth/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
  ],
  template: `
    <div class="login-page">
      <!-- Left panel — branding -->
      <div class="login-left">
        <div class="brand-block">
          <span class="brand-hex">⬡</span>
          <h1 class="brand-name">AURUM</h1>
          <p class="brand-tagline">Hotel Management System</p>
        </div>
        <div class="decorative-lines"><span></span><span></span><span></span></div>
        <p class="brand-quote">
          "Luxury is in each detail."<br />
          <em>— By Biem Hermes</em>
        </p>
      </div>

      <!-- Right panel — form -->
      <div class="login-right">
        <div class="login-box">
          <div class="login-header">
            <h2>Welcome back</h2>
            <p>Sign in to your management console</p>
          </div>

          <form [formGroup]="loginForm" (ngSubmit)="onSubmit()" class="login-form">
            <div class="field-group">
              <label>Username</label>
              <mat-form-field appearance="outline" class="full-width">
                <input matInput formControlName="username" placeholder="Enter your username" />
                <mat-icon matPrefix>person_outline</mat-icon>
                <mat-error *ngIf="loginForm.get('username')?.hasError('required')">
                  Username is required
                </mat-error>
              </mat-form-field>
            </div>

            <div class="field-group">
              <label>Password</label>
              <mat-form-field appearance="outline" class="full-width">
                <input
                  matInput
                  [type]="hidePassword ? 'password' : 'text'"
                  formControlName="password"
                  placeholder="Enter your password"
                />
                <mat-icon matPrefix>lock_outline</mat-icon>
                <button
                  mat-icon-button
                  matSuffix
                  type="button"
                  (click)="hidePassword = !hidePassword"
                >
                  <mat-icon>{{ hidePassword ? 'visibility_off' : 'visibility' }}</mat-icon>
                </button>
                <mat-error *ngIf="loginForm.get('password')?.hasError('required')">
                  Password is required
                </mat-error>
              </mat-form-field>
            </div>

            <div class="error-banner" *ngIf="errorMessage">
              <mat-icon>error_outline</mat-icon>
              {{ errorMessage }}
            </div>

            <button class="submit-btn" type="submit" [disabled]="loginForm.invalid || isLoading">
              <mat-spinner diameter="18" *ngIf="isLoading"></mat-spinner>
              <span *ngIf="!isLoading">Sign In</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  `,
  styles: [`
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;600;700&family=DM+Sans:wght@300;400;500&display=swap');

  .login-page {
    display: flex;
    min-height: 100vh;
    background: var(--primary);
    font-family: 'DM Sans', sans-serif;
  }

  /* ── Left branding panel ── */
  .login-left {
    width: 45%;
    background: var(--primary-dark);
    border-right: 1px solid var(--border);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 40px;
    padding: 60px;
  }
  .brand-block { text-align: center; }
  .brand-hex {
    display: block; font-size: 48px; color: var(--accent);
    margin-bottom: 16px;
    animation: float 4s ease-in-out infinite;
  }
  @keyframes float {
    0%, 100% { transform: translateY(0); }
    50%       { transform: translateY(-8px); }
  }
  .brand-name {
    font-family: 'Cormorant Garamond', serif;
    font-size: 52px; font-weight: 700;
    color: var(--text-inverse); letter-spacing: 0.2em; margin-bottom: 8px;
  }
  .brand-tagline {
    font-size: 12px; color: var(--text-muted);
    letter-spacing: 0.15em; text-transform: uppercase;
  }
  .decorative-lines { display: flex; gap: 6px; align-items: center; }
  .decorative-lines span { height: 1px; background: var(--accent); opacity: 0.4; }
  .decorative-lines span:nth-child(1) { width: 24px; }
  .decorative-lines span:nth-child(2) { width: 48px; opacity: 0.7; }
  .decorative-lines span:nth-child(3) { width: 24px; }
  .brand-quote {
    text-align: center; color: var(--text-muted);
    font-size: 13px; line-height: 1.8; font-style: italic;
  }
  .brand-quote em { color: var(--accent); font-style: normal; font-size: 12px; }

  /* ── Right form panel ── */
  .login-right {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 40px;
  }
  .login-box { width: 100%; max-width: 400px; }
  .login-header { margin-bottom: 36px; }
  .login-header h2 {
    font-family: 'Cormorant Garamond', serif;
    font-size: 36px; font-weight: 600;
    color: var(--text-inverse); margin-bottom: 8px;
  }
  .login-header p { font-size: 13px; color: var(--text-muted); }
  .login-form { display: flex; flex-direction: column; gap: 8px; }
  .field-group label {
    display: block; font-size: 11px; font-weight: 600;
    color: var(--text-muted); text-transform: uppercase;
    letter-spacing: 0.08em; margin-bottom: 6px;
  }
  .full-width { width: 100%; }
  .error-banner {
    display: flex; align-items: center; gap: 8px;
    background: rgba(139,32,32,0.15);
    border: 1px solid rgba(139,32,32,0.4);
    border-radius: var(--radius-sm);
    padding: 10px 14px; color: #E57373; font-size: 13px;
  }
  .error-banner mat-icon { font-size: 16px; }
  .submit-btn {
    width: 100%; height: 48px; margin-top: 8px;
    background: var(--accent); color: var(--primary);
    border: none; border-radius: var(--radius-sm);
    font-family: 'DM Sans', sans-serif; font-size: 14px;
    font-weight: 600; letter-spacing: 0.06em;
    cursor: pointer; display: flex; align-items: center;
    justify-content: center; transition: var(--transition);
    box-shadow: 0 4px 16px rgba(201,168,106,0.3);
  }
  .submit-btn:hover:not(:disabled) {
    background: var(--accent-light);
    box-shadow: 0 6px 20px rgba(201,168,106,0.4);
    transform: translateY(-1px);
  }
  .submit-btn:disabled { opacity: 0.5; cursor: not-allowed; transform: none; }

  /* ── Mobile ── */
  @media (max-width: 768px) {
    .login-page { flex-direction: column; }

    .login-left {
      width: 100%;
      padding: 40px 24px;
      gap: 24px;
      border-right: none;
      border-bottom: 1px solid var(--border);
    }
    .brand-name { font-size: 36px; }
    .brand-hex  { font-size: 36px; margin-bottom: 8px; }
    .brand-quote { display: none; }
    .decorative-lines { display: none; }

    .login-right { padding: 32px 20px; align-items: flex-start; }
    .login-box { max-width: 100%; }
    .login-header h2 { font-size: 28px; }
    .login-header { margin-bottom: 24px; }
  }

  @media (max-width: 480px) {
    .login-left { padding: 28px 20px; }
    .brand-name { font-size: 30px; letter-spacing: 0.1em; }
    .login-right { padding: 24px 16px; }
  }
`],
})
export class LoginComponent {
  loginForm: FormGroup;
  isLoading = false;
  hidePassword = true;
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
  ) {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  onSubmit(): void {
    if (this.loginForm.invalid) return;
    this.isLoading = true;
    this.errorMessage = '';
    const { username, password } = this.loginForm.value;
    this.authService.login(username, password).subscribe({
      next: () => this.router.navigate(['/dashboard']),
      error: () => {
        this.isLoading = false;
        this.errorMessage = 'Invalid username or password. Please try again.';
      },
    });
  }
}
