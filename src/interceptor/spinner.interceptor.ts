import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse } from "@angular/common/http";
import { Observable, finalize, tap } from "rxjs";
import { LoadingService } from "../services/loading.service";
import { Injectable } from "@angular/core";

@Injectable()
export class SpinnerInterceptor implements HttpInterceptor {
  constructor(public loader: LoadingService){}
  private requestsInFlight: number = 0;
  
  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    this.requestsInFlight++;
    this.loader.show();

    return next.handle(req).pipe(
      tap(
        (event: HttpEvent<any>) => {
          if (event instanceof HttpResponse || event instanceof HttpErrorResponse) {
            this.requestsInFlight--;
            if (this.requestsInFlight === 0) {
             this.loader.hide();
            }
          }
        },
        (error: any) => {
          this.requestsInFlight--;
          if (this.requestsInFlight === 0) {
           this.loader.hide();
          }
        }
      )
    );
      }
    }
