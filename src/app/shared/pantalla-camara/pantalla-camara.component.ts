import { AfterViewInit, Component, DoCheck, EventEmitter, Input, KeyValueDiffer, KeyValueDiffers, OnInit, Output } from '@angular/core';
import { NgxImageCompressService } from 'ngx-image-compress';
import { WebcamImage, WebcamInitError, WebcamUtil } from 'ngx-webcam';
import { Observable, Subject } from 'rxjs';
import { FunctionsService } from '../../core/services/functions.service';
import { colors } from '../../core/typescript/GLOBAL';
import { WebSocketService } from '../../core/services/web-socket.service';
import * as _ from 'lodash';
import { Toast } from 'src/app/core/typescript/toast';

@Component({
  selector: 'pantalla-camara',
  templateUrl: './pantalla-camara.component.html',
  styleUrls: ['./pantalla-camara.component.scss'],
})
export class PantallaCamaraComponent implements OnInit, AfterViewInit, DoCheck {
  subWindowSize: any;
  listaCamaras: MediaDeviceInfo[];
  initCamara: boolean = false;
  pos: any;
  differ: KeyValueDiffer<string, any>;

  @Input() colorMsg = colors.white;
  @Output() colorMsgChange = new EventEmitter<any>(null);
  @Input() msgWebS = '';
  @Output() msgWebSChange = new EventEmitter<any>(null);

  @Input() tipo;
  @Output() get_base64 = new EventEmitter<any>(null);

  constructor(
    public ws: WebSocketService,
    private fun: FunctionsService,
    private imgComp: NgxImageCompressService,
    private differs: KeyValueDiffers,
  ) {
    this.differ = this.differs.find({}).create();
  }

  public showWebcam = true;
  public allowCameraSwitch = true;
  public multipleWebcamsAvailable = false;
  public deviceId: string;

  public videoOptions: MediaTrackConstraints = {
    // width: {ideal: 1024},
    // height: {ideal: 576}
  };

  errors = [];
  webcamImage: WebcamImage = null;
  trigger: Subject<void> = new Subject<void>();
  nextWebcam: Subject<boolean | string> = new Subject<boolean | string>();
  ventana;
  flip = false;

  mirrorImage = 'never';

  ngOnInit() {
    this.ws.addAction('res_message', (data) => {
      this.msgWebS = data;
      this.msgWebSChange.emit(this.msgWebS);

      this.colorMsg = colors[data.color];
      this.colorMsgChange.emit(this.colorMsg);
    });

    this.ws.addAction('res_process_image', (data) => {
      console.log('enviando imagen');
      this.triggerSnapshot();
    });

    this.ws.addAction('res_message_placa', (data) => {
      console.log(data);
    });

    this.ws.addAction('res_pos_cara', (data) => {
      this.pos = data.posiciones;
      if (data.posiciones) {
        const dim = this.getAspectDimensions();

        const signo = dim.dividir ? '/=' : '*=';

        this.pos['y'] -= 50;
        this.pos['x'] -= 10;
        this.pos['w'] += 15;
        this.pos['h'] += 10;

        this.pos['w'] = Math.abs(this.pos['w'] - this.pos['x']);
        this.pos['h'] = Math.abs(this.pos['h'] - this.pos['y']);

        eval(`this.pos['y'] ${signo} dim.aspect`);
        eval(`this.pos['x'] ${signo} dim.aspect`);
        eval(`this.pos['w'] ${signo} dim.aspect`);
        eval(`this.pos['h'] ${signo} dim.aspect`);
      }
    });

    WebcamUtil.getAvailableVideoInputs().then((mediaDevices: MediaDeviceInfo[]) => {
      // this.listaCamaras = this.checkForOnlyOneFrontAndBack(mediaDevices);
      this.listaCamaras = mediaDevices;
      console.log('this.listaCamaras --> ', this.listaCamaras);

      this.multipleWebcamsAvailable = this.listaCamaras && this.listaCamaras.length > 1;

      if (this.multipleWebcamsAvailable) this.setDefaultCamara();
      else {
        //
        if (this.listaCamaras.length > 0) this.initCamara = true;
        else {
          const obj: Toast = { tipo: 'warning', titulo: 'AVISO', msg: 'El sistema no pudo detectar las camaras' };
          this.fun.newToast(obj);
          this.initCamara = false;
        }
      }
    });

    320;

    this.subWindowSize = this.fun.getWindowSize.subscribe((res) => {
      const w = document.getElementById('main-panel');
      this.ventana = {
        width: w.offsetWidth,
        height: w.offsetHeight,
      };
      res;
    });
  }

