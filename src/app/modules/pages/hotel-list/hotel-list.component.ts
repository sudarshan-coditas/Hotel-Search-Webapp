import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Subscription, interval } from 'rxjs';
import { DataService } from 'src/app/services/data.service';
import { Router, Params, ActivatedRoute } from '@angular/router';
import { DEFAULT_INIT_HOTEL_SEARCH } from 'src/app/models/initHotelSearch.model';
import { PageEvent } from '@angular/material';
import { LoaderService } from 'src/app/core/services/loader.service';

export interface Pagination {
  pageNo: number;
  pageSize: number;
  orderBy: string;
}

@Component({
  selector: 'app-hotel-list',
  templateUrl: './hotel-list.component.html',
  styleUrls: ['./hotel-list.component.scss']
})
export class HotelListComponent implements OnInit, OnDestroy {
  sessionId: string;
  paging: Pagination = {
    pageNo: 1,
    pageSize: 10,
    orderBy: 'price asc, rating desc'
  };

  pagination: PageEvent = { length: 100, pageSize: 10, pageIndex: 1 };
  pageSizeOptions: number[] = [5, 10, 25, 100];

  subscription: Subscription;

  hotelListData: any;
  hotels: any;
  shareUrl: string;

  hotelListLocation: string;

  constructor(private http: HttpClient, private dataService: DataService, private router: Router, private route: ActivatedRoute) { }

  ngOnInit() {
    this.subscription = this.route.params.subscribe((params: any) => {
      this.sessionId = params.id;
      this.getStatusResult();
      this.shareUrl = location.origin + this.router.url;
      this.dataService.show(this.shareUrl);
    });
    this.hotelListLocation = this.dataService.getLocation();
  }

  getStatusResult() {
    const query = {
      sessionId: this.sessionId
    };
    const subscription = interval(5000).subscribe(timer =>
      this.dataService.checkHotelSearchStatus(query).subscribe((response: any) => {
        if (response.status === 'Complete') {
          this.getSearchResult();
          subscription.unsubscribe();
        }
      }
      ));
  }

  getSearchResult() {
    const query = DEFAULT_INIT_HOTEL_SEARCH;
    query.sessionId = this.sessionId;
    query.paging = this.paging;
    this.dataService.getHotelsList(query).subscribe((response: any) => {
      this.hotelListData = response;
      this.hotels = response.hotels;
      this.pagination.length = response.paging.totalRecords;
      this.pagination.pageIndex = response.paging.pageNo;
      this.pagination.pageSize = response.paging.pageSize;
    });
  }

  getPageEvent(pageEvent: PageEvent) {
    this.paging.pageNo = pageEvent.pageIndex !== 0  ? pageEvent.pageIndex : 1;
    this.paging.pageSize = pageEvent.pageSize;
    this.getSearchResult();
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
