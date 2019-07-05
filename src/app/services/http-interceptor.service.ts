import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpInterceptor, HttpEvent, HttpResponse, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { finalize, catchError, map } from 'rxjs/operators';
import { LoaderService } from '../core/services/loader.service';

@Injectable({
  providedIn: 'root'
})
export class HttpInterceptorService implements HttpInterceptor {
  private requests: HttpRequest<any>[] = [];

  constructor(
    private loaderService: LoaderService
  ) { }

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    this.showLoader();

    const headers = {
      'oski-tenantId': 'Demo'
    };

    request = request.clone({
      setHeaders: headers
    });
    this.requests.push(request);
    return next
      .handle(request)
      .pipe(
        map(response => {
          if (response instanceof HttpResponse) {
            this._removeRequest(request);
            return response;
          }
        }),
        catchError(err => {
          this.onError(err);
          this._removeRequest(request);
          if (err instanceof HttpErrorResponse) {
          }
          return throwError(err);
        }),
        finalize(() => {
          this._removeRequest(request);
        })
      );
  }

  private _removeRequest(req: HttpRequest<any>) {
    const i = this.requests.indexOf(req);
    if (i >= 0) {
      this.requests.splice(i, 1);

    }
    if (this.requests.length > 0) {
      this.showLoader();
    } else {
      this.hideLoader();
    }
  }

  private onError(response: Response) {
    this.hideLoader();
  }


  private showLoader(): void {
    this.loaderService.show();
  }

  private hideLoader(): void {
    this.loaderService.hide();
  }
}
