import { NgIf } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { Playlist } from '../../models/Playlist';
import { SongService } from '../../song/song.service';
import { PlaylistService } from '../playlist.service';

@Component({
  selector: 'app-playlist-details',
  templateUrl: './playlist-details.component.html',
  styleUrls: ['./playlist-details.component.css']
})
export class PlaylistDetailsComponent implements OnInit, OnDestroy {
  playlist!: Playlist;
  playlistId: string = "";

  loadedPlaylistId?: string;
  loadedPlaylistSubscription!: Subscription;

  currentSongId: string = "";

  isPlaying: boolean = false;
  isPlayingSubscription!: Subscription;

  constructor(
    private route: ActivatedRoute,
    private playlistService: PlaylistService,
    private songService: SongService) { }

  ngOnInit(): void {
    this.route.params.subscribe(res => {
      this.playlistId = res['id'];
      this.playlistService.getById(this.playlistId).subscribe(playlist => {
        this.playlist = playlist
        console.log(this.playlist); 
      })
      this.isPlayingSubscription = this.songService
        .isCurrentlyPlaying
        .subscribe(isPlaying => this.isPlaying = isPlaying);
    })
 
    this.songService.currentSongId.subscribe(songId => this.currentSongId = songId);
      
    this.loadedPlaylistSubscription = this.songService.currentPlaylistId.subscribe(loadedPlaylistId => this.loadedPlaylistId = loadedPlaylistId);
 
 }

  ngOnDestroy(): void {
    this.isPlayingSubscription.unsubscribe();
  }

  fetchPalylist(playlistId: string) {
    this.playlistService.getById(this.playlistId).subscribe(playlist => {
      this.playlist = playlist
    });
  }

  playOrPauseSong(songId: number): void {
    console.log(this.loadedPlaylistId);
    console.log(this.playlistId);
    
    if (this.currentSongId === songId.toString() && this.playlistId === this.loadedPlaylistId) {
      this.isPlaying = !this.isPlaying;
      this.songService.playOrStop(this.isPlaying)
      return;
    } 

    this.currentSongId = songId.toString();    
    this.songService.loadSong(this.currentSongId, this.playlistId);    
  }

  playOrPauseAlbum(): void {
    if (this.currentSongId === undefined || this.playlistId !== this.loadedPlaylistId) {
      const songId = this.playlist.songs[0].id.toString(); 
      this.songService.loadSong(songId, this.playlistId);
      return;
    }

    this.playOrPauseSong(+this.currentSongId);
  }
}
