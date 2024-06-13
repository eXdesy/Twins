import { Component, OnInit } from '@angular/core';
import { SwitchService } from '../services/switch.service';
import { Router } from '@angular/router';
import { Location } from '@angular/common';

@Component({
  selector: 'app-check',
  templateUrl: './check.component.html',
  styleUrls: ['./check.component.css']
})
export class CheckComponent implements OnInit {
  message: string | undefined;
  details: string | undefined;

  constructor(
    private switchService: SwitchService, 
    private router: Router,
		private location: Location
  ) { }

  ngOnInit(): void {
		// Escuchar los cambios del mensaje del SwitchService
		this.switchService.$modalMessage.subscribe(message => {
			this.message = message;
			console.log(this.message);
		});
		// Escuchar los cambios del mensaje del SwitchService
		this.switchService.$modalDetails.subscribe(details => {
			this.details = details;
			console.log(this.details);
		});
  }

	closeCheck() {
    this.switchService.closeCheckModal();
		window.location.reload();
	}
  goBack() {
    this.location.back();
  }
	backToSettings() {
		this.switchService.closeCheckModal();
		this.router.navigate(['/home/settings']);
	}
	backToChannel() {
		this.switchService.closeCheckModal();
		this.router.navigate(['/channels']);
	}
	backToGroups() {
		this.switchService.closeCheckModal();
		this.router.navigate(['/groups']);
	}

}
