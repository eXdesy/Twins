import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { EndpointsService } from '../services/endpoints.service';
import { SwitchService } from '../services/switch.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  constructor(private switchService: SwitchService, private endpointsService: EndpointsService, private router: Router) { }

  token: string = '';
  currentRoute: string = '';
  showFilter: boolean = true;
  showCheck: boolean = true;
  showUserInfo: boolean = true;

  ngOnInit(): void {
    this.token = localStorage.getItem('token') || '';
    this.currentRoute = this.router.url;

		this.switchService.$modal.subscribe(value => {
      this.showCheck = value;
    });
    this.switchService.$modal2.subscribe(value => {
      this.showFilter = value;
    });
		this.switchService.$modal3.subscribe(value => {
      this.showUserInfo = value;
    });
		this.switchService.$modal4.subscribe(value => {
      this.showFilter = value;
    });

    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.currentRoute = event.urlAfterRedirects;
      }
    });

    this.updateLikeCount();
  }

  navigateTo(path: string): void {
    this.router.navigate([path]);
  }

  updateLikeCount() {
    this.endpointsService.getLikedUsers(this.token).subscribe(
      response => {
        if (response.liked_users && response.liked_users.length > 0) {
          const likeCountElement = document.querySelector('.li');
          const msg = document.createElement('span');
          msg.classList.add('msg');
          msg.textContent = response.liked_users.length.toString();
          if (likeCountElement) {
            likeCountElement.appendChild(msg);
          }
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
}
