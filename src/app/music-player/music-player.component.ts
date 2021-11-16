import { Component, OnDestroy, OnInit } from '@angular/core';
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
  songId:string = '';
  songIdSubscription!: Subscription;

  playlistId:string = '';
  playlistIdSubscription!: Subscription;

  isPlaying? : boolean;
  song : Song | null = null;

  constructor(private songService: SongService,
    private sanitization: DomSanitizer) {
    this.songService.getById(this.songId).subscribe(song => this.song = song);
   }

  ngOnInit(): void {
    this.songIdSubscription = this.songService
      .currentSongId
      .subscribe(songId => {
        this.songId = songId
        this.songService.getById(songId)
        .subscribe(res => {
          this.songService.convertSingleAudio(res, this.sanitization);
          this.song = res;  
          console.log(this.song);  
        })
      });
    
    this.playlistIdSubscription = this.songService
      .currentPlaylistId
      .subscribe(playlistId => this.playlistId = playlistId);

    console.log(this.songId)
    console.log(this.playlistId)

  }

  ngOnDestroy(): void {
    this.songIdSubscription.unsubscribe();
    this.playlistIdSubscription.unsubscribe();
  }


  playSong() {
 //   this.musicPlayerContainer.classList.add('play');

  }

  pauseSong() {

  }

  playOrPauseSong() {
 //   this.isPlaying = this.musicPlayerContainer.classList.contains('play');

    if (this.isPlaying) {
      this.pauseSong()
    } else {
      this.playSong() 
    }
  }
}
