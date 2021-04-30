import { filter } from 'rxjs/operators';
import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { Location, LocationStrategy, PathLocationStrategy, PopStateEvent } from '@angular/common';

import { Router, NavigationEnd, NavigationStart } from '@angular/router';
import { Subscription, Observable } from 'rxjs';
import PerfectScrollbar from 'perfect-scrollbar';
import { FunctionsService } from 'src/app/core/services/functions.service';
import { WebSocketService } from 'src/app/core/services/web-socket.service';
import { colors } from 'src/app/core/typescript/GLOBAL';

@Component({
  selector: 'app-admin-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss'],
})
export class AdminLayoutComponent implements OnInit {
  private _router: Subscription;
  private lastPoppedUrl: string;
  private yScrollStack: number[] = [];
  classContent: string;

  conPadd = ['reconocimiento_facial', 'ocr'];
  colorPad = { reconocimiento_facial: colors.black, ocr: colors.black };

  subWindowSize: Subscription;

  constructor(public location: Location, private router: Router, private fun: FunctionsService, public ws: WebSocketService) {
    router.events.subscribe((val) => {
      if (val instanceof NavigationEnd) {
        this.checkPadding();
      }
    });
  }

  ngOnInit() {
    const isWindows = navigator.platform.indexOf('Win') > -1 ? true : false;

    if (isWindows && !document.getElementsByTagName('body')[0].classList.contains('sidebar-mini')) {
      // if we are on windows OS we activate the perfectScrollbar function

      document.getElementsByTagName('body')[0].classList.add('perfect-scrollbar-on');
    } else {
      document.getElementsByTagName('body')[0].classList.remove('perfect-scrollbar-off');
    }
    const elemMainPanel = <HTMLElement>document.querySelector('.main-panel');
    const elemSidebar = <HTMLElement>document.querySelector('.sidebar .sidebar-wrapper');

    this.location.subscribe((ev: PopStateEvent) => {
      this.lastPoppedUrl = ev.url;
    });

    this.router.events.subscribe((event: any) => {
      if (event instanceof NavigationStart) {
        if (event.url != this.lastPoppedUrl) this.yScrollStack.push(window.scrollY);
      } else if (event instanceof NavigationEnd) {
        if (event.url == this.lastPoppedUrl) {
          this.lastPoppedUrl = undefined;
          window.scrollTo(0, this.yScrollStack.pop());
        } else window.scrollTo(0, 0);
      }
    });

    this._router = this.router.events.pipe(filter((event) => event instanceof NavigationEnd)).subscribe((event: NavigationEnd) => {
      elemMainPanel.scrollTop = 0;
      elemSidebar.scrollTop = 0;
    });

    if (window.matchMedia(`(min-width: 960px)`).matches && !this.isMac()) {
      let ps = new PerfectScrollbar(elemMainPanel);
      ps = new PerfectScrollbar(elemSidebar);
    }

    this.subWindowSize = this.fun.getWindowSize.subscribe((res) => {
      this.checkPadding();
    });
  }

  ngAfterViewInit() {
    this.runOnRouteChange();
    this.ws.connect().toPromise();
  }

  checkPadding() {
    const temp_url = document.location.href.split('app/');
    const url = temp_url[1].split('/');

    this.setPaddingContent(this.conPadd.includes(url[0]), this.colorPad[url[0]]);
  }

  setPaddingContent(lleva_padding, color?) {
    const nav_height = document.getElementById('my_navbar').offsetHeight;
    const array_styles = [
      { id: 'main-panel', styles: `padding-top: 0px ; background-color: transparent` },
      { id: 'my_navbar', styles: `position: none` },
    ];

    if (lleva_padding) {
      array_styles[0].styles = `padding-top: ${nav_height}px ${color ? `!important; background-color: ${color}` : ''}`;
      array_styles[1].styles = `position: absolute`;
    }

    array_styles.forEach((element) => {
      document.getElementById(element.id).setAttribute('style', element.styles);
    });
  }

  isMaps(path) {
    var titlee = this.location.prepareExternalUrl(this.location.path());
    titlee = titlee.slice(1);

    if (path == titlee) return false;
    else return true;
  }

  runOnRouteChange(): void {
    if (window.matchMedia(`(min-width: 960px)`).matches && !this.isMac()) {
      const elemMainPanel = <HTMLElement>document.querySelector('.main-panel');
      const ps = new PerfectScrollbar(elemMainPanel);
      ps.update();
    }
  }

  isMac(): boolean {
    let bool = false;
    if (navigator.platform.toUpperCase().indexOf('MAC') >= 0 || navigator.platform.toUpperCase().indexOf('IPAD') >= 0) {
      bool = true;
    }
    return bool;
  }
}
