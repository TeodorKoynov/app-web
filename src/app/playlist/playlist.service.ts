import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { Playlist } from '../models/Playlist';
import { Song } from '../models/Song';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class PlaylistService {

  private getAllPath: string = environment.apiUrl + "/playlist/";
  private createPath: string = environment.apiUrl + "/playlist";
  private songPath: string = "/song/"
  private playlistDeletedSubject = new Subject<number>();
  private playlistUpdatedSubject = new Subject<number>();

  playlistDeleted = this.playlistDeletedSubject.asObservable();
  playlistUpdated = this.playlistUpdatedSubject.asObservable();

  constructor(private http: HttpClient, private authService: AuthService) { }

  public getAll(): Observable<Array<Playlist>> {
    return this.http.get<Array<Playlist>>(this.getAllPath);
  }

  public create(data: any): Observable<number> {
    return this.http.post<number>(this.createPath, data);
  }

  public getById(id: string): Observable<Playlist> {
    return this.http.get<Playlist>(this.getAllPath + id);
  }

  public update(data: any) {
    return this.http.put(this.createPath, data)
      .pipe(
        tap(() => this.playlistUpdatedSubject.next(data.id))
      );
  }

  public delete(id: number): Observable<any> {
    this.playlistDeletedSubject.next(id);
    return this.http.delete(this.getAllPath + id);
  }

  public addSongToPlaylist(playlistId: string, songId: string): Observable<any> {
    const urlPath = `${this.getAllPath}/${playlistId}/${this.songPath}/${songId}`;
    return this.http.post(urlPath, "");
  }

  public removeSongFromPlaylist(playlistId: string, songId: string): Observable<any> {
    const urlPath = `${this.getAllPath}/${playlistId}/${this.songPath}/${songId}`;
    return this.http.delete(urlPath);
  }

  public SongFromPlaylistByAction(playlistId: string, songId: string, action: string): Observable<Song> {
    const urlPath = `${this.getAllPath}${playlistId}${this.songPath}${songId}?action=${action}`;
    return this.http.get<Song>(urlPath);
  }
}
