import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Playlist } from '../../models/Playlist';
import { PlaylistService } from '../playlist.service';
import { map, mergeMap } from 'rxjs/operators';
import { SongService } from '../../song/song.service';


@Component({
  selector: 'app-playlist-edit',
  templateUrl: './playlist-edit.component.html',
  styleUrls: ['./playlist-edit.component.css']
})
export class PlaylistEditComponent implements OnInit {
  playlist?: Playlist;
  playlistForm: FormGroup;

  constructor(private fb:FormBuilder,
      private songService: SongService,
      private playlistService: PlaylistService,
      private cd : ChangeDetectorRef,
      private route: ActivatedRoute,
      private router: Router) { 
    this.playlistForm = fb.group({
      'id' : [''],
      'title' : ['', [Validators.required, Validators.maxLength(40)]],
      'description' : ['', [Validators.required, Validators.maxLength(300)]],
      'imageUrl' : [''],
    })
  }

  ngOnInit(): void {
    this.route.parent?.params.pipe(
      map(parentParams => parentParams?.id),
      mergeMap(id => {
        return this.playlistService.getById(id)
      })
    ).subscribe(playlist => {
      this.playlist = playlist;
      console.log(playlist);
      this.playlistForm.controls['imageUrl'].setValue(playlist.imageUrl);
      this.playlistForm.controls['title'].setValue(playlist.title);
      this.playlistForm.controls['description'].setValue(playlist.desctiption);
     });
  }

  update(): void {
    if  (this.playlist !== undefined) {
      this.playlistForm.controls['id'].setValue(this.playlist.id); 
    }
    this.playlistService.update(this.playlistForm.value)
    .subscribe(res => this.close());
  }

  close(): void {
    this.router.navigate(['..'], {relativeTo: this.route});
  }

  uploadImage(event: Event) : void {
    const reader = new FileReader();
    console.log((event.target as HTMLInputElement).files![0]);

    if ((event.target as HTMLInputElement).files! && (event.target as HTMLInputElement).files!.length) {  
      var file = (event.target as HTMLInputElement).files![0];
      reader.readAsDataURL(file);
        
      reader.onload = () => {
        this.playlistForm.patchValue({
          imageUrl: reader.result
       });
       if (this.playlist !== undefined && reader.result !== null) {
        this.playlist.imageUrl = reader.result.toString();
       }
      };
      this.cd.markForCheck();
    }
  }

}
