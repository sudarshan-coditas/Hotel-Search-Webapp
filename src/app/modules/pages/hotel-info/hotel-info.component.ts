import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { DataService } from 'src/app/services/data.service';

@Component({
  selector: 'app-hotel-info',
  templateUrl: './hotel-info.component.html',
  styleUrls: ['./hotel-info.component.scss']
})
export class HotelInfoComponent implements OnInit {

  @Input() hotelList: any;

  constructor(private router: Router, private dataService: DataService) { }

  ngOnInit() { }

  getAddress(address) {
    return this.dataService.generateAddress(address);
  }

  getStar(rating) {
    return rating;
  }

  redirectTo(hotel) {
    this.dataService.setSelectedHotel(hotel);
    this.router.navigate(['/hotel/details/' + hotel.id]);
  }
}
