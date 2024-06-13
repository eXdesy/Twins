import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { EndpointsService } from '../services/endpoints.service';
import { SwitchService } from '../services/switch.service';

@Component({
  selector: 'app-home-settings-networks',
  templateUrl: './networks.component.html',
  styleUrl: './networks.component.css'
})
export class NetworksComponent {
  constructor(private switchService: SwitchService, private endpointsService: EndpointsService, private router: Router) { }

  token: string = '';
  networks: any = {
    instagram: '',
    snapchat: '',
    twitter: '',
    vk: '',
    discord: '',
    tiktok: '',
    twitch: '',
    bereal: ''
  };
  showCheck: boolean = true;

  ngOnInit(): void {
    this.token = localStorage.getItem('token') || '';
    this.onGetNetwork()
    this.switchService.$modal.subscribe(value => {
      this.showCheck = value;
    });
  }

	navigateTo(path: string): void {
    this.router.navigate([path]);
  }

  onUpdateNetwork(instagram: string, snapchat: string, twitter: string, vk: string, discord: string, tiktok: string, twitch: string, bereal: string) {
    this.endpointsService.updateNetwork(instagram, snapchat, twitter, vk, discord, tiktok, twitch, bereal, this.token).subscribe(
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
  onGetNetwork() {
    this.endpointsService.getNetwork(this.token).subscribe(
      response => {
        this.networks = response;
      },
      error => {
        if (error.status === 500) {
          console.log('Error interno del servidor: ' + error.message);
					this.switchService.openCheckModal('serverError', error.error.message, true);
        } else if (error.status === 401) {
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
