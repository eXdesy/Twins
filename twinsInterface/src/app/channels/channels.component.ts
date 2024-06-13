import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { EndpointsService } from '../services/endpoints.service';
import { SwitchService } from '../services/switch.service';

@Component({
  selector: 'app-home-settings-channels',
  templateUrl: './channels.component.html',
  styleUrl: './channels.component.css'
})
export class ChannelsComponent {
  constructor(private switchService: SwitchService, private endpointsService: EndpointsService, private router: Router) { }
  token: string = '';
  showCheck: boolean = true;

  ngOnInit(): void {
    this.token = localStorage.getItem('token') || '';
    this.onGetChannel();
		this.switchService.$modal.subscribe(value => {
      this.showCheck = value;
    });
  }
  
	navigateTo(path: string): void {
    this.router.navigate([path]);
  }
  
  onGetChannel() {
    this.endpointsService.getChannel(this.token).subscribe(
      response => {
        if (response.channels && response.channels.length > 0) {
          this.renderChannelData(response.channels);
        }
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
	private renderChannelData(channelsData: any) {
		interface ChannelData {
			channel_id: number;
			user_id: number;
			foto: string;
			name: string;
			category: string;
			description: string;
			country: string;
			country_iso: string;
			price: number;
			link: string;
		}
	
		const container = document.querySelector('.container');
		if (!container) return;
	
		container.innerHTML = '';
		const cards = document.createElement('div');
		cards.classList.add('channel-cards');
	
		channelsData.forEach((channel: ChannelData) => {
			const card = document.createElement('div');
			card.classList.add('channel-card');
	
			const cardImageWrapper = document.createElement('div');
			cardImageWrapper.classList.add('channel-card-image-wrapper');
			const avatarImage = document.createElement('img');
			avatarImage.src = channel.foto || '';
			cardImageWrapper.appendChild(avatarImage);
	
			const cardOverlay = document.createElement('div');
			cardOverlay.classList.add('channel-card-overlay');
			cardImageWrapper.appendChild(cardOverlay);
	
			const cardContent = document.createElement('div');
			cardContent.classList.add('channel-card-content');
			
			const cardTitle = document.createElement('h2');
			cardTitle.classList.add('channel-card-title');
			cardTitle.textContent = `${channel.name}`;
			cardContent.appendChild(cardTitle);
	
			const cardDescription = document.createElement('p');
			cardDescription.classList.add('channel-card-description');
			cardDescription.textContent = channel.description || 'No description available.';
			cardContent.appendChild(cardDescription);
	
			cardImageWrapper.appendChild(cardContent);
			card.appendChild(cardImageWrapper);
	
			const cardActions = document.createElement('div');
			cardActions.classList.add('channel-card-actions');
	
			const deleteButton = document.createElement('button');
			deleteButton.classList.add('channel-delete-button');
			deleteButton.innerHTML = '<i class="fas fa-trash"></i>';
			deleteButton.onclick = () => {
        this.onDeleteChannel(channel.channel_id)
			};
			cardActions.appendChild(deleteButton);

			const updateButton = document.createElement('button');
      updateButton.classList.add('channel-update-button');
			updateButton.innerHTML = '<i class="fas fa-edit"></i>';
      updateButton.onclick = function() {
        window.location.href = '/updateChannel?channel_id=' + encodeURIComponent(channel.channel_id) +
//                                '&foto=' + encodeURIComponent(channel.foto) +
                                '&name=' + encodeURIComponent(channel.name) +
                                '&category=' + encodeURIComponent(channel.category) +
                                '&description=' + encodeURIComponent(channel.description) +
                                '&country=' + encodeURIComponent(channel.country) +
                                '&country_iso=' + encodeURIComponent(channel.country_iso) +
                                '&price=' + encodeURIComponent(channel.price) +
                                '&link=' + encodeURIComponent(channel.link);
      };
			cardActions.appendChild(updateButton);
		
			card.appendChild(cardActions);
			cards.appendChild(card);
		});
		container.appendChild(cards);
	}
  onDeleteChannel(channel_id: number) {
    this.endpointsService.deleteChannel(channel_id, this.token).subscribe(
      response => {
				this.switchService.openCheckModal('channelUpdate', response.message, true);
				this.onGetChannel();
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
