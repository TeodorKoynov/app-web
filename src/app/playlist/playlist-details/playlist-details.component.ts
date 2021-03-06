import { Component, ElementRef, OnDestroy, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Playlist } from '../../models/Playlist';
import { SongService } from '../../song/song.service';
import { PlaylistService } from '../playlist.service';
import {concatMap, filter, map, switchMap, tap} from 'rxjs/operators';
import { UtilitiesService } from '../../services/utilities.service';
import { PlaylistDropDownComponent } from '../playlist-drop-down/playlist-drop-down.component';
import { SongDropDownComponent } from '../../song/song-drop-down/song-drop-down.component';

@Component({
  selector: 'app-playlist-details',
  templateUrl: './playlist-details.component.html',
  styleUrls: ['./playlist-details.component.css']
})
export class PlaylistDetailsComponent implements OnInit, OnDestroy {
  @ViewChild('playlistDropDownElement') playlistDropDownElement!: PlaylistDropDownComponent;
  @ViewChild('playlistDropDownButton') playlistDropDownButton!: ElementRef;
  @ViewChildren('songDropDownElement') songDropDownElement!: QueryList<SongDropDownComponent>;
  @ViewChildren('songDropDownButton') songDropDownButton!: QueryList<ElementRef>;

  playlist!: Playlist;
  playlistId: string = "";

  isPlaylistDropDownShowing: boolean = false;

  isSongDropDownShowing: boolean = false;
  songDropDownId: string = "";

  loadedPlaylistId?: string;
  loadedSongSubscription!: Subscription;

  loadedSongId: string = "";

  isPlaying: boolean = false;
  isPlayingSubscription!: Subscription;

  playlistUpdatedSubscription!: Subscription;
  documentClickedTargetSubscription! : Subscription;
  paramsSubscription!: Subscription | undefined;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private playlistService: PlaylistService,
    private songService: SongService,
    private utilitiesService: UtilitiesService) { }

  ngOnInit(): void {    
    this.paramsSubscription = this.route.params.pipe(
      map(routeParams => routeParams?.id),
      tap(id => this.playlistId = id),
      concatMap(() => {
        return this.playlistService.getById(this.playlistId).pipe(
          tap(playlist => this.playlist = playlist)
        );
      }),
      concatMap(() => this.songService.isLoadedSongPlaying)      
    )
    .subscribe(isPlaying => this.isPlaying = isPlaying);
 
    this.loadedSongSubscription = this.songService.loadedSong.subscribe(loadedSong => {
      this.loadedSongId = loadedSong.id;
      this.loadedPlaylistId = loadedSong.playlistId;
    });

    this.playlistUpdatedSubscription = this.playlistService.playlistUpdated.pipe(
      filter(playlistId => this.playlistId === playlistId.toString()),
      switchMap(playlistId => this.playlistService.getById(playlistId.toString())),
    ).subscribe(playlist => this.playlist = playlist);

    this.documentClickedTargetSubscription = this.utilitiesService.documentClickedTarget
      .subscribe(target => {
        this.playlistDropDownListener(target)
        this.songDropDownListener(target)
      })
 }

  ngOnDestroy(): void {
    this.loadedSongSubscription?.unsubscribe();
    this.isPlayingSubscription?.unsubscribe();
    this.playlistUpdatedSubscription?.unsubscribe();
    this.documentClickedTargetSubscription?.unsubscribe();
    this.paramsSubscription?.unsubscribe();
  }

  fetchPalylist(playlistId: string) {
    this.playlistService.getById(this.playlistId).subscribe(playlist => {
      this.playlist = playlist
    });
  }

  playOrPauseSong(songId: number): void {
    if (this.loadedSongId === songId.toString() && this.playlistId === this.loadedPlaylistId) {
      this.songService.toggleSongPlaying()
      return;
    } 

    this.songService.loadSong(songId.toString(), this.playlistId);    
  }

  playOrPauseAlbum(): void {
    if (this.loadedSongId === undefined || this.playlistId !== this.loadedPlaylistId) {
      const songId = this.playlist.songs[0].id.toString(); 
      this.songService.loadSong(songId, this.playlistId);
      return;
    }

    this.playOrPauseSong(+this.loadedSongId);
  }

  playlistDropDownListener(target: any) : void {
    console.log(target);
    
    if ((this.playlistDropDownElement?.dropDown?.nativeElement?.contains(target) 
          && !this.playlistDropDownElement?.editButton?.nativeElement?.contains(target)) 
        || target === this.playlistDropDownButton?.nativeElement) {
    }
    else {
      this.isPlaylistDropDownShowing = false;
    }
  }

  songDropDownListener(target: any) : void {
    const songDropDownElement = this.songDropDownElement.toArray()
      .find(x => x.songId == this.songDropDownId);      

    if ((songDropDownElement?.dropDown?.nativeElement?.contains(target) 
          && !songDropDownElement.removeButton?.nativeElement?.contains(target)
          && !songDropDownElement.createButton?.nativeElement?.contains(target)
          && !songDropDownElement.addButton?.toArray().find(x => x.nativeElement == target))
          || this.songDropDownButton?.toArray().find(x => x.nativeElement == target) !== undefined) {                        
    }
    else {
      this.songDropDownId = "";
      this.isSongDropDownShowing = false;
    }
  }
  
  toggleSongDropdown(songId: string) : void {    
    if (this.songDropDownId != songId) {
      this.songDropDownId = songId;
      this.isSongDropDownShowing = true;
    } else {
      this.isSongDropDownShowing = !this.isSongDropDownShowing;
    }
  }

  toggle() {
    this.isPlaylistDropDownShowing = !this.isPlaylistDropDownShowing;
  }

  passImage(event: Event) {
    console.log(event);
    setTimeout(() => {
      this.utilitiesService.UploadedFileEvent(event);
    }, 1000)
  }
}
