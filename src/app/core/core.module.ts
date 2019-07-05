import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatProgressSpinnerModule } from '@angular/material';
import { LoaderService } from './services/loader.service';
import { SpinnerComponent } from './spinner/spinner.component';


@NgModule({
  declarations: [
    SpinnerComponent
  ],
  imports: [
    CommonModule,
    MatProgressSpinnerModule,
  ],
  providers: [
    LoaderService,
  ],
  exports: [
    SpinnerComponent
  ]
})
export class CoreModule { }
