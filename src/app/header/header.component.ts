import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  isDropDownOpen = false;

  constructor(private authService: AuthService) { }

  ngOnInit(): void {
  }

  logout() {
    return this.authService.removeToken();
  }
}
