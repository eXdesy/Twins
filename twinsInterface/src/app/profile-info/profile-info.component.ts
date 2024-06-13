import { Component, OnInit } from '@angular/core';
import { EndpointsService } from '../services/endpoints.service';
import { SwitchService } from '../services/switch.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-profile-info',
  templateUrl: './profile-info.component.html',
  styleUrl: './profile-info.component.css'
})
export class ProfileInfoComponent implements OnInit {
  constructor(private switchService: SwitchService, private endpointsService: EndpointsService, private router: Router) { }
  token: string = '';
  profile: any = {
    profile_id: '',
    user_id: '',
    first_name: '',
    last_name: '',
    orientation: '',
    country: '',
    country_iso: '',
    city: '',
    city_iso: '',
    date_of_birth: '',
    description: '',
    foto: '',
    username: ''
  };
  networks: any = {
    profile_id: '',
    instagram: '',
    snapchat: '',
    twitter: '',
    vk: '',
    discord: '',
    tiktok: '',
    twitch: '',
    bereal: ''
  };
	profile_id: number = 0;
	message: string | undefined;

  ngOnInit(): void {
		this.token = localStorage.getItem('token') || '';
	  // Escuchar los cambios del mensaje del SwitchService
		this.switchService.$modalFilter.subscribe(message => {
			this.message = message;
			console.log('type',this.message);
		});
    this.switchService.$modalProfile.subscribe(profile_id => {
			this.profile_id = profile_id;
			console.log('id',this.profile_id);
			this.onGetProfiles();
			this.onGetNetworks();
    });
  }

  closeProfileInfo() {
    this.switchService.closeProfileInfo();
		window.location.reload();
	}

  onChatUser() {
    window.location.href = this.profile.username;
  }

	onGetProfiles(): void {
    this.endpointsService.getProfiles(this.profile_id, this.token).subscribe(
      response => {
        console.log(response);
        this.profile = response;
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
  onUnmatchUser() {
    this.endpointsService.unmatchUser(this.profile.profile_id, this.token).subscribe(
      response => {
        this.closeProfileInfo();
				window.location.reload();
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

  onGetNetworks() {
    this.endpointsService.getNetworks(this.profile_id, this.token).subscribe(
      response => {
        console.log(response);
        this.networks = response;
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

  getNetworkUrl(network: string): string {
    switch (network) {
      case 'instagram':
        return this.networks.instagram;
      case 'snapchat':
        return this.networks.snapchat;
      case 'twitter':
        return this.networks.twitter;
      case 'vk':
        return this.networks.vk;
      case 'discord':
        return this.networks.discord;
      case 'tiktok':
        return this.networks.tiktok;
      case 'twitch':
        return this.networks.twitch;
      case 'bereal':
        return this.networks.bereal;
      default:
        return '#';
    }
  }

  hasNetwork(network: string): boolean {
    return this.networks[network] && this.networks[network].trim() !== '';
  }
}
