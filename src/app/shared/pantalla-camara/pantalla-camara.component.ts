import { AfterViewInit, Component, DoCheck, EventEmitter, Input, KeyValueDiffer, KeyValueDiffers, OnInit, Output } from '@angular/core';
import { NgxImageCompressService } from 'ngx-image-compress';
import { WebcamImage, WebcamInitError, WebcamUtil } from 'ngx-webcam';
import { Observable, Subject } from 'rxjs';
import { FunctionsService } from '../../core/services/functions.service';
import { colors } from '../../core/typescript/GLOBAL';
import { WebSocketService } from '../../core/services/web-socket.service';

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
  msgWebS;
  colorMsg = colors.white;

  ngOnInit() {
    this.ws.addAction('res_message', (data) => {
      this.msgWebS = data;
      this.colorMsg = colors[data.color];
    });

    this.ws.addAction('res_process_image', (data) => {
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
      this.listaCamaras = mediaDevices;
      this.multipleWebcamsAvailable = mediaDevices && mediaDevices.length > 1;
      if (this.multipleWebcamsAvailable) {
        this.setDefaultCamara();
      } else {
        this.initCamara = true;
      }
    });

    this.subWindowSize = this.fun.getWindowSize.subscribe((res) => {
      const w = document.getElementById('main-panel');
      this.ventana = {
        width: w.offsetWidth,
        height: w.offsetHeight,
      };
      res;
    });
  }

  ngDoCheck() {
    const change = this.differ.diff(this);
    if (change) {
      change.forEachChangedItem((item) => {
        if (item.key === 'initCamara' && item.currentValue) this.setPaddingContent();
      });
    }
  }

  setPaddingContent() {
    const nav_height = document.getElementById('my_navbar').offsetHeight;
    document.getElementById('camara_content').setAttribute('style', `padding-top: ${nav_height}px !important;`);
  }

  captureImage() {
    console.log('------ captureImage ------');
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

  p() {
    this.initCamara = !this.initCamara;
  }

  p2() {
    this.initCamara = true;
  }

  ngAfterViewInit() {}

  cameraWasSwitched(deviceId: string): void {
    this.deviceId = deviceId;
  }

  handleInitError(error: WebcamInitError): void {
    this.errors.push(error);
  }

  public showNextWebcam(directionOrDeviceId: boolean | string): void {
    // true => move forward through devices
    // false => move backwards through devices
    // string => move to device with given deviceId

    this.nextWebcam.next(directionOrDeviceId);
  }

  get triggerObservable(): Observable<void> {
    return this.trigger.asObservable();
  }

  handleImage(webcamImage: WebcamImage): void {
    const base64 = webcamImage.imageAsDataUrl;

    this.compressImg(base64).then((compress) => {
      // this.get_base64.emit(compress.img);
      switch (this.tipo) {
        case 'face':
          this.ws.sendMessage('process_image', { msg: compress.img });
          break;

        case 'ocr':
          this.ws.sendMessage('process_placa', { msg: compress.img });
          break;

        default:
          break;
      }
    });
  }

  get nextWebcamObservable(): Observable<boolean | string> {
    return this.nextWebcam.asObservable();
  }

  async compressImg(image): Promise<any> {
    var promise = new Promise(async (resolve, reject) => {
      const orientation = await this.imgComp.getOrientation(image);

      this.imgComp.compressFile(image, orientation, 100, 40).then((result) => {
        resolve({ img: result, size: this.imgComp.byteCount(result) });
      });
    });
    return promise;
  }

  triggerSnapshot(): void {
    this.trigger.next();
  }
}
