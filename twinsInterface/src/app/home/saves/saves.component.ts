import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { EndpointsService } from '../../services/endpoints.service';
import { SwitchService } from '../../services/switch.service';

@Component({
  selector: 'app-home-saves',
  templateUrl: './saves.component.html',
  styleUrl: './saves.component.css'
})
export class SavesComponent {
  constructor(private switchService: SwitchService, private endpointsService: EndpointsService, private router: Router) { }

  token: string = '';

  ngOnInit(): void {
    this.token = localStorage.getItem('token') || '';
    this.onGetMatchedUsers()
  }

	navigateTo(path: string): void {
    this.router.navigate([path]);
  }
  
  onGetMatchedUsers() {
    this.endpointsService.getMatchedUsers(this.token).subscribe(
      response => {
        if (response.message) {
          this.clear(response.message)
        } else if (response.matched_users && response.matched_users.length > 0) {
          this.renderUserData(response.matched_users);
        } else {
          this.clear("It's still deserted here...")
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
	private renderUserData(matchedUsersData: any) {
		interface UserData {
			profile_id: number;
			user_id: number;
			first_name: string;
			last_name: string;
			orientation: string;
			country: string | null;
			country_iso: string | null;
			city: string | null;
			city_iso: string | null;
			date_of_birth: string;
			description: string | null;
			foto: string;
			username: string;
		}
	
		const container = document.querySelector('.container');
		if (!container) return;
	
		container.innerHTML = '';
		const cards = document.createElement('div');
		cards.classList.add('match-cards');
	
		matchedUsersData.forEach((user: UserData) => {
			const card = document.createElement('div');
			card.classList.add('match-card');

			const cardImageWrapper = document.createElement('div');
			cardImageWrapper.classList.add('match-card-image-wrapper');
			const avatarImage = document.createElement('img');
			avatarImage.src = user.foto || '';
			cardImageWrapper.appendChild(avatarImage);
			cardImageWrapper.onclick = () => {
				this.switchService.openProfileInfo('user' ,user.profile_id, true);
			};
	
			const cardOverlay = document.createElement('div');
			cardOverlay.classList.add('match-card-overlay');
			cardImageWrapper.appendChild(cardOverlay);
	
			const cardContent = document.createElement('div');
			cardContent.classList.add('match-card-content');
			
			const cardTitle = document.createElement('h2');
			cardTitle.classList.add('match-card-title');
			cardTitle.textContent = `${user.first_name}, ${user.date_of_birth}`;
			cardContent.appendChild(cardTitle);
	
			const cardCity = document.createElement('p');
			cardCity.classList.add('match-card-city');
			cardCity.textContent = user.city || '';
			cardContent.appendChild(cardCity);
	
			cardImageWrapper.appendChild(cardContent);
			card.appendChild(cardImageWrapper);
	
			const cardActions = document.createElement('div');
			cardActions.classList.add('match-card-actions');
	
			const dislikeButton = document.createElement('button');
			dislikeButton.classList.add('match-dislike-button');
			dislikeButton.innerHTML = '<i class="fas fa-trash"></i>';
			dislikeButton.onclick = () => {
				this.onUnmatchUser(user.profile_id);
			};
			cardActions.appendChild(dislikeButton);
	
			const likeButton = document.createElement('button');
			likeButton.classList.add('match-chat-button');
			likeButton.innerHTML = '<i class="fas fa-paper-plane"></i>';
			likeButton.onclick = () => {
				window.location.href = user.username;
			};
			cardActions.appendChild(likeButton);
	
			card.appendChild(cardActions);
			cards.appendChild(card);
		});
		container.appendChild(cards);
	}
  onUnmatchUser(match_profile_id: number) {
    this.endpointsService.unmatchUser(match_profile_id, this.token).subscribe(
      response => {
        this.router.navigate(['home/saves']);
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

  onGetJoinedGroups() {
    this.endpointsService.getJoinedGroups(this.token).subscribe(
      response => {
        if (response.message) {
          this.clear(response.message)
        } else if (response.joined_groups && response.joined_groups.length > 0) {
          this.renderGroupData(response.joined_groups);
        } else {
          this.clear("It's still deserted here...")
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
	private renderGroupData(groupsData: any) {
		interface GroupData {
			group_id: number;
			user_id: number;
			foto: string;
			name: string;
			category: string;
			description: string;
			country: string;
			price: number;
			link: string;
		}
	
		const container = document.querySelector('.container');
		if (!container) return;
	
		container.innerHTML = '';
		const cards = document.createElement('div');
		cards.classList.add('group-cards');
	
		groupsData.forEach((group: GroupData) => {
			const card = document.createElement('div');
			card.classList.add('group-card');
	
			const cardImageWrapper = document.createElement('div');
			cardImageWrapper.classList.add('group-card-image-wrapper');
			const avatarImage = document.createElement('img');
			avatarImage.src = group.foto || '';
			cardImageWrapper.appendChild(avatarImage);
	
			const cardOverlay = document.createElement('div');
			cardOverlay.classList.add('group-card-overlay');
			cardImageWrapper.appendChild(cardOverlay);
	
			const cardContent = document.createElement('div');
			cardContent.classList.add('group-card-content');
			
			const cardTitle = document.createElement('h2');
			cardTitle.classList.add('group-card-title');
			cardTitle.textContent = `${group.name}`;
			cardContent.appendChild(cardTitle);
	
			const cardDescription = document.createElement('p');
			cardDescription.classList.add('group-card-description');
			cardDescription.textContent = group.description || 'No description available.';
			cardContent.appendChild(cardDescription);
	
			cardImageWrapper.appendChild(cardContent);
			card.appendChild(cardImageWrapper);
	
			const cardActions = document.createElement('div');
			cardActions.classList.add('group-card-actions');
	
			const deleteButton = document.createElement('button');
			deleteButton.classList.add('group-delete-button');
			deleteButton.innerHTML = '<i class="fas fa-trash"></i>';
			deleteButton.onclick = () => {
				this.onDeleteJoinedGroup(group.group_id);
			};
			cardActions.appendChild(deleteButton);

			const joinButton = document.createElement('button');
			joinButton.classList.add('group-join-button');
			joinButton.innerHTML = '<i class="fas fa-comment"></i>';
			joinButton.onclick = () => {
				window.location.href = group.link;
			};
			cardActions.appendChild(joinButton);
	
			card.appendChild(cardActions);
			cards.appendChild(card);
		});
		container.appendChild(cards);
	}
  onDeleteJoinedGroup(group_id: number) {
    this.endpointsService.deleteJoinedGroup(group_id, this.token).subscribe(
      response => {
        this.router.navigate(['home/saves']);
        this.onGetJoinedGroups();
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

  onGetJoinedChannel() {
    this.endpointsService.getJoinedChannel(this.token).subscribe(
      response => {
        if (response.message) {
          this.clear(response.message)
        } else if (response.joined_channels && response.joined_channels.length > 0) {
          this.renderChannelData(response.joined_channels);
        } else {
          this.clear("It's still deserted here...")
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
				this.onDeleteJoinedChannel(channel.channel_id);
			};
			cardActions.appendChild(deleteButton);

			const joinButton = document.createElement('button');
			joinButton.classList.add('channel-join-button');
			joinButton.innerHTML = '<i class="fas fa-comment"></i>';
			joinButton.onclick = () => {
				window.location.href = channel.link;
			};
			cardActions.appendChild(joinButton);
		
			card.appendChild(cardActions);
			cards.appendChild(card);
		});
		container.appendChild(cards);
	}
  onDeleteJoinedChannel(channel_id: number) {
    this.endpointsService.deleteJoinedChannel(channel_id, this.token).subscribe(
      response => {
        this.router.navigate(['home/saves']);
        this.onGetJoinedChannel();
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

  clear(text: string) {
    const dataContainer = document.querySelector('.container');
    if (!dataContainer) return;

    dataContainer.innerHTML = '';

    const loaders = document.createElement('div');
    loaders.classList.add('loaders');
    const loader = document.createElement('div');
    loader.classList.add('loader');
    const loaderDiv = document.createElement('div');

    loader.appendChild(loaderDiv);
    loaders.appendChild(loader);
    
    const message = document.createElement('h1');
    message.textContent = text;
    
    dataContainer.appendChild(loaders);
    dataContainer.appendChild(message);
  }
}
