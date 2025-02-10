import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TherapistsService {

  constructor() { }

  private therapistsSubject = new BehaviorSubject<any[]>([]);
  therapists$ = this.therapistsSubject.asObservable();

  updateTherapists(data: any[]) {
    this.therapistsSubject.next(data);
  }
}
