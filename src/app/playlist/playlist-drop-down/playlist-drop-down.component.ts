import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { PlaylistService } from '../playlist.service';

@Component({
  selector: 'app-playlist-drop-down',
  templateUrl: './playlist-drop-down.component.html',
  styleUrls: ['./playlist-drop-down.component.css']
})
export class PlaylistDropDownComponent implements OnInit {
  @ViewChild('dropDown') dropDown!: ElementRef;
  @Input() playlistId!: string
  constructor(private playlistService: PlaylistService,
    private router: Router)
  { }

  ngOnInit(): void {
  }

  delete() {
    this.playlistService.delete(+this.playlistId)
    .subscribe(() => {
//    this.router.navigateByUrl('/collection/playlists');
      this.router.navigateByUrl('/');
    })
  }

}
