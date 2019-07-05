import { Component, OnInit, OnDestroy } from '@angular/core';
import { LoaderService, LoaderState } from './../services/loader.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-spinner',
  templateUrl: './spinner.component.html',
  styleUrls: ['./spinner.component.scss']
})
export class SpinnerComponent implements OnInit, OnDestroy {

  show: boolean;

  private subscription: Subscription;

  constructor(
    private loaderService: LoaderService
  ) {
    this.show = false;
  }

  ngOnInit() {
    this.subscription = this.loaderService.loaderState
      .subscribe((state: LoaderState) => {
        this.show = state.show;
      });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
