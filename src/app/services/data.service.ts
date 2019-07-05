import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ApiEndPoints } from './../helpers/api.constant';
import { DEFAULT_INIT_HOTEL_SEARCH } from '../models/initHotelSearch.model';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  endPoint: ApiEndPoints;
  selectedHotel: any;
  sessionId: string;
  searchedArea: string;

  shareUrlSubject = new Subject();
  shareUrl = this.shareUrlSubject.asObservable();

  constructor(private http: HttpClient) { }

  show(data) {
      this.shareUrlSubject.next(data);
  }

  initiateSerachforHotels(data) {
    const query = DEFAULT_INIT_HOTEL_SEARCH;
    query.stayPeriod.start = data.start;
    query.stayPeriod.end = data.end;
    query.bounds.circle.center.lat = data.lat;
    query.bounds.circle.center.long  = data.long;
    return this.http.post(ApiEndPoints.HOTEL_SEARCH_INIT, query);
  }

  setSelectedHotel(hotel) {
    this.selectedHotel = hotel;
  }

  getSelectedHotel() {
    return this.selectedHotel;
  }

  setLocation(location: string) {
    this.searchedArea = location;
  }

  getLocation() {
    return this.searchedArea;
  }

  checkHotelSearchStatus(query) {
    return this.http.post(ApiEndPoints.HOTEL_SEARCH_STATUS, query);
  }

  getHotelsList(query) {
    return this.http.post(ApiEndPoints.HOTEL_SEARCH_RESULTS, query);
  }

  generateAddress(address) {
    return `${address.line1} ${address.line2} , ${address.city.name} ${address.state.name} ${address.postalCode}`;
  }
}
