import { Component, OnInit, Sanitizer } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { SongService } from '../song.service';
import { Song} from '../../models/Song';

@Component({
  selector: 'app-song-list',
  templateUrl: './song-list.component.html',
  styleUrls: ['./song-list.component.css']
})
export class SongListComponent implements OnInit {
  songs?: Array<Song>
  audioFile: any;

  constructor(private songService: SongService, private sanitization: DomSanitizer) { }

  ngOnInit(): void {
    this.songService.getAll().subscribe(songs => {
      this.songs = songs;
      this.convertAudio();
    });
  }

  convertAudio() {
    this.songs?.forEach(song => {      
      song.trustedAudioFile = this.sanitization.bypassSecurityTrustUrl(song.audioFile);
    });
  }
}
