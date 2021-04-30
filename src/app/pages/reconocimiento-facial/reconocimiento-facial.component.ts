import { Component, OnInit, ViewChild } from '@angular/core';
import { colors } from '../../core/typescript/GLOBAL';
@Component({
  selector: 'app-reconocimiento-facial',
  templateUrl: './reconocimiento-facial.component.html',
  styleUrls: ['./reconocimiento-facial.component.scss'],
})
export class ReconocimientoFacialComponent implements OnInit {
  @ViewChild('PantallaCamara', { static: true }) PantallaCamara: any;
  colorMsg = colors.white;
  msgWebS;

  constructor() {}

  ngOnInit(): void {}
  iniciarReconocimiento() {
    this.PantallaCamara.captureImage();
  }
}
