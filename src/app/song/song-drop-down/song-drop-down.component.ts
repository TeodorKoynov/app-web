import { Component, ElementRef, Input, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { Router } from '@angular/router';
import { switchMap, tap } from 'rxjs/operators';
import { Playlist } from '../../models/Playlist';
import { PlaylistService } from '../../playlist/playlist.service';

@Component({
  selector: 'app-song-drop-down',
  templateUrl: './song-drop-down.component.html',
  styleUrls: ['./song-drop-down.component.css']
})
export class SongDropDownComponent implements OnInit {
  @ViewChild('dropDown') dropDown!: ElementRef;
  @ViewChild('removeButton') removeButton!: ElementRef;
  @ViewChild('createButton') createButton!: ElementRef;
  @ViewChildren('addButton') addButton!: QueryList<ElementRef>;

  @Input() playlistId!: string
  @Input() songId!: string

  playlists?: Array<Playlist>
  createdPlaylistId?: number

  constructor(private playlistService: PlaylistService,
    private router: Router) { }

  ngOnInit(): void {
    this.fetchPlaylists();
  }

  fetchPlaylists(): void {
    this.playlistService.getAll().subscribe(playlists => {
      this.playlists = playlists.reverse();
      console.log(playlists);
    });
  }

  removeFromPlaylist(): void {    
    this.playlistService.removeSongFromPlaylist(this.playlistId, this.songId)
      .subscribe();
  }

  addToPlaylist(playlistId: string) : void {
    this.playlistService.addSongToPlaylist(playlistId, this.songId)
    .subscribe();
  }

  createPlaylistWithSong() {
    this.playlistService.create()
      .pipe(
        switchMap(id => this.playlistService.addSongToPlaylist(id.toString(), this.songId))
      ).subscribe()
  }
}
