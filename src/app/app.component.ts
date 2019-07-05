import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { DataService } from './services/data.service';
import { MatSnackBar } from '@angular/material';
import { Router, NavigationEnd } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'hotels-search';
  showUrl: boolean;
  shareUrl: string;
  activatedUrl: string;

  constructor(
    private dataService: DataService,
    private cdr: ChangeDetectorRef,
    private snackBar: MatSnackBar,
    private router: Router
  ) { }

  ngOnInit() {
    this.dataService.shareUrl.subscribe((response: any) => {
      this.showUrl = true;
      this.shareUrl = response;
      this.cdr.detectChanges();
    });
    this.router.events.subscribe((event: any) => {
      if (event instanceof NavigationEnd) {
        if (event.url && (event.url === '/' || event.url === '/hotel/search')) {
          this.showUrl = false;
        }
      }
    });
  }

  copyInputMessage(text) {
    const selBox = document.createElement('textarea');
    selBox.style.position = 'fixed';
    selBox.style.left = '0';
    selBox.style.top = '0';
    selBox.style.opacity = '0';
    selBox.value = text;
    document.body.appendChild(selBox);
    selBox.focus();
    selBox.select();
    document.execCommand('copy');
    document.body.removeChild(selBox);
    this.openSnackBar();
  }

  openSnackBar() {
    this.snackBar.open('Copied!', '', { duration: 1000, verticalPosition: 'bottom' });
  }
}
