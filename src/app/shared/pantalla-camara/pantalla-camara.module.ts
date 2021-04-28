import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PantallaCamaraComponent } from './pantalla-camara.component';
import { WebcamModule } from 'ngx-webcam';
import { PantallaCamaraRoutingModule } from './pantalla-camara.routing';
import { ButtonModule } from 'primeng/button';
import { NgxImageCompressService } from 'ngx-image-compress';
@NgModule({
  declarations: [PantallaCamaraComponent],
  imports: [CommonModule, PantallaCamaraRoutingModule, WebcamModule, ButtonModule],
  exports: [PantallaCamaraComponent],
  providers: [NgxImageCompressService],
})
export class PantallaCamaraModule {}
