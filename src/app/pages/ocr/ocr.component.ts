import { Component, OnInit, ViewChild } from '@angular/core';
import { colors } from 'src/app/core/typescript/GLOBAL';

import { OcrC } from './ocr';

@Component({
  selector: 'app-ocr',
  templateUrl: './ocr.component.html',
  styleUrls: ['./ocr.component.scss'],
})
export class OCRComponent implements OnInit {
  @ViewChild('PantallaCamara', { static: true }) PantallaCamara: any;
  colorMsg = colors.white;
  msgWebS;

  constructor() {}

  ngOnInit(): void {}

  get_base64(base64) {
    // console.log('base64 --> ', base64);
    this.leerBase64(base64).then((res) => {
      if (res['is_valid']) {
      } else {
      }
    });
  }

  iniciarReconocimiento() {
    this.PantallaCamara.captureImage();
  }

  leerBase64(base64) {
    const promise = new Promise((resolve, reject) => {
      const obj = {};
      obj['requests'] = [];
      obj['requests'].push({
        features: [{ type: 'TEXT_DETECTION' }],
        image: { content: base64 },
      });

      console.log('obj --> ', obj);

      new OcrC().createOne(obj, null, 'externo').then(
        (res) => {
          console.log(res);
        },
        (err) => {},
      );
      resolve(true);
    });
    return promise;
  }
}
