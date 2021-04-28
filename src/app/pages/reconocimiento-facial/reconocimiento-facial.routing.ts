import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ReconocimientoFacialComponent } from './reconocimiento-facial.component';

const routes: Routes = [
  {
    path: '',
    component: ReconocimientoFacialComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ReconocimientoFacialRoutingModule {}
