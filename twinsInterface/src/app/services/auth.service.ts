import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private jwtSecret = 'h09aXhdPH9fmHjY7pm6JA8Ua7lkzYPalg8qZme18GwMuCUB1XTftxt3PboMEKs5';
  
  constructor(private http: HttpClient) { }
  private getHeaders(token: string): HttpHeaders {
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
  }

  login(username_register: string, password_register: string): Observable<any> {
    const user = {
      username: username_register,
      password: password_register,
    };
    
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtSecret
    });

    return this.http.post<any>(`${environment.apiUrl}/auth/login`, user, { headers });
  }

  register(role: string, firstname_register: string, lastname_register: string, username_register: string, password_register: string, gender_register: string): Observable<any> {
    const newUser = {
      role: role,
      username: username_register,
      password: password_register,
      gender: gender_register,
      first_name: firstname_register,
      last_name: lastname_register
    };
    return this.http.post<any>(`${environment.apiUrl}/auth/register`, newUser);
  }

  password(old_password: string, new_password: string, token: string): Observable<any> {
    const passwordUser = {
      old_password: old_password,
      new_password: new_password
    };
    return this.http.post<any>(`${environment.apiUrl}/auth/upadatePassword`, passwordUser, { headers: this.getHeaders(token) });
  }

  logout(token: string): Observable<any> {
    return this.http.post<any>(`${environment.apiUrl}/auth/logout`, {}, { headers: this.getHeaders(token) });
  }

  support(user_id: number, username: string, first_name: string, last_name: string, description: string): Observable<any> {
    const support = {
      user_id: user_id,
      username: username,
      first_name: first_name,
      last_name: last_name,
      description: description,
    };
    
    return this.http.post<any>(`${environment.apiUrl}/auth/support`, support);
  }
}
