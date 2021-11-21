import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private loginPath: string = environment.apiUrl + "/identity/login";
  private registerPath: string = environment.apiUrl + "/identity/register";

  constructor(private http: HttpClient) { }

  public login(data: any): Observable<any> {
    return this.http.post(this.loginPath, data);
  }

  public register(data: any): Observable<any> {
    return this.http.post(this.registerPath, data)
  }

  public saveToken(token: string) {
    localStorage.setItem('token', token);
  }

  public removeToken() {
    localStorage.removeItem('token');
  }

  public getToken() {
    return localStorage.getItem('token');
  }

  public IsAuthenticated(): boolean {
    if (this.getToken()) {
      return true;
    }
    return false;
  }
}
 