import { Component, OnInit  } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { SwitchService } from '../services/switch.service';
import { Router } from '@angular/router';

declare var window: any;

@Component({  
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrl: './auth.component.css'
})
export class AuthComponent implements OnInit  {
  constructor(private switchService: SwitchService, private authService: AuthService, private router: Router) { }
  user_id: number = 0;
  role: string = 'user';
  showCheck: boolean = true;

  ngOnInit(): void {
    window.addEventListener('load', () => {
      if (window.Telegram && window.Telegram.WebApp) {
        window.registerBtn.addEventListener('click', () => {
          const user = window.Telegram.WebApp.initDataUnsafe.user;
          const firstNameInput = document.getElementById('firstname_register') as HTMLInputElement;
          const lastNameInput = document.getElementById('lastname_register') as HTMLInputElement;
          const usernameInput = document.getElementById('username_register') as HTMLInputElement;
          if (firstNameInput) {
            firstNameInput.value = user.first_name || '';
          }
          if (lastNameInput) {
            lastNameInput.value = user.last_name || '';
          }
          if (usernameInput) {
            usernameInput.value = user.username || '';
          }
          this.setUserId(user.id);
        });
      } else {
        console.error('Telegram WebApp is not available');
			}
    });
		
		this.switchService.$modal.subscribe(value => {
      this.showCheck = value;
    });
	}

  setUserId(userId: number): void {
    this.user_id = userId;
  }

  onLogin(username_register: string, password_register: string) {
    this.authService.login(username_register, password_register).subscribe(
      response => {
        localStorage.setItem('token', response.token);
        this.router.navigate(['/home/main']);
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
      }
    );
  }
  
  onRegister(firstname_register: string, lastname_register: string, username_register: string, password_register: string, gender_register: HTMLInputElement) {
    const gender = gender_register.checked ? 'Male' : 'Female';
    this.authService.register(this.role, firstname_register, lastname_register, username_register, password_register, gender).subscribe(
      response => {
				console.log(response);
				this.switchService.openCheckModal('register', response.message, true);
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

  containerActive = false;
  activeForm: 'login' | 'register' = 'login';
  togglePanel(active: boolean) {
    this.containerActive = active;
    this.activeForm = active ? 'register' : 'login';
  }
}