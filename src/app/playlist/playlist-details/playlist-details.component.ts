import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Playlist } from '../../models/Playlist';
import { SongService } from '../../song/song.service';
import { PlaylistService } from '../playlist.service';
import {concatMap, filter, map, switchMap, tap} from 'rxjs/operators';

@Component({
  selector: 'app-playlist-details',
  templateUrl: './playlist-details.component.html',
  styleUrls: ['./playlist-details.component.css']
})
export class PlaylistDetailsComponent implements OnInit, OnDestroy {
  playlist!: Playlist;
  playlistId: string = "";

  loadedPlaylistId?: string;
  loadedSongSubscription!: Subscription;

  loadedSongId: string = "";

  isPlaying: boolean = false;
  isPlayingSubscription!: Subscription;
  playlistUpdatedSubscription!: Subscription;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private playlistService: PlaylistService,
    private songService: SongService) { }

  ngOnInit(): void {
    this.route.params.pipe(
      map(routeParams => routeParams?.id),
      tap(id => this.playlistId = id),
      concatMap(() => {
        return this.playlistService.getById(this.playlistId).pipe(
          tap(playlist => this.playlist = playlist)
        );
      }),
      concatMap(() => this.songService.isLoadedSongPlaying)      
    )
    .subscribe(isPlaying => this.isPlaying = isPlaying);
 
    this.loadedSongSubscription = this.songService.loadedSong.subscribe(loadedSong => {
      this.loadedSongId = loadedSong.id;
      this.loadedPlaylistId = loadedSong.playlistId;
    });

    this.playlistUpdatedSubscription = this.playlistService.playlistUpdated.pipe(
      filter(playlistId => this.playlistId === playlistId.toString()),
      switchMap(playlistId => this.playlistService.getById(playlistId.toString())),
    ).subscribe(playlist => this.playlist = playlist);
 }

  ngOnDestroy(): void {
    this.loadedSongSubscription?.unsubscribe();
    this.isPlayingSubscription?.unsubscribe();
    this.playlistUpdatedSubscription?.unsubscribe();
  }

  fetchPalylist(playlistId: string) {
    this.playlistService.getById(this.playlistId).subscribe(playlist => {
      this.playlist = playlist
    });
  }

  playOrPauseSong(songId: number): void {
    if (this.loadedSongId === songId.toString() && this.playlistId === this.loadedPlaylistId) {
      this.songService.toggleSongPlaying()
      return;
    } 

    this.songService.loadSong(songId.toString(), this.playlistId);    
  }

  playOrPauseAlbum(): void {
    if (this.loadedSongId === undefined || this.playlistId !== this.loadedPlaylistId) {
      const songId = this.playlist.songs[0].id.toString(); 
      this.songService.loadSong(songId, this.playlistId);
      return;
    }

    this.playOrPauseSong(+this.loadedSongId);
  }
}
