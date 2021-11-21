import { Component, OnInit } from '@angular/core';
import { Playlist } from '../models/Playlist';
import { PlaylistService } from './playlist.service';

@Component({
  selector: 'app-playlist',
  templateUrl: './playlist.component.html',
  styleUrls: ['./playlist.component.css']
})
export class PlaylistComponent implements OnInit {
  playlists?: Array<Playlist>

  constructor(private playlistService: PlaylistService) { }

  ngOnInit(): void {
    this.fetchPlaylists();
  }

  fetchPlaylists(): void {
    this.playlistService.getAll().subscribe(playlists => {
      this.playlists = playlists
      console.log(playlists);
    });
  }
}
