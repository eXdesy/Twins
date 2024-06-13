import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { EndpointsService } from '../services/endpoints.service';
import { SwitchService } from '../services/switch.service';

@Component({
  selector: 'app-home-settings-groups',
  templateUrl: './groups.component.html',
  styleUrl: './groups.component.css'
})
export class GroupsComponent {
  constructor(private switchService: SwitchService, private endpointsService: EndpointsService, private router: Router) { }
  token: string = '';
  showCheck: boolean = true;

  ngOnInit(): void {
    this.token = localStorage.getItem('token') || '';
    this.onGetGroup();
    this.switchService.$modal.subscribe(value => {
      this.showCheck = value;
    });
	}
  
	navigateTo(path: string): void {
    this.router.navigate([path]);
  }
  
  onGetGroup() {
    this.endpointsService.getGroup(this.token).subscribe(
      response => {
        if (response.groups && response.groups.length > 0) {
          this.renderGroupData(response.groups);
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
			country_iso: string;
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
        this.onDeleteGroup(group.group_id)
			};
			cardActions.appendChild(deleteButton);

      const updateButton = document.createElement('button');
      updateButton.classList.add('group-update-button');
			updateButton.innerHTML = '<i class="fas fa-edit"></i>';
      updateButton.onclick = function() {
        window.location.href = '/updateGroup?group_id=' + encodeURIComponent(group.group_id) +
//                                '&foto=' + encodeURIComponent(group.foto) +
                                '&name=' + encodeURIComponent(group.name) +
                                '&category=' + encodeURIComponent(group.category) +
                                '&description=' + encodeURIComponent(group.description) +
                                '&country=' + encodeURIComponent(group.country) +
                                '&country_iso=' + encodeURIComponent(group.country_iso) +
                                '&price=' + encodeURIComponent(group.price) +
                                '&link=' + encodeURIComponent(group.link);
      };
			cardActions.appendChild(updateButton);
	
			card.appendChild(cardActions);
			cards.appendChild(card);
		});
		container.appendChild(cards);
	}
  onDeleteGroup(group_id: number) {
    this.endpointsService.deleteGroup(group_id, this.token).subscribe(
      response => {
        this.router.navigate(['/check'], { state: { message: 'groupUpdate', details: response.message  } });
        this.onGetGroup();
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
