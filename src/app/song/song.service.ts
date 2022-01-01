import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { BehaviorSubject, from, Observable, of, Subject } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { Song } from '../models/Song';
import { DomSanitizer } from '@angular/platform-browser';

export interface LoadedSongInfo {
  id: string,
  playlistId: string
}

@Injectable({
  providedIn: 'root'
})
export class SongService {
  private isSongPlaying = false;
  private isLoadedSongPlayingSubject = new BehaviorSubject<boolean>(this.isSongPlaying);

  get isLoadedSongPlaying(): Observable<boolean> {
    return this.isLoadedSongPlayingSubject.asObservable();
  }

  private loadedSongSubject = new BehaviorSubject<LoadedSongInfo>({
    id: '',
    playlistId: ''
  });

  get loadedSong(): Observable<LoadedSongInfo> {
    return this.loadedSongSubject.asObservable();
  }

  private getAllPath: string = environment.apiUrl + "/songs/";
  private getSongDetailsPath: string = environment.apiUrl + "/songs/details/"
  private createPath: string = environment.apiUrl + "/songs";

  private songDeletedSubject = new Subject<number>();

  songDeleted = this.songDeletedSubject.asObservable();

  constructor(private http: HttpClient, private authService: AuthService) { }

  // may need to be changed to Song
  public create(data: any): Observable<number> {
    return this.http.post<number>(this.createPath, data);
  }

  public getAll() : Observable<Array<Song>> {
    return this.http.get<Array<Song>>(this.getAllPath);
  }

  public getSongDetailsById(id: string): Observable<Song> {
    return this.http.get<Song>(this.getSongDetailsPath + id)
  }

  public playById(id: string) : Observable<Song> {
    return this.http.get<Song>(this.getAllPath + id);
  }

  public delete(id: number): Observable<any> {
    this.songDeletedSubject.next(id);
    return this.http.delete(this.getAllPath + id);
  }

  public loadSong(songId: string, playlistId: string) {    
    this.loadedSongSubject.next({
      id: songId,
      playlistId
    });
  }

  public toggleSongPlaying(): void {
    this.isSongPlaying = !this.isSongPlaying;
    this.isLoadedSongPlayingSubject.next(this.isSongPlaying);
  }

  startPlaying() {
    this.isSongPlaying = true;
    this.isLoadedSongPlayingSubject.next(this.isSongPlaying);
  }

  stopPlaying() {
    this.isSongPlaying = false;
    this.isLoadedSongPlayingSubject.next(this.isSongPlaying);
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
