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

  isPlaying? : boolean = false;
  song : Song | null = null;

  constructor(private songService: SongService,
    private sanitization: DomSanitizer) {
    this.songService.getById(this.songId).subscribe(song => {
      console.log(song);
    });
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
          console.log(res);  
        })
      });
    
    this.playlistIdSubscription = this.songService
      .currentPlaylistId
      .subscribe(playlistId => this.playlistId = playlistId);
  }

  ngOnDestroy(): void {
    this.songIdSubscription.unsubscribe();
    this.playlistIdSubscription.unsubscribe();
  }


  playSong() {
  }

  pauseSong() {
  }

  playOrPauseSong() {
    console.log(this.isPlaying)
    console.log(this.song)

    if (this.isPlaying) {
      this.isPlaying = false;
      this.pauseSong()
    } else {
      this.isPlaying = true;
      this.playSong() 
    }
  }
}
