import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UtilitiesService {

  private documentClickedTargetSubject = new Subject<HTMLElement>();
  documentClickedTarget = this.documentClickedTargetSubject.asObservable(); 

  constructor() { }

  nextElement(element: any) : void {
    this.documentClickedTargetSubject.next(element);
  }
}
