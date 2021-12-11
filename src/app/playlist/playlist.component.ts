import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { filter, switchMap } from 'rxjs/operators';
import { Playlist } from '../models/Playlist';
import { PlaylistService } from './playlist.service';

@Component({
  selector: 'app-playlist',
  templateUrl: './playlist.component.html',
  styleUrls: ['./playlist.component.css']
})
export class PlaylistComponent implements OnInit {
  playlists?: Array<Playlist>
  playlistDeletedSubscription!: Subscription;
  playlistUpdatedSubscription!: Subscription;


  constructor(private playlistService: PlaylistService,
    private router: Router) { }

  ngOnInit(): void {
    this.fetchPlaylists();

    this.playlistDeletedSubscription = this.playlistService.playlistDeleted.pipe(
      switchMap(async () => this.fetchPlaylists()),
    ).subscribe();

    this.playlistUpdatedSubscription = this.playlistService.playlistUpdated.pipe(
      switchMap(async () => this.fetchPlaylists()),
    ).subscribe();
  }

  fetchPlaylists(): void {
    this.playlistService.getAll().subscribe(playlists => {
      this.playlists = playlists.reverse()
      console.log(playlists);
    });
  }

  create() {
    this.playlistService.create().subscribe(id =>
      {
        this.fetchPlaylists();
        this.router.navigate(['/playlist', id]);
      });
  }
}
