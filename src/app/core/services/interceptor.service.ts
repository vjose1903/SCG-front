// loader.interceptors.ts
import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
// import { NgxSpinnerService } from 'ngx-spinner';
import { catchError, finalize, map } from 'rxjs/operators';
import { FunctionsService } from './functions.service';
import { Toast } from '../typescript/toast';

@Injectable()
export class InterceptorService implements HttpInterceptor {
  requestCount: number = 0;
  constructor(private fun: FunctionsService) {}

  private startRequest(): void {
    // if (this.requestCount == 0) this.spinner.show();

    this.requestCount++;
  }

  private endRequest(args?): void {
    this.requestCount--;
    // if (this.requestCount == 0 && args !== 'no_hide') this.spinner.hide();
  }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    let spinner = request.params.get('spinner');

    if (spinner) request.params.delete('spinner'); // remove parameter spinner y no ejecuta el loader

    if (!spinner || spinner == 'no_hide') this.startRequest(); // Activa el spinner

    const token = localStorage.getItem('access-token');

    if (token) {
      request = request.clone({
        setHeaders: {
          'access-token': `${localStorage.getItem('access-token')}`,
          client: `${localStorage.getItem('client')}`,
          expiry: `${localStorage.getItem('expiry')}`,
          uid: `${localStorage.getItem('uid')}`,
          'token-type': `${localStorage.getItem('token-type')}`,
        },
      });
    }

    return next.handle(request).pipe(
      map((event) => {
        if (event instanceof HttpResponse) {
          console.log('event --> ', event);

          this.handler_msg(event.body.msg, 'success');
          ['access-token', 'client', 'expiry', 'token-type', 'uid'].forEach((header) => {
            const headerValue = event.headers.get(header);
            if (headerValue !== null && localStorage.getItem(header) == null) {
              localStorage.setItem(header, headerValue);
            }
          });
        }

        return event;
      }),

      catchError((response: HttpErrorResponse) => {
        this.handler_msg(response.error.msg, 'error');

        if (response.error.status === 500) this.handler_msg(['Error desconocido favor de comunicarse con el desarrollador.'], 'error');

        spinner = null;
        return throwError(response);
      }),
      finalize(() => {
        this.endRequest(spinner);
      }),
    );
  }

  handler_msg(menssages, tipo_) {
    for (let i = 0; i < menssages.length; i++) {
      const menssage = menssages[i];

      const obj: Toast = {
        tipo: tipo_,
        titulo: tipo_ === 'success' ? 'CORRECTO' : 'ERROR',
        msg: menssage,
      };
      this.fun.newToast(obj);
    }
  }
}
