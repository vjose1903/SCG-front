import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ReconocimientoFacialRoutingModule } from './reconocimiento-facial.routing';
import { ReconocimientoFacialComponent } from './reconocimiento-facial.component';
import { PantallaCamaraModule } from '../../shared/pantalla-camara/pantalla-camara.module';

@NgModule({
  declarations: [ReconocimientoFacialComponent],
  imports: [CommonModule, ReconocimientoFacialRoutingModule, PantallaCamaraModule],
})
export class ReconocimientoFacialModule {}
