import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UtilitiesService {

  private documentClickedTargetSubject = new Subject<HTMLElement>();
  documentClickedTarget = this.documentClickedTargetSubject.asObservable(); 

  private fileUploadedEventSubject = new Subject<Event>();
  fileUploadedEvent = this.fileUploadedEventSubject.asObservable();

  constructor() { }

  nextElement(element: any) : void {
    this.documentClickedTargetSubject.next(element);
  }

  UploadedFileEvent(event: Event) {
    this.fileUploadedEventSubject.next(event);
  }
}
