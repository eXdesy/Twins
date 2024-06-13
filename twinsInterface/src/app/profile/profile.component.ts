import { Component, ElementRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { EndpointsService } from '../services/endpoints.service';
import { HttpClient } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';
import { SwitchService } from '../services/switch.service';

@Component({
  selector: 'app-home-settings-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent {
  constructor(private switchService: SwitchService, private endpointsService: EndpointsService, private router: Router, private http: HttpClient) { }

  @ViewChild('foto', { static: true }) foto: ElementRef | null = null;
  @ViewChild('overlay', { static: true }) overlay: ElementRef | null = null;
  @ViewChild('description', { static: true }) description: ElementRef | null = null;

  token: string = '';
  charCount: number = 0;
  maxCharCount: number = 200;
  profile: any = {
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
  showCheck: boolean = true;

  ngOnInit(): void {
    this.switchService.$modal.subscribe(value => {
      this.showCheck = value;
    });
    this.token = localStorage.getItem('token') || '';
    this.charCount = this.profile.description.length;
    this.onGetProfile();
    this.loadCountries();
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
          if (this.profile.country) {
            countrySelect.value = this.profile.country_iso;
            this.loadCities(this.profile.country_iso);
          }
        },
        (error) => {
          console.error('Error al obtener países:', error);
        }
      );
  }

  loadCities(countryIso2: string): void {
    const headers = new HttpHeaders().set("X-CSCAPI-KEY", "WHNscmF2a0dHSG1aVVdKV2s5YnFpR1kzSHEzSW1LenZnZmRFQ0lOWA==");
    this.http.get(`https://api.countrystatecity.in/v1/countries/${countryIso2}/states`, { headers: headers })
      .subscribe(
        (result: any) => {
          const citySelect = document.getElementById('citySelect') as HTMLSelectElement;
          citySelect.innerHTML = ''; // Limpiar las opciones existentes
          result.forEach((state: any) => {
            const option = document.createElement('option');
            option.value = state.iso2;
            option.textContent = state.name;
            citySelect.appendChild(option);
          });
          if (this.profile.city_iso) {
            citySelect.value = this.profile.city_iso;
          }
        },
        (error) => {
          console.error('Error al obtener ciudades:', error);
        }
      );
  }

  onCountryChange(): void {
    const selected = (document.getElementById('countrySelect') as HTMLSelectElement).value;
    this.loadCities(selected);
  }

  onGetProfile(): void {
    this.endpointsService.getProfile(this.token).subscribe(
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

  onUpdateProfile(first_name: string, last_name: string, country: string, city: string, birthday: string, orientation: string, description: string, foto: string): void {
    // Obtener los textos de las opciones seleccionadas
    const countryText = (document.getElementById('countrySelect') as HTMLSelectElement).selectedOptions[0].text;
    const cityText = (document.getElementById('citySelect') as HTMLSelectElement).selectedOptions[0].text;
    this.endpointsService.updateProfile(first_name, last_name, country, countryText, city, cityText, birthday, orientation, description, foto, this.token).subscribe(
      response => {
				this.switchService.openCheckModal('update', response.message, true);
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

  toggleOverlay(): void {
    if (this.overlay) {
      const overlayElement = this.overlay.nativeElement;
      const overlayOpacity = window.getComputedStyle(overlayElement).getPropertyValue('opacity');
      if (overlayOpacity === '1') {
        this.selectImage();
      }
    }
  }
  selectImage(): void {
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
          this.profile.foto = e.target.result;
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
