import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Subscription } from 'rxjs';
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

  songId:string = '';
  songIdSubscription!: Subscription;

  playlistId:string = '';
  playlistIdSubscription!: Subscription;

  isPlaying: boolean = true;
  isPlayingSubscription!: Subscription;

  song: Song | null = null;

  currentTime: number = 0;
  duration?: number;
  progressPercent? : number;

  durationDisplay: string = "0:00";
  currentTimeDisplay?: string = "0:00";

  constructor(private songService: SongService,
    private playlistService: PlaylistService, 
    private sanitization: DomSanitizer) {


   }

  ngOnInit(): void {

    console.log("Initializing Music Player");
    

    this.songIdSubscription = this.songService
      .currentSongId
      .subscribe(songId => {

        if (songId !== "")
        {
          if (songId !== this.songId && this.isPlayingSubscription !== undefined) 
          {
            this.isPlayingSubscription.unsubscribe();            
          }

          this.songId = songId

          this.songService.getById(songId)
          .subscribe(res => {
            this.songService.convertSingleAudio(res, this.sanitization);
                        
            this.song = res;
            this.audioElementRef.nativeElement.load();
            this.progressPercent = 0;
            this.isPlaying = true;
            this.songService.playOrStop(this.isPlaying);
          })
          
          this.isPlayingSubscription = this.songService
          .isCurrentlyPlaying
          .subscribe(isPlaying => {
            this.isPlaying = isPlaying
            console.log(this.isPlaying); 
            this.playOrPause();
          });
        }
      });
    
    this.playlistIdSubscription = this.songService
      .currentPlaylistId 
      .subscribe(playlistId => {
        this.playlistId = playlistId

        console.log("SongId Subscription => 4");
        
      });
  }

  ngOnDestroy(): void {
    this.songIdSubscription.unsubscribe();
    this.playlistIdSubscription.unsubscribe();
    this.isPlayingSubscription.unsubscribe();
  }

  nextSong() {    
    this.audioElementRef.nativeElement.pause();
    this.playlistService.SongFromPlaylistByAction(this.playlistId, this.songId, "next").subscribe(song => {
      this.isPlayingSubscription.unsubscribe();      
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
    this.playlistService.SongFromPlaylistByAction(this.playlistId, this.songId, "previous").subscribe(song => {
      this.isPlayingSubscription.unsubscribe();
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
    this.isPlaying = !this.isPlaying
    this.songService.playOrStop(this.isPlaying);
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

 //   console.log(this.duration);
 //   console.log(this.currentTime);

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
}
