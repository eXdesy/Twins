import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { EndpointsService } from '../../services/endpoints.service';
import { SwitchService } from '../../services/switch.service';
import * as Hammer from 'hammerjs';

@Component({
  selector: 'app-home-main',
  templateUrl: './main.component.html',
  styleUrl: './main.component.css'
})
export class MainComponent {
  constructor(private endpointsService: EndpointsService, private router: Router, private switchService: SwitchService) { }

  token: string = '';
	selectedFilter: string = '';

  ngOnInit(): void {
    this.token = localStorage.getItem('token') || '';
		this.onGetRandomUsers()
		// Suscribirse a los datos del grupo emitidos por SwitchService
		this.switchService.$groupData.subscribe(groupsData => {
			this.renderGroupData(groupsData);
		});
		// Suscribirse a los datos del canal emitidos por SwitchService
		this.switchService.$channelData.subscribe(channelData => {
			this.renderChannelData(channelData);
		});
	}

	navigateTo(path: string): void {
    this.router.navigate([path]);
  }

  openFilter() {
		if (this.selectedFilter === 'profile') {
			this.switchService.openCheckModal('soon', 'Filters for users will be soon aviable!', true);
    } else if (this.selectedFilter === 'groups') {
      this.switchService.openFilterModal('filterGroups', true);
    } else if (this.selectedFilter === 'channels') {
      this.switchService.openFilterModal('filterChannels', true);
    }
  }

