import { Component, HostListener } from '@angular/core';
import { UtilitiesService } from './services/utilities.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  title = 'app-front-end';

  constructor(private utilitiesService: UtilitiesService) {}

  @HostListener('document:click', ['$event'])
  documentClick(event: any): void {
    this.utilitiesService.nextElement(event.target);
  }
}
