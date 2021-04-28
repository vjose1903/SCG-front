import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { OCRComponent } from './ocr.component';

const routes: Routes = [
  {
    path: '',
    component: OCRComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class OCRRoutingModule {}
