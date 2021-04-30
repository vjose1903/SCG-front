import { Injectable } from '@angular/core';
import { Subject, Observable, Observer } from 'rxjs';
import { environment } from '../../../environments/environment';
import { FunctionsService } from './functions.service';
@Injectable({
  providedIn: 'root',
})
export class WebSocketService {
  ws: any;
  events: any = {};
  coneccion_correcta: boolean = false;
  timeOutReconnect: any = null;
  counterReconnet = 0;

  constructor(private fun: FunctionsService) {}

  private subject: Subject<MessageEvent>;

  public connect(force = false): Subject<MessageEvent> {
    if (!this.subject || force) {
      try {
        console.log('INTENTANDO CONECTARME');

        this.subject = this.create();
      } catch (error) {}
    }

    return this.subject;
  }

  private create(): Subject<MessageEvent> {
    // console.log('creando websocket');

    this.ws = new WebSocket(`ws://${environment.ms_url}/`);
    // this.ws = new WebSocket(`wss://${environment.ms_url}/`);

    let observable = Observable.create((obs: Observer<MessageEvent>) => {
      this.ws.onopen = (msg) => {
        console.log('CONEXION CON EL WEBSOCKET ABIERTA');
        this.sendMessage('process_image', { msg: 'Conectar' });
        this.counterReconnet = 0;
      };

      this.ws.onmessage = (msg) => {
        this.executeMessage(msg);
      };

      this.ws.onerror = (err) => {
        this.handler_error(err);
      };

      this.ws.onclose = (arg) => {
        console.log(`%c  ONCLOSE`, 'background: #00000000; color: #dc192c; font-size:2rem');
        this.reConnect(arg);
      };

      return this.ws.close.bind(this.ws);
    });

    let observer = {
      next: (data: Object) => {
        if (this.ws.readyState === WebSocket.OPEN) {
          this.ws.send(JSON.stringify(data));
        }
      },
    };
    return Subject.create(observer, observable);
  }

  public sendMessage(tipo, msg) {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(String(String(JSON.stringify({ type: tipo, data: msg }))));
    }
  }

  public handler_error(error) {
    console.error('error --> ', error);
  }

  public reConnect(arg) {
    this.coneccion_correcta = false;
    console.log('counterReconnet --> ', this.counterReconnet);

    if (this.counterReconnet <= 10 && this.ws.readyState !== WebSocket.OPEN) {
      setTimeout(() => {
        this.connect(true).toPromise();
      }, 2000);
      this.counterReconnet++;
    } else {
      this.counterReconnet = 0;

      console.log(' ');
      console.error(' NO SE PUEDE CONECTAR CON EL SERVIDOR WEBSOCKET');
      console.log(' ');
    }
  }

  public executeMessage(arg) {
    let data = this.fun.verificateJsonString(arg.data) ? JSON.parse(arg.data) : arg.data;

    this.handler_msg(data);
  }

  public handler_msg(data) {
    if (data.type === 'connect') {
      this.coneccion_correcta = true;
      console.warn(data.data);
    } else {
      if (this.events[data.type]) {
        this.events[data.type](data);
      } else {
        console.error(`No existe un evento con el tipo <<${data.type}>>`);
      }
    }
  }

  public addAction(name_action, metodo) {
    // console.log('añadiendo')
    this.events[name_action] = metodo;
  }

  public rmAction(name_action) {
    delete this.events[name_action];
  }
}
