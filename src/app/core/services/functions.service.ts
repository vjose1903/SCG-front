import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { BehaviorSubject } from 'rxjs';
import { Toast } from '../typescript/toast';
export const windowSize = new BehaviorSubject<any>(undefined);

@Injectable({
  providedIn: 'root',
})
export class FunctionsService {
  constructor(private messageService: MessageService, private router: Router) {}

  isMobile = {
    Android: () => {
      return navigator.userAgent.match(/Android/i);
    },
    BlackBerry: () => {
      return navigator.userAgent.match(/BlackBerry/i);
    },
    iOS: () => {
      return navigator.userAgent.match(/iPhone|iPad|iPod/i);
    },
    Opera: () => {
      return navigator.userAgent.match(/Opera Mini/i);
    },
    Windows: () => {
      return navigator.userAgent.match(/IEMobile/i) || navigator.userAgent.match(/WPDesktop/i);
    },
    any: () => {
      return this.isMobile.Android() || this.isMobile.iOS() || this.isMobile.BlackBerry() || this.isMobile.Opera() || this.isMobile.Windows();
    },
  };

  getWindowSize = windowSize.asObservable();

  verificateJsonString(text) {
    const res = /^[\],:{}\s]*$/.test(
      text
        .replace(/\\["\\\/bfnrtu]/g, '@')
        .replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, ']')
        .replace(/(?:^|:|,)(?:\s*\[)+/g, ''),
    );
    return res;
  }

  componentToHex(c) {
    var hex = c.toString(16);
    return hex.length == 1 ? '0' + hex : hex;
  }

  rgbToHex(r, g, b) {
    return '#' + this.componentToHex(r) + this.componentToHex(g) + this.componentToHex(b);
  }

  setWindowSize(nextValue) {
    windowSize.next(nextValue);
  }

  public logOut(): void {
    const array = ['access-token', 'client', 'content-type', 'expiry', 'token-type', 'uid', 'working-company'];
    for (const item of array) {
      localStorage.removeItem(item);
    }

    this.router.navigateByUrl('/auth/login');
  }

  newToast(args: Toast, auto = true) {
    this.messageService.add({ key: 'toast', severity: args.tipo, summary: args.titulo, detail: args.msg });
    const timeClear = args.timeClear ? args.timeClear : 2000;
    if (auto) setTimeout(() => this.messageService.clear(), timeClear);
  }
}
