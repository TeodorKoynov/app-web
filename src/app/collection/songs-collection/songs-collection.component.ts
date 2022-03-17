import { Component, OnInit } from '@angular/core';
import { Song } from '../../models/Song';
import { SongService } from '../../song/song.service';

@Component({
  selector: 'app-songs-collection',
  templateUrl: './songs-collection.component.html',
  styleUrls: ['./songs-collection.component.css']
})
export class SongsCollectionComponent implements OnInit {

  songs?: Array<Song>
  currentSongId?: string;

  constructor(private songService: SongService) { }

  ngOnInit(): void {
    this.fetchSongs();
  }

  fetchSongs(): void {
    this.songService.getAll().subscribe(songs => {
      this.songs = songs.reverse();
      console.log(this.songs); // remove
    });
  }

  LoadSong(songId: number, playlistId: number | null): void {
    this.currentSongId = songId.toString();
    var currentPlaylistId = "";

    if (playlistId !== null)
    {
      currentPlaylistId = playlistId.toString();
    }

    this.songService.loadSong(this.currentSongId, currentPlaylistId);
  }

  togglePlayingSong(songId: number) {
    this.songService.toggleSongPlaying();
  }

}
