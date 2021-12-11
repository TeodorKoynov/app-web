import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Subscription } from 'rxjs';
import { concatMap, mergeMap, switchMap, tap } from 'rxjs/operators';
import { Song } from '../models/Song';
import { PlaylistService } from '../playlist/playlist.service';
import { SongService } from '../song/song.service';

@Component({
  selector: 'app-music-player',
  templateUrl: './music-player.component.html',
  styleUrls: ['./music-player.component.css']
})
export class MusicPlayerComponent implements OnInit, OnDestroy {
  @ViewChild('audio') audioElementRef!: ElementRef<HTMLAudioElement>;
  @ViewChild('progressBarContainer') progressBarContainerElementRef!: ElementRef<HTMLElement>;
  @ViewChild('volumeBarContainer') volumeBarContainerElementRef!: ElementRef<HTMLElement>;

  song: Song | null = null;
  songId:string = '';
  playlistId:string = '';
  isPlaying: boolean = true;;
  loadedSongSubscription!: Subscription;

  currentTime: number = 0;
  duration?: number;
  progressPercent? : number;

  volume: number = 0.75;
  volumePercent? : number = 75;

  durationDisplay: string = "0:00";
  currentTimeDisplay?: string = "0:00";

  constructor(private songService: SongService,
    private playlistService: PlaylistService, 
    private sanitization: DomSanitizer) {
   }

  ngOnInit(): void {
    this.loadedSongSubscription = this.songService.loadedSong.pipe(
        tap(loadedSongInfo => {
          this.songId = loadedSongInfo.id,
          this.playlistId = loadedSongInfo.playlistId;
        }),
        switchMap(() => this.songService.getById(this.songId).pipe(
          tap(res => {
            if (this.songId) {
              this.songService.convertSingleAudio(res, this.sanitization);      
              this.song = res;
              this.audioElementRef.nativeElement.volume = this.volume;
              this.audioElementRef.nativeElement.load();
              this.progressPercent = 0;
              if (!this.isPlaying) {
                this.songService.startPlaying();
              }
            }
          })
        )),
        switchMap(() => this.songService.isLoadedSongPlaying.pipe(
          tap(isPlaying => {
            this.isPlaying = isPlaying;
            // console.log(this.isPlaying ? "PLAYING" : "STOPPED"); 
            this.playOrPause();
          })
        ))
      )
      .subscribe();
  }

  ngOnDestroy(): void {
    this.loadedSongSubscription.unsubscribe();
  }

  nextSong() {    
    this.audioElementRef.nativeElement.pause();
    this.playlistService.SongFromPlaylistByAction(this.playlistId, this.songId, "next")
    .subscribe(song => {
      this.songService.loadSong(song.id.toString(), this.playlistId);
      this.audioElementRef.nativeElement.pause();
    });
  }

  prevSong() {
    if (this.currentTime > 3) {
      this.songService.loadSong(this.songId, this.playlistId);
      return;
    }
    this.audioElementRef.nativeElement.pause();
    this.playlistService.SongFromPlaylistByAction(this.playlistId, this.songId, "previous")
    .subscribe(song => {
      this.songService.loadSong(song.id.toString(), this.playlistId);
      this.audioElementRef.nativeElement.pause();
    });
  }

  playSong() {  
    this.audioElementRef.nativeElement.play();
  }

  pauseSong() {
    this.audioElementRef.nativeElement.pause();
  }

  playOrPause() {
    if (this.isPlaying) {
      this.playSong();
    } else {
      this.pauseSong();
    }
  }

  playOrPauseSong() {    
    this.songService.toggleSongPlaying();
  }

  setProgress(event: MouseEvent) {
    const width = this.progressBarContainerElementRef.nativeElement.clientWidth;
    const clickX = event.offsetX;

    if (this.duration === undefined) {
      this.duration = 0;
    }
    
    this.audioElementRef.nativeElement.currentTime = (clickX / width) * this.duration;
  }

  updateProgress() {
    this.duration = this.audioElementRef.nativeElement.duration;
    this.currentTime = this.audioElementRef.nativeElement.currentTime;

    this.progressPercent = (this.currentTime / this.duration) * 100;

    if (!isNaN(this.duration))
    {
      this.durationDisplay = this.formatTime(this.duration);
      this.currentTimeDisplay = this.formatTime(this.currentTime);
    }
  }

  formatTime(time: number): string {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time - (minutes * 60));

    if (seconds < 10) {
      const result = minutes.toString() + ":0" + seconds.toString();
      return result;
    }

    const result = minutes.toString() + ":" + seconds.toString();
    return result;
  }

  setVolume(event: MouseEvent) {
    const height = this.volumeBarContainerElementRef.nativeElement.clientHeight;
    const clickY = event.offsetY;

    this.volume = 1 - (clickY / height)
    
    if (clickY === -1) {
      this.volume = 1
    }

    this.volumePercent = this.volume * 100;
    
    this.audioElementRef.nativeElement.volume = this.volume;
  }
}
