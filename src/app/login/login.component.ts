import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  constructor(private fb: FormBuilder, private authService: AuthService) {
    this.loginForm = fb.group({
      'username': ['', [Validators.required]],
      'password': ['', [Validators.required]]
    })
   }

  ngOnInit(): void {
  }

  login() {
    return this.authService.login(this.loginForm.value).subscribe(data => {
      console.log(data);
      this.authService.saveToken(data['token']);
    })
  }

  get username(): FormControl {
    return this.loginForm.get('username') as FormControl;    
  }

  get password(): FormControl {
    return this.loginForm.get('password') as FormControl;
  }
}
