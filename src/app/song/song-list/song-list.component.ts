import { Component, OnDestroy, OnInit, Sanitizer } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { SongService } from '../song.service';
import { Song} from '../../models/Song';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-song-list',
  templateUrl: './song-list.component.html',
  styleUrls: ['./song-list.component.css']
})
export class SongListComponent implements OnInit, OnDestroy {
  songs?: Array<Song>
  audioFile: any;
  private songDeletedSub!: Subscription;

  constructor(private songService: SongService, private sanitization: DomSanitizer) { }

  ngOnInit(): void {
    this.fetchSongs();
    this.songDeletedSub = this.songService.songDeleted
    .subscribe(id => {
      console.log(id);
      console.log(this.songs);
      this.songs = this.songs?.filter(song => song.id !== id)
      console.log(this.songs);
    });
  }

  delete(id: number): void {
    this.songService.delete(id).subscribe();
  }
  
  fetchSongs() {
    this.songService.getAll().subscribe(songs => {
      this.songs = songs;
      this.songService.convertAudio(songs, this.sanitization);
    });
  }

  ngOnDestroy(): void {
    this.songDeletedSub?.unsubscribe();
  }
}
