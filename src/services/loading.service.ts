import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';

@Injectable({
  providedIn: 'root'
})
export class LoadingService {
  private loading = new BehaviorSubject<boolean>(true);
  public readonly loading$ = this.loading.asObservable();

  constructor() { }

  show = () => this.loading.next(true);
  hide = () => this.loading.next(false);

}
