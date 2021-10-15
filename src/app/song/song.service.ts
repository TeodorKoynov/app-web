import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { Song } from '../models/Song';
import { DomSanitizer } from '@angular/platform-browser';

@Injectable({
  providedIn: 'root'
})
export class SongService {
  private createPath: string = environment.apiUrl + "/songs";
  private getAllPath: string = environment.apiUrl + "/songs/";


  constructor(private http: HttpClient, private authService: AuthService) { }

  // may need to be changed to Song
  public create(data: any): Observable<number> {
    return this.http.post<number>(this.createPath, data);
  }

  public getAll() : Observable<Array<Song>> {
    return this.http.get<Array<Song>>(this.getAllPath);
  }

  public getById(id: string) : Observable<Song> {
    return this.http.get<Song>(this.getAllPath + id);
  }

  convertAudio(songs: Array<Song>, sanitization: DomSanitizer) {
    songs?.forEach(song => {      
      song.trustedAudioFile = sanitization.bypassSecurityTrustUrl(song.audioFile);
    });
  }

  convertSingleAudio(song: Song, sanitization: DomSanitizer) {
      song.trustedAudioFile = sanitization.bypassSecurityTrustUrl(song.audioFile);
  }
}
