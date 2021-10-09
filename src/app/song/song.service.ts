import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { Song } from '../models/Song';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class SongService {
  private createPath: string = environment.apiUrl + "/songs";

  constructor(private http: HttpClient, private authService: AuthService) { }

  // may need to be changed to Song
  public create(data: any): Observable<number> {
    let headers = new HttpHeaders();
    headers = headers.set('Authorization', `Bearer ${this.authService.getToken()}`);

    return this.http.post<number>(this.createPath, data, {headers});
  }
}
