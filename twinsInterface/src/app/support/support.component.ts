import { Component, ElementRef, ViewChild } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { SwitchService } from '../services/switch.service';
import { Location } from '@angular/common';

@Component({  
  selector: 'app-support',
  templateUrl: './support.component.html',
  styleUrl: './support.component.css'
})
export class SupportComponent {
  constructor(
    private switchService: SwitchService, 
    private authService: AuthService, 
    private location: Location
  ) { }
	@ViewChild('description', { static: true }) description: ElementRef | null = null;

  charCount: number = 0;
  maxCharCount: number = 250;
  support: any = {
    first_name: '',
    last_name: '',
    description: '',
    username: ''
  };
  user_id: number = 1;
  showCheck: boolean = true;

  setUserId(userId: number): void {
    this.user_id = userId;
  }

  ngOnInit(): void {
    this.charCount = this.support.description.length;
		this.switchService.$modal.subscribe(value => {
      this.showCheck = value;
    });
	}

  updateCharCount(): void {
    if (this.description && this.description.nativeElement) {
      const desc = this.description.nativeElement.value;
      if (desc.length > this.maxCharCount) {
        this.description.nativeElement.value = desc.substring(0, this.maxCharCount);
      }
      this.charCount = this.description.nativeElement.value.length;
    }
  }

  goBack() {
    this.location.back();
  }

  onSupport(username: string, first_name: string, last_name: string, description: string) {
    this.authService.support(this.user_id, username, first_name, last_name, description).subscribe(
      response => {
				this.switchService.openCheckModal('support', response.message, true);
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
}