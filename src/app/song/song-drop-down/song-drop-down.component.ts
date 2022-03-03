import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { PlaylistService } from '../../playlist/playlist.service';

@Component({
  selector: 'app-song-drop-down',
  templateUrl: './song-drop-down.component.html',
  styleUrls: ['./song-drop-down.component.css']
})
export class SongDropDownComponent implements OnInit {
  @ViewChild('dropDown') dropDown!: ElementRef;
  @ViewChild('removeButton') removeButton!: ElementRef;

  @Input() playlistId!: string
  @Input() songId!: string

  constructor(private playlistService: PlaylistService) { }

  ngOnInit(): void {
  }

  removeFromPlaylist(): void {    
    this.playlistService.removeSongFromPlaylist(this.playlistId, this.songId)
      .subscribe();
  }
}
