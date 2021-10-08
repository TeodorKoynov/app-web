import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';


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
}
