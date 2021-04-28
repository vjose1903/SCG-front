import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PantallaCamaraComponent } from './pantalla-camara.component';

const routes: Routes = [
  {
    path: '',
    component: PantallaCamaraComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PantallaCamaraRoutingModule {}