  get getIsMirror(): any {
    const actualCam = this.getActualCam();
    if (this.listaCamaras.length === 0) return 'never';
    console.log(this.checkIfStringHas('front', actualCam.label) ? 'always' : 'never');

    return this.checkIfStringHas('front', actualCam.label) ? 'always' : 'never';
  }

  getActualCam() {
    const actualCam = _.find(this.listaCamaras, (cam) => {
      return cam.deviceId === this.deviceId;
    });
    return actualCam;
  }

  checkIfStringHas(target, source) {
    const verify = _.replace(source.toLowerCase(), target, 'si lo es');
    return verify.toLowerCase() === source.toLowerCase() ? false : true;
  }

  checkForOnlyOneFrontAndBack(camaras) {
    const camsAllow = {};
    let count = 0;

    const unicos = camaras.filter((cam) => {
      let where = this.checkIfStringHas('front', cam.label) ? 'front' : this.checkIfStringHas('back', cam.label) ? 'back' : 'otro';

      if (where === 'otro') {
        where += `_${count}`;
        count += 1;
      }

      return camsAllow.hasOwnProperty(where) ? false : (camsAllow[where] = true);
    });

    return unicos;
  }

  ngDoCheck() {
    const change = this.differ.diff(this);
    if (change) {
      change.forEachChangedItem((item) => {
        if (item.key === 'initCamara' && item.currentValue) {
          // this.setPaddingContent();
          this.checkForOnlyOneFrontAndBack(this.listaCamaras);
        }
        if (item.key === 'deviceId' && item.currentValue) {
          this.flipCam();
        }
      });
    }
  }

  captureImage() {
    this.triggerSnapshot();
  }

  getAspectDimensions() {
    const webcam_wrapper = document.getElementsByClassName('webcam-wrapper')[0];
    if (webcam_wrapper) {
      const video = webcam_wrapper.firstChild as any;
      const canvas = webcam_wrapper.lastChild as any;

      const videoGrande = video.width > canvas.width;
      const aspect = videoGrande ? canvas.width / video.width : video.width / canvas.width;
      const obj = { dividir: videoGrande, aspect };
      return obj;
    }
  }

  setDefaultCamara() {
    const Logitec = this.listaCamaras.filter((cam) => cam.label === 'Logitech BRIO (046d:085e)')[0];

    if (Logitec) {
      if (!this.initCamara) this.initCamara = true;
      setTimeout(() => this.showNextWebcam(Logitec.deviceId), 250);
    } else {
      this.initCamara = true;
    }
  }

  handleInitError(error: WebcamInitError): void {
    this.errors.push(error);
  }

  ngAfterViewInit() {}

  cameraWasSwitched(deviceId: string): void {
    console.log(1);
    this.deviceId = deviceId;
  }

  flipCam() {
    if (!this.fun.isMobile.any()) {
      const webCam_wrapper = document.getElementsByClassName('webcam-wrapper')[0].firstChild as any;
      console.log(webCam_wrapper.firstChild);
      webCam_wrapper.setAttribute('style', 'transform: scaleX(-1)');
    }
  }

  getNextCamara() {}

  get nextWebcamObservable(): Observable<boolean | string> {
    return this.nextWebcam.asObservable();
  }

  public showNextWebcam(directionOrDeviceId: boolean | string): void {
    console.log(2);

    // true => move forward through devices
    // false => move backwards through devices
    // string => move to device with given deviceId

    this.nextWebcam.next(directionOrDeviceId);
  }

  handleImage(webcamImage: WebcamImage): void {
    const base64 = webcamImage.imageAsDataUrl;

    this.compressImg(base64).then((compress) => {
      switch (this.tipo) {
        case 'face':
          this.ws.sendMessage('process_image', { msg: compress.img });
          break;

        case 'ocr':
          // this.ws.sendMessage('process_placa', { msg: compress.img });
          const base64 = compress.img.split('base64,');
          this.get_base64.emit(base64[1]);

          break;

        default:
          break;
      }
    });
  }

  async compressImg(image): Promise<any> {
    var promise = new Promise(async (resolve, reject) => {
      const orientation = await this.imgComp.getOrientation(image);

      this.imgComp.compressFile(image, orientation, 100, 70).then((result) => {
        resolve({ img: result, size: this.imgComp.byteCount(result) });
      });
    });
    return promise;
  }

  triggerSnapshot(): void {
    this.trigger.next();
  }

  get triggerObservable(): Observable<void> {
    return this.trigger.asObservable();
  }
}
