import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ImageGallaryComponent } from './components/image-gallary/image-gallary.component';
import { ClickOutsideDirective } from './directives/click-outside.directive';
import { KeysPipe } from './pipe/keys.pipe';

@NgModule({
  declarations: [ImageGallaryComponent, ClickOutsideDirective, KeysPipe],
  imports: [
  CommonModule,
  ],
  exports: [ImageGallaryComponent, ClickOutsideDirective, KeysPipe],
})
export class SharedModule { }
