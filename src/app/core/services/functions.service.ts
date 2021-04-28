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
