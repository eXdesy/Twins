import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { EndpointsService } from '../../services/endpoints.service';
import { SwitchService } from '../../services/switch.service';

@Component({
  selector: 'app-home-notification',
  templateUrl: './notification.component.html',
  styleUrl: './notification.component.css'
})
export class NotificationComponent {
  constructor(private switchService: SwitchService, private endpointsService: EndpointsService, private router: Router) { }

  token: string = '';

  ngOnInit(): void {
    this.token = localStorage.getItem('token') || '';
    this.onGetLikedUsers();
  }
  
	navigateTo(path: string): void {
    this.router.navigate([path]);
  }

  onGetLikedUsers() {
    this.endpointsService.getLikedUsers(this.token).subscribe(
      response => {
        if (response.liked_users && response.liked_users.length > 0) {
          this.renderUserData(response.liked_users);
        } else {
          this.goLike()
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
				this.onUnlikeUser(user.profile_id)
			};
			cardButtons.appendChild(skipButton);
	
			const likeButton = document.createElement('button');
			likeButton.classList.add('card_like');
			likeButton.innerHTML = '<i class="fas fa-heart"></i>';
			likeButton.onclick = () => {
				this.onMatchUser(user.profile_id, 'True')
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
  onMatchUser(match_profile_id: number, status: string) {
    this.endpointsService.matchUser(match_profile_id, status, this.token).subscribe(
      response => {
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
  
  onUnlikeUser(liked_profile_id: number) {
    this.endpointsService.unlikeUser(liked_profile_id, this.token).subscribe(
      response => {
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

	goLike() {
		const container = document.querySelector('.container');
		if (!container) return;
	
		container.innerHTML = '';
		
		const completeCard = document.createElement('div');
		completeCard.classList.add('complete-card');
	
		const buttonsContainer = document.createElement('div');
		buttonsContainer.classList.add('buttons-container');
	
		const avatarWrapper = document.createElement('div');
		avatarWrapper.classList.add('avatar-wrapper');
		const avatarImage = document.createElement('img');
		avatarImage.src = '../../assets/img/sadCat.jpeg';
		avatarWrapper.appendChild(avatarImage);
	
		const updateProfileButton = document.createElement('button');
		updateProfileButton.classList.add('update-profile-button');
		updateProfileButton.textContent = 'UPDATE PROFILE';
		updateProfileButton.onclick = function() {
			window.location.href = '/profile';
		};
		buttonsContainer.appendChild(updateProfileButton);
	
		const startLikeButton = document.createElement('button');
		startLikeButton.classList.add('start-like-button');
		startLikeButton.textContent = 'START TO LIKE FIRST';
		startLikeButton.onclick = function() {
			window.location.href = '/home/main';
		};
		buttonsContainer.appendChild(startLikeButton);
	
		completeCard.appendChild(avatarWrapper);
		completeCard.appendChild(buttonsContainer);
		container.appendChild(completeCard);
	}
}
