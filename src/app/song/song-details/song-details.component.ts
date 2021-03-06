import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { Song } from '../../models/Song';
import { SongService } from '../song.service';

@Component({
  selector: 'app-song-details',
  templateUrl: './song-details.component.html',
  styleUrls: ['./song-details.component.css']
})
export class SongDetailsComponent implements OnInit {
  id: string = '';
  song!: Song;
  
  constructor(private route: ActivatedRoute, 
    private songService: SongService,
    private sanitization: DomSanitizer) { 
  }

  ngOnInit(): void {
    this.route.params.subscribe(res => {
      this.id = res['id'];
      this.songService.getSongDetailsById(this.id).subscribe(res => {
        this.song = res;  
        console.log(this.song);   
      });
    })
  }

  delete(id: number): void {
    this.songService.delete(id).subscribe();
  }
}
