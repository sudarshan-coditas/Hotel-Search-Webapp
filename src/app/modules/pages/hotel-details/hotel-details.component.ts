import { Component, OnInit, ViewChild } from '@angular/core';
import { DataService } from 'src/app/services/data.service';
import { ImageGallaryComponent } from 'src/app/shared/components/image-gallary/image-gallary.component';
import { GALLERY_CONF, GALLERY_IMAGE } from 'src/app/shared/components/image-gallary/interfaces';
import { DEMO_GALLERY_CONF_INLINE } from 'src/app/shared/components/image-gallary/constants';
import { Router } from '@angular/router';

@Component({
  selector: 'app-hotel-details',
  templateUrl: './hotel-details.component.html',
  styleUrls: ['./hotel-details.component.scss']
})
export class HotelDetailsComponent implements OnInit {
  @ViewChild('imageGallery', { static: false }) ngxImageGallery: ImageGallaryComponent;

  hotelDetails: any;

  conf: GALLERY_CONF;
  images: GALLERY_IMAGE[];

  public showConf = true;

  constructor(private dataService: DataService, private router: Router) { }

  ngOnInit() {
    this.hotelDetails = this.dataService.getSelectedHotel();
    if (this.hotelDetails === undefined) {
      this.router.navigate(['/hotel/search/'], { replaceUrl: true });
    }
    this.conf = DEMO_GALLERY_CONF_INLINE;
    this.images = this.hotelDetails.images;
  }

  getAddress(address) {
    return this.dataService.generateAddress(address);
  }

  openGallery(index: number = 0) { }

  // close gallery
  closeGallery() { }

  newImage(index: number = 0) { }


  nextImage() {
    this.ngxImageGallery.next();
  }

  prevImage() {
    this.ngxImageGallery.prev();
  }

  galleryOpened(index) {
    console.log('Gallery opened at index ', index);
  }

  galleryClosed() {
    console.log('Gallery closed.');
  }

  galleryImageClicked(index) {
    console.log('Gallery image clicked with index ', index);
  }

  galleryImageChanged(index) {
    console.log('Gallery image changed to index ', index);
  }

  deleteImage(index) {
    console.log('Delete image at index ', index);
  }
}
