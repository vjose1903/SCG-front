import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { OCRRoutingModule } from './ocr.routing';
import { OCRComponent } from '../ocr/ocr.component';
import { PantallaCamaraModule } from 'src/app/shared/pantalla-camara/pantalla-camara.module';

@NgModule({
  declarations: [OCRComponent],
  imports: [CommonModule, OCRRoutingModule, PantallaCamaraModule],
})
export class OCRModule {}
