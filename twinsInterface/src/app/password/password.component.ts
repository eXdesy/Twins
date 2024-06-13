import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { SwitchService } from '../services/switch.service';

@Component({
  selector: 'app-home-settings-password',
  templateUrl: './password.component.html',
  styleUrl: './password.component.css'
})
export class PasswordComponent {
  constructor(private switchService: SwitchService, private authService: AuthService, private router: Router) { }

  token: string = '';
  showCheck: boolean = true;

  ngOnInit(): void {
    this.token = localStorage.getItem('token') || '';
    this.switchService.$modal.subscribe(value => {
      this.showCheck = value;
    });
  }

	navigateTo(path: string): void {
    this.router.navigate([path]);
  }

  onUpdatePassword(old_password: string, new_password: string) {
    this.authService.password(old_password, new_password, this.token).subscribe(
      response => {
				this.switchService.openCheckModal('update', response.message, true);
			},
      error => {
        if (error.status === 500) {
          console.log('Error interno del servidor: ' + error.message);
					this.switchService.openCheckModal('serverError', error.error.message, true);
        } else if (error.status === 400) {
          console.log('Error interno del cliente: ' + error.message);
					this.switchService.openCheckModal('error', error.error.message, true);
        } else {
          console.log('Error inesperado: ' + error.message);
					this.switchService.openCheckModal('error', error.error.message, true);
        }
      },
    );
  }

}
