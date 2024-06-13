import { Component, ElementRef, ViewChild, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { EndpointsService } from '../services/endpoints.service';
import { SwitchService } from '../services/switch.service';

@Component({
  selector: 'app-filters',
  templateUrl: './filters.component.html',
  styleUrls: ['./filters.component.css']
})
export class FiltersComponent implements OnInit {
	@ViewChild('description', { static: true }) description: ElementRef | null = null;

  token: string = '';
	charCount: number = 0;
  maxCharCount: number = 200;
	selectedCategories: string[] = [];
	message: string | undefined;
	report_type: string = '';
	report_type_id: number = 0;
	categories: string[] = [
    'Blog', 'Shopping', 'Programming', 'Cooking', 'Finance', 'Art', 
    'Erotica', 'Traveling', 'Design', 'Entertainment', 'Science', 
    'Extreme', 'Music', 'Movies', 'Video games', 'Other'
  ];
	selectedReportCategory: string = '';
	reports: string[] = [
    'Violence', 'Fraude', 'Spam', 'Fake', 'ChildAbuse', 'Other'
	];

  constructor(
    private switchService: SwitchService, 
    private endpointsService: EndpointsService, 
    private router: Router
  ) { }

  ngOnInit(): void {
    this.token = localStorage.getItem('token') || '';
	  // Escuchar los cambios del mensaje del SwitchService
		this.switchService.$modalFilter.subscribe(message => {
			this.message = message;
			console.log(this.message);
		});

		this.switchService.$modalReportTypeID.subscribe(id => {
			this.report_type_id = id;
			console.log(this.report_type_id);
		});

		this.switchService.$modalReportType.subscribe(report_type => {
			this.report_type = report_type;
			console.log(this.report_type);
		});
	}

  closeFilter() {
    this.switchService.closeFilterModal();
	}
  closeReport() {
    this.switchService.closeReportModal();
	}

  toggleSelection(category: string) {
    const index = this.selectedCategories.indexOf(category);
    if (index === -1) {
      this.selectedCategories.push(category);
    } else {
      this.selectedCategories.splice(index, 1);
    }
  }
  selectReportType(report: string) {
    this.selectedReportCategory = report;
  }

	createReport(report_category: string, description: string) {
    this.endpointsService.report(this.report_type_id, this.report_type, report_category, description, 'true', this.token).subscribe(
      response => {
				this.switchService.openCheckModal('report', response.message, true);
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

  getAllGroupsCategory() {
		if (this.selectedCategories.length === 0) {
			return this.closeFilter();
    }
    this.endpointsService.getAllGroupsCategory(this.selectedCategories, this.token).subscribe(
      response => {
				if (response.groups && response.groups.length > 0) {
					this.switchService.emitGroupData(response.groups);
					this.closeFilter();
				} else {
          this.clear(response.message)
					this.closeFilter();
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
      }
    );
  }

  getAllChannelsCategory() {
		if (this.selectedCategories.length === 0) {
			return this.closeFilter();
    }
    this.endpointsService.getAllChannelsCategory(this.selectedCategories, this.token).subscribe(
      response => {
				if (response.channels && response.channels.length > 0) {
					this.switchService.emitChannelData(response.channels);
					this.closeFilter();
				} else {
					this.clear(response.message)
					this.closeFilter();
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
      }
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
	updateCharCount(): void {
    if (this.description && this.description.nativeElement) {
      const desc = this.description.nativeElement.value;
      if (desc.length > this.maxCharCount) {
        this.description.nativeElement.value = desc.substring(0, this.maxCharCount);
      }
      this.charCount = this.description.nativeElement.value.length;
    }
  }
}
