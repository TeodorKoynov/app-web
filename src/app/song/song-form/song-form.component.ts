import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { SongService } from '../song.service';

@Component({
  selector: 'app-song-form',
  templateUrl: './song-form.component.html',
  styleUrls: ['./song-form.component.css']
})
export class SongFormComponent implements OnInit {
  songForm: FormGroup; 
  constructor(private fb:FormBuilder, private songService: SongService) { 
    this.songForm = fb.group({
      'title' : ['', [Validators.required, Validators.maxLength(40)]],
      'description' : ['', [Validators.required, Validators.maxLength(2000)]],
      'imageUrl' : ['', [Validators.required]],
      'audioUrl' : ['', [Validators.required]],
    })
  }

  ngOnInit(): void {
  }

  create(): void {
    this.songService.create(this.songForm.value).subscribe(res => {
      console.log(res);
    }
      );
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
