import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Subscription } from 'rxjs';
import { Song } from '../models/Song';
import { SongService } from '../song/song.service';

@Component({
  selector: 'app-music-player',
  templateUrl: './music-player.component.html',
  styleUrls: ['./music-player.component.css']
})
export class MusicPlayerComponent implements OnInit, OnDestroy {
  @ViewChild('audio') audioElementRef!: ElementRef<HTMLAudioElement>;
  songId:string = '';
  songIdSubscription!: Subscription;

  playlistId:string = '';
  playlistIdSubscription!: Subscription;

  isPlaying? : boolean = false;
  song: Song | null = null;

  constructor(private songService: SongService, private sanitization: DomSanitizer) {
    this.songService.getById(this.songId).subscribe(song => {
      console.log(song); ////////////
    });
   }

  ngOnInit(): void {
    this.songIdSubscription = this.songService
      .currentSongId
      .subscribe(songId => {

        console.log(songId); ////////////
        
        if (songId !== "")
        {
          this.songId = songId
          this.songService.getById(songId)
          .subscribe(res => {
            this.songService.convertSingleAudio(res, this.sanitization);
            this.song = res;

            this.audioElementRef.nativeElement.load();
            this.playSong();

            console.log(this.audioElementRef.nativeElement);
            
            
            console.log(res);  ////////////
          })
        }
      });
    
    this.playlistIdSubscription = this.songService
      .currentPlaylistId 
      .subscribe(playlistId => this.playlistId = playlistId);
  }

  ngOnDestroy(): void {
    this.songIdSubscription.unsubscribe();
    this.playlistIdSubscription.unsubscribe();
  }

  nextSong() {
    
  }

  prevSong() {

  }

  playSong() {  
    this.isPlaying = true;    
    this.audioElementRef.nativeElement.play();
  }

  pauseSong() {
    this.isPlaying = false;
    this.audioElementRef.nativeElement.pause();
  }

  playOrPauseSong() {
    console.log(this.audioElementRef.nativeElement);
    
    if (this.isPlaying) {
      this.pauseSong();
    } else {
      this.playSong();
    }

    console.log(this.isPlaying)
  }
}
