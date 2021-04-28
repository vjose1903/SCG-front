import { HttpClient } from '@angular/common/http';
import { AfterViewInit, Component, OnInit } from '@angular/core';
import { FunctionsService } from './core/services/functions.service';
import { WebSocketService } from './core/services/web-socket.service';
import { SingletonService } from './core/services/singleton.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit, AfterViewInit {
  title = 'SCG-system-front';

  constructor(private ws: WebSocketService, private fun: FunctionsService, private http: HttpClient) {}

  ngOnInit() {
    window.onresize = this.resize.bind(this);
    SingletonService.http = this.http;
  }

  ngAfterViewInit() {
    this.resize();
  }

  resize() {
    this.fun.setWindowSize(window);
  }
}
