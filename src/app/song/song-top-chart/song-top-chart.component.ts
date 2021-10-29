import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { SongService } from '../song.service';
import { Song} from '../../models/Song';

@Component({
  selector: 'app-song-top-chart',
  templateUrl: './song-top-chart.component.html',
  styleUrls: ['./song-top-chart.component.css']
})
export class SongTopChartComponent implements OnInit {
  songs?: Array<Song>
  audioFile: any;
  constructor(private songService: SongService, private sanitization: DomSanitizer) { }

  ngOnInit(): void {
    this.fetchSongs();
  }

  fetchSongs() {
    this.songService.getAll().subscribe(songs => {
      this.songs = songs;
      console.log(this.songs)
      this.songService.convertAudio(songs, this.sanitization);
    });
  }
}
