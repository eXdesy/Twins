import { Component, ElementRef, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { EndpointsService } from '../../services/endpoints.service';
import { SwitchService } from '../../services/switch.service';
import { HttpClient } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-home-settings-channels-updateChannel',
  templateUrl: './updateChannel.component.html',
  styleUrl: './updateChannel.component.css'
})
export class UpdateChannelComponent {
  constructor(private switchService: SwitchService, private endpointsService: EndpointsService, private route: ActivatedRoute, private router: Router, private http: HttpClient) { }

  @ViewChild('foto', { static: true }) foto: ElementRef | null = null;
  @ViewChild('overlay', { static: true }) overlay: ElementRef | null = null;
  @ViewChild('description', { static: true }) description: ElementRef | null = null;

  token: string = '';
  charCount: number = 0;
  maxCharCount: number = 250;
  channel: any = {
    channel_id: '',
    foto: '',
    name: '',
    category: '',
    description: '',
    country: '',
    country_iso: '',
    price: '',
    link: ''
  };
  showCheck: boolean = true;
	
  ngOnInit(): void {
    this.token = localStorage.getItem('token') || '';

    this.route.queryParams.subscribe(params => {
      this.channel.channel_id = params['channel_id'];
      this.channel.foto = params['foto'];
      this.channel.name = params['name'];
      this.channel.category = params['category'];
      this.channel.description = params['description'];
      this.channel.country = params['country'];
      this.channel.country_iso = params['country_iso'];
      this.channel.price = params['price'];
      this.channel.link = params['link'];

      this.charCount = this.channel.description.length;
    });
		this.loadCountries();
			this.switchService.$modal.subscribe(value => {
      this.showCheck = value;
    });
	}
  
	navigateTo(path: string): void {
    this.router.navigate([path]);
  }

  loadCountries(): void {
    const headers = new HttpHeaders().set("X-CSCAPI-KEY", "WHNscmF2a0dHSG1aVVdKV2s5YnFpR1kzSHEzSW1LenZnZmRFQ0lOWA==");
    this.http.get('https://api.countrystatecity.in/v1/countries', { headers: headers })
      .subscribe(
        (result: any) => {
          const countrySelect = document.getElementById('countrySelect') as HTMLSelectElement;
          result.forEach((country: any) => {
            const option = document.createElement('option');
            option.value = country.iso2;
            option.textContent = country.name;
            countrySelect.appendChild(option);
          });
          // Si el perfil ya tiene un país seleccionado, cargar las ciudades de ese país
					if (this.channel.country) {
            countrySelect.value = this.channel.country_iso;
          }
        },
        (error) => {
          console.error('Error al obtener países:', error);
        }
      );
  }

  onUpdateChannel(foto: string, name: string, category: string, description: string, country: string, price: string, link: string) {
		const countryText = (document.getElementById('countrySelect') as HTMLSelectElement).selectedOptions[0].text;
    this.endpointsService.updateChannel(this.channel.channel_id, foto, name, category, description, countryText, country, price, link, this.token).subscribe(
      response => {
				this.switchService.openCheckModal('channelUpdate', response.message, true);
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

  toggleOverlay() {
    if (this.overlay) {
      const overlayElement = this.overlay.nativeElement;
      const overlayOpacity = window.getComputedStyle(overlayElement).getPropertyValue('opacity');
      if (overlayOpacity === '1') {
        this.selectImage();
      }
    }
  }
  selectImage() {
    const uploadInput = document.createElement('input');
    uploadInput.type = 'file';
    uploadInput.accept = 'image/*';
    uploadInput.style.display = 'none';
    uploadInput.addEventListener('change', (event: any) => {
      const file = event.target.files[0];
      const reader = new FileReader();
      reader.onload = (e: any) => {
        if (this.foto) {
          this.foto.nativeElement.src = e.target.result;
          this.channel.foto = e.target.result;
        }
      };
      reader.readAsDataURL(file);
    });
    uploadInput.click();
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