  onGetRandomUsers() {
		this.selectedFilter = 'profile'
		this.endpointsService.getRandomUsers(this.token).subscribe(
      response => {
        if (response.message) {
          this.complete(response.message)
        } else if (response.users) {
          this.renderUserData([response.users]);
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
	private renderUserData(usersData: any) {
		interface UserData {
			profile_id: number;
			user_id: number;
			first_name: string;
			last_name: string;
			orientation: string | null;
			country: string | null;
			country_iso: string | null;
			city: string | null;
			city_iso: string | null;
			date_of_birth: string | null;
			description: string | null;
			foto: string | null;
		}

		const container = document.querySelector('.container');
		if (!container) return;
	
		container.innerHTML = '';
	
		usersData.forEach((user: UserData) => {
			const card = document.createElement('div');
			card.classList.add('card');
	
			const cardAvatar = document.createElement('div');
			cardAvatar.classList.add('card_avatar');
			const avatarImage = document.createElement('img');
			avatarImage.src = user.foto || '';
			cardAvatar.appendChild(avatarImage);
	
			const cardCity = document.createElement('div');
			cardCity.classList.add('card_city');
			cardCity.textContent = user.city || '';
			cardAvatar.appendChild(cardCity);
	
			const cardOverlay = document.createElement('div');
			cardOverlay.classList.add('card_overlay');
	
			const cardHeader = document.createElement('div');
			cardHeader.classList.add('card_header');
	
			const cardTitle = document.createElement('h1');
			cardTitle.classList.add('card_title');
			cardTitle.textContent = `${user.first_name} ${user.last_name}, ${user.date_of_birth}`;
			cardHeader.appendChild(cardTitle);
	
			cardOverlay.appendChild(cardHeader);
	
			const cardDescription = document.createElement('span');
			cardDescription.classList.add('card_description');
			cardDescription.textContent = user.description || 'No description available.';
			cardOverlay.appendChild(cardDescription);
	
			cardAvatar.appendChild(cardOverlay);
			card.appendChild(cardAvatar);
	
			const cardButtons = document.createElement('div');
			cardButtons.classList.add('card_buttons');
	
			const skipButton = document.createElement('button');
			skipButton.classList.add('card_skip');
			skipButton.innerHTML = '<i class="fas fa-times"></i>';
			skipButton.onclick = () => {
				this.onGetRandomUsers();
			};
			cardButtons.appendChild(skipButton);
	
			const likeButton = document.createElement('button');
			likeButton.classList.add('card_like');
			likeButton.innerHTML = '<i class="fas fa-heart"></i>';
			likeButton.onclick = () => {
				this.onLikeUser(user.profile_id, 'True');
			};
			cardButtons.appendChild(likeButton);
	
			const reportButton = document.createElement('button');
			reportButton.classList.add('card_report');
			reportButton.innerHTML = '<i class="fas fa-exclamation-triangle"></i>';
			reportButton.onclick = () => {
				this.switchService.openReport('report', 'user', user.profile_id, true);
			};
			cardButtons.appendChild(reportButton);
	
			card.appendChild(cardButtons);
			container.appendChild(card);
		});
	}
  onLikeUser(liked_profile_id: number, status: string) {
    this.endpointsService.likeUser(liked_profile_id, status, this.token).subscribe(
      response => {
				this.switchService.openCheckModal('likeUser', response.message, true);
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

  onGetAllGroups() {
		this.selectedFilter = 'groups'
		this.endpointsService.getAllGroups(this.token).subscribe(
      response => {
        if (response.groups && response.groups.length > 0) {
          this.renderGroupData(response.groups);
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
    const container = document.querySelector('.container');
    if (!container) return;

    container.innerHTML = '';

    const dataContainer = document.createElement('div');
    dataContainer.classList.add('search-container');

    let currentIndex = 0;

    const renderCard = (index: number) => {
        dataContainer.innerHTML = '';

        const group = groupsData[index];
        const card = document.createElement('div');
        card.classList.add('search-card');

        const avatarContainer = document.createElement('div');
        avatarContainer.classList.add('avatar-container');
        const avatarImage = document.createElement('img');
        avatarImage.src = group.foto || '';
        avatarContainer.appendChild(avatarImage);

        const categoryBadge = document.createElement('div');
        categoryBadge.classList.add('category-badge');
        categoryBadge.textContent = group.category || '';
        avatarContainer.appendChild(categoryBadge);

        const overlay = document.createElement('div');
        overlay.classList.add('overlay');

        const header = document.createElement('div');
        header.classList.add('header');

        const title = document.createElement('h1');
        title.classList.add('title');
        title.textContent = `${group.name}`;
        header.appendChild(title);

        overlay.appendChild(header);

        const description = document.createElement('span');
        description.classList.add('description');
        description.textContent = group.description || 'No description available.';
        overlay.appendChild(description);

        avatarContainer.appendChild(overlay);
        card.appendChild(avatarContainer);

        const buttonsContainer = document.createElement('div');
        buttonsContainer.classList.add('buttons-container');

        const skipButton = document.createElement('button');
        skipButton.classList.add('skip-button');
        skipButton.innerHTML = '<i class="fas fa-times"></i>';
        skipButton.onclick = () => {
            currentIndex++;
            if (currentIndex >= groupsData.length) {
                currentIndex = 0;
            }
            setTimeout(() => renderCard(currentIndex), 300);
        };
        buttonsContainer.appendChild(skipButton);

        const joinButton = document.createElement('button');
        joinButton.classList.add('join-button');
        joinButton.innerHTML = '<i class="fas fa-plus"></i>';
        joinButton.onclick = () => {
            this.onJoinGroup(group.group_id, group.link, 'True');
        };
        buttonsContainer.appendChild(joinButton);

        const reportButton = document.createElement('button');
        reportButton.classList.add('report-button');
        reportButton.innerHTML = '<i class="fas fa-exclamation-triangle"></i>';
        reportButton.onclick = () => {
					this.switchService.openReport('report', 'group', group.group_id, true);
        };
        buttonsContainer.appendChild(reportButton);

        card.appendChild(buttonsContainer);
        dataContainer.appendChild(card);

        container.appendChild(dataContainer);

        // Add swipe functionality
        const hammer = new Hammer.Manager(avatarContainer);
        hammer.add(new Hammer.Pan({ direction: Hammer.DIRECTION_HORIZONTAL, threshold: 10 }));
        hammer.on('pan', (event) => handlePan(event, avatarContainer));
        hammer.on('panend', (event) => handlePanEnd(event, avatarContainer));
    };

    const handlePan = (event: HammerInput, avatarContainer: HTMLElement) => {
        avatarContainer.style.transition = 'none';
        avatarContainer.style.transform = `translateX(${event.deltaX}px) rotate(${event.deltaX / 180}deg)`;
    };

    const handlePanEnd = (event: HammerInput, avatarContainer: HTMLElement) => {
        avatarContainer.style.transition = 'all 0.3s ease-out';
        if (event.deltaX > 100) {
            avatarContainer.style.transform = `translateX(100%)`;
            currentIndex++;
            if (currentIndex >= groupsData.length) {
                currentIndex = 0; // Rewind to first card if at the end
            }
            setTimeout(() => renderCard(currentIndex), 300);
        } else if (event.deltaX < -100) {
            avatarContainer.style.transform = `translateX(-100%)`;
            currentIndex--;
            if (currentIndex < 0) {
                currentIndex = groupsData.length - 1; // Go to last card if at the beginning
            }
            setTimeout(() => renderCard(currentIndex), 300);
        } else {
            avatarContainer.style.transform = `translateX(0px) rotate(0deg)`;
        }
    };

    renderCard(currentIndex);
	}
  onJoinGroup(group_id: number, link: string, status: string) {
    this.endpointsService.joinGroup(group_id, status, this.token).subscribe(
      response => {
        window.location.href = link
        this.onGetAllGroups();
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

  onGetAllChannels() {
		this.selectedFilter = 'channels'
		this.endpointsService.getAllChannels(this.token).subscribe(
      response => {
        if (response.channels && response.channels.length > 0) {
          this.renderChannelData(response.channels);
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
    const container = document.querySelector('.container');
    if (!container) return;

    container.innerHTML = '';

    const dataContainer = document.createElement('div');
    dataContainer.classList.add('search-container');

    let currentIndex = 0;

    const renderCard = (index: number) => {
        dataContainer.innerHTML = '';

        const channel = channelsData[index];
        const card = document.createElement('div');
        card.classList.add('search-card');

        const avatarContainer = document.createElement('div');
        avatarContainer.classList.add('avatar-container');
        const avatarImage = document.createElement('img');
        avatarImage.src = channel.foto || '';
        avatarContainer.appendChild(avatarImage);

        const categoryBadge = document.createElement('div');
        categoryBadge.classList.add('category-badge');
        categoryBadge.textContent = channel.category || '';
        avatarContainer.appendChild(categoryBadge);

        const overlay = document.createElement('div');
        overlay.classList.add('overlay');

        const header = document.createElement('div');
        header.classList.add('header');

        const title = document.createElement('h1');
        title.classList.add('title');
        title.textContent = `${channel.name}`;
        header.appendChild(title);

        overlay.appendChild(header);

        const description = document.createElement('span');
        description.classList.add('description');
        description.textContent = channel.description || 'No description available.';
        overlay.appendChild(description);

        avatarContainer.appendChild(overlay);
        card.appendChild(avatarContainer);

        const buttonsContainer = document.createElement('div');
        buttonsContainer.classList.add('buttons-container');

				const skipButton = document.createElement('button');
				skipButton.classList.add('skip-button');
				skipButton.innerHTML = '<i class="fas fa-times"></i>';
				skipButton.onclick = () => {
					currentIndex++;
					if (currentIndex >= channelsData.length) {
							currentIndex = 0;
					}
					setTimeout(() => renderCard(currentIndex), 300);
				};
				buttonsContainer.appendChild(skipButton);

        const joinButton = document.createElement('button');
        joinButton.classList.add('join-button');
        joinButton.innerHTML = '<i class="fas fa-plus"></i>';
        joinButton.onclick = () => {
            this.onJoinChannel(channel.channel_id, channel.link, 'True');
        };
        buttonsContainer.appendChild(joinButton);

        const reportButton = document.createElement('button');
        reportButton.classList.add('report-button');
        reportButton.innerHTML = '<i class="fas fa-exclamation-triangle"></i>';
        reportButton.onclick = () => {
					this.switchService.openReport('report', 'channel', channel.channel_id, true);
        };
        buttonsContainer.appendChild(reportButton);

        card.appendChild(buttonsContainer);
        dataContainer.appendChild(card);

        container.appendChild(dataContainer);

        // Add swipe functionality
        const hammer = new Hammer.Manager(avatarContainer);
        hammer.add(new Hammer.Pan({ direction: Hammer.DIRECTION_HORIZONTAL, threshold: 10 }));
        hammer.on('pan', (event) => handlePan(event, avatarContainer));
        hammer.on('panend', (event) => handlePanEnd(event, avatarContainer));
    };

    const handlePan = (event: HammerInput, avatarContainer: HTMLElement) => {
        avatarContainer.style.transition = 'none';
        avatarContainer.style.transform = `translate(${event.deltaX}px) rotate(${event.deltaX / 180}deg)`;
    };

    const handlePanEnd = (event: HammerInput, avatarContainer: HTMLElement) => {
        avatarContainer.style.transition = 'all 0.3s ease-out';
        if (event.deltaX > 100) {
            avatarContainer.style.transform = `translateX(100%)`;
            currentIndex++;
            if (currentIndex >= channelsData.length) {
                currentIndex = 0; // Rewind to first card if at the end
            }
            setTimeout(() => renderCard(currentIndex), 300);
        } else if (event.deltaX < -100) {
            avatarContainer.style.transform = `translateX(-100%)`;
            currentIndex--;
            if (currentIndex < 0) {
                currentIndex = channelsData.length - 1; // Go to last card if at the beginning
            }
            setTimeout(() => renderCard(currentIndex), 300);
        } else {
            avatarContainer.style.transform = `translate(0px) rotate(0deg)`;
        }
    };

    renderCard(currentIndex);
	}
  onJoinChannel(channel_id: number, link: string, status: string) {
    this.endpointsService.joinChannel(channel_id, status, this.token).subscribe(
      response => {
        window.location.href = link
        this.onGetAllChannels();
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
  complete(text: string) {
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

    const cardButtons = document.createElement('div');
    cardButtons.classList.add('card-complete');
    
    const message = document.createElement('h1');
    message.textContent = text;
    
    const updateButton = document.createElement('button');
    updateButton.classList.add('icon-box-complete');
    updateButton.textContent = 'COMPLETE PROFILE';
    updateButton.onclick = function() {
      window.location.href = '/profile'
    };

    cardButtons.appendChild(message);
    cardButtons.appendChild(updateButton);

    dataContainer.appendChild(loaders);
    dataContainer.appendChild(cardButtons);
  }
}
