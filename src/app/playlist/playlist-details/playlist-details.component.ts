import { NgIf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Playlist } from '../../models/Playlist';
import { PlaylistService } from '../playlist.service';

@Component({
  selector: 'app-playlist-details',
  templateUrl: './playlist-details.component.html',
  styleUrls: ['./playlist-details.component.css']
})
export class PlaylistDetailsComponent implements OnInit {
  playlist!: Playlist;
  playlistId: string = "";


  constructor(
    private route: ActivatedRoute,
    private playlistService: PlaylistService) { }

  ngOnInit(): void {
    this.route.params.subscribe(res => {
      this.playlistId = res['id'];
      this.playlistService.getById(this.playlistId).subscribe(playlist => {
        this.playlist = playlist
        console.log(this.playlist);
      })
    })
  }

  fetchPalylist(playlistId: string) {
    this.playlistService.getById(this.playlistId).subscribe(playlist => {
      this.playlist = playlist
    });
  }
}
