import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { SongService } from '../song.service';

@Component({
  selector: 'app-song-form',
  templateUrl: './song-form.component.html',
  styleUrls: ['./song-form.component.css']
})
export class SongFormComponent implements OnInit {
  songForm: FormGroup; 

  constructor(private fb:FormBuilder, private songService: SongService, private cd : ChangeDetectorRef) { 
    this.songForm = fb.group({
      'title' : ['', [Validators.required, Validators.maxLength(40)]],
      'description' : ['', [Validators.required, Validators.maxLength(2000)]],
      'imageUrl' : [''],
      audioUrl : [null, [Validators.required]]
    })
  }

  ngOnInit(): void {
  }

  create(): void {
    console.log(this.songForm.value);
    
    this.songService.create(this.songForm.value).subscribe(res => {
      console.log(res);
    }
      );
  }

  uploadAudio(event: Event) : void {
    const reader = new FileReader();
    console.log((event.target as HTMLInputElement).files![0]);

    if ((event.target as HTMLInputElement).files! && (event.target as HTMLInputElement).files!.length) {  
      var file = (event.target as HTMLInputElement).files![0];
      reader.readAsDataURL(file);
        
      reader.onload = () => {
        this.songForm.patchValue({
          audioUrl: reader.result
       });
      };
      this.cd.markForCheck();
    }
  }

  uploadImage(event: Event) : void {
    const reader = new FileReader();
    console.log((event.target as HTMLInputElement).files![0]);

    if ((event.target as HTMLInputElement).files! && (event.target as HTMLInputElement).files!.length) {  
      var file = (event.target as HTMLInputElement).files![0];
      reader.readAsDataURL(file);
        
      reader.onload = () => {
        this.songForm.patchValue({
          imageUrl: reader.result
       });
      };
      this.cd.markForCheck();
    }
  }
  

  get title(): FormControl {
    return this.songForm.get('title') as FormControl;    
  }

  get description(): FormControl {
    return this.songForm.get('description') as FormControl;    
  }

  get imageUrl(): FormControl {
    return this.songForm.get('imageUrl') as FormControl;    
  }

  get audioUrl(): FormControl {
    return this.songForm.get('audioUrl') as FormControl;    
  }
}
