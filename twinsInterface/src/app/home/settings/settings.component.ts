import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { SwitchService } from '../../services/switch.service';
  
@Component({
  selector: 'app-home-settings',
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.css'
})
export class SettingsComponent {
  constructor(private switchService: SwitchService, private authService: AuthService, private router: Router) { }

  token: string = '';

  ngOnInit(): void {
    this.token = localStorage.getItem('token') || '';
  }

	navigateTo(path: string): void {
    this.router.navigate([path]);
  }

  onLogout() {
    this.authService.logout(this.token).subscribe(
      response => {
        this.router.navigate(['/login']);
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
