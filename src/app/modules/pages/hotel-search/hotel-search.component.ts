import { Component, OnInit, ViewChild, Input, AfterViewInit } from '@angular/core';
import { FormGroup, FormBuilder, AbstractControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { google } from 'google-maps';

import { DataService } from '../../../services/data.service';
import { checkDateIsValid } from '../../../helpers/hotel-search.validators';
import { ValidatePlace } from '../../../helpers/hotel-search.validators';

export interface PlaceLocation {
  lat?: number;
  lng?: number;
  placeName?: string;
}
interface Traveller {
  type: string;
  age: number;
}

interface InitSerachforHotelsResponse {
  sessionId: string;
}

@Component({
  selector: 'app-hotel-search',
  templateUrl: './hotel-search.component.html',
  styleUrls: ['./hotel-search.component.scss']
})
export class HotelSearchComponent implements OnInit, AfterViewInit {
  @Input() adressType: string;
  @ViewChild('addresstext', { static: false }) addresstext: any;

  selectedValue: any;
  selectedHotel: any;
  searchForm: FormGroup;
  travellers: Traveller[];
  submitted = false;

  placeLocation: PlaceLocation = { lat: undefined, lng: undefined };
  google: google;

  autocompleteInput: string;
  queryWait: boolean;

  constructor(private fb: FormBuilder, private router: Router, private dataService: DataService) { }

  ngOnInit() {
    const checkOutDate = new Date(new Date().setDate(new Date().getDate() + 3));
    this.searchForm = this.fb.group({
      searchPlace: ['', [Validators.required, ValidatePlace(this.placeLocation)]],
      checkInDate: [new Date()],
      checkOutDate: [checkOutDate],
      traveller: []
    },
      {
        validator: checkDateIsValid('checkInDate', 'checkOutDate')
      }
    );

    this.travellers = [{
      type: 'Adult',
      age: 70
    },
    {
      type: 'Child',
      age: 10
    }];
    this.searchForm.get('traveller').setValue('Adult');
  }

  ngAfterViewInit() {
    this.getPlaceAutocomplete();
  }

  private getPlaceAutocomplete() {
    const autocomplete = new google.maps.places.Autocomplete(this.addresstext.nativeElement,
      {
        types: [this.adressType]
      });
    google.maps.event.addListener(autocomplete, 'place_changed', () => {
      const place = autocomplete.getPlace();
      if (place.hasOwnProperty('geometry') && place.geometry.hasOwnProperty('location')) {
        this.placeLocation.lat = place.geometry.location.lat();
        this.placeLocation.lng = place.geometry.location.lng();
        this.placeLocation.placeName = place.formatted_address;
        this.searchForm.controls.searchPlace.patchValue(place.formatted_address);
        this.searchForm.controls.searchPlace.updateValueAndValidity();
        this.dataService.setLocation(place.formatted_address);
      }
    });
  }

  onSubmit() {
    this.submitted = true;
    if (this.searchForm.invalid) {
      return;
    }

    const query = {
      lat: this.placeLocation.lat,
      long: this.placeLocation.lng,
      start: this.searchForm.controls.checkInDate.value,
      end: this.searchForm.controls.checkOutDate.value
    };

    this.dataService.initiateSerachforHotels(query).subscribe((response: InitSerachforHotelsResponse) => {
      const data = response;
      this.router.navigate(['/hotel/list', data.sessionId]);
    });
  }
}
