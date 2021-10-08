import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  registerForm: FormGroup; 
  constructor(private fb: FormBuilder, private authService: AuthService) {
    this.registerForm = fb.group({
      'username': ['', [Validators.required]],
      'email': ['', [Validators.required]],
      'password': ['', [Validators.required]]
    })
   }

  ngOnInit(): void {
  }

  register() {
    return this.authService.register(this.registerForm.value).subscribe(data => {
      console.log(data);
    })
  }

  get username(): FormControl {
    return this.registerForm.get("username") as FormControl;
  }

  get email(): FormControl {
    return this.registerForm.get("email") as FormControl;
  }

  get password(): FormControl {
    return this.registerForm.get("password") as FormControl;
  }
}
