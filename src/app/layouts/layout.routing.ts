import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { Routes, RouterModule } from '@angular/router';
import { DashboardComponent } from '../dashboard/dashboard.component';
import { IconsComponent } from '../icons/icons.component';
import { MapsComponent } from '../maps/maps.component';
import { NotificationsComponent } from '../notifications/notifications.component';
import { TableListComponent } from '../table-list/table-list.component';
import { TypographyComponent } from '../typography/typography.component';
import { UpgradeComponent } from '../upgrade/upgrade.component';
import { PersonaProfileComponent } from '../pages/persona-profile/persona-profile.component';
import { AdminLayoutComponent } from './admin-layout/layout.component';

const routes: Routes = [
  {
    path: '',
    component: AdminLayoutComponent,
    children: [
      {
        path: 'reconocimiento_facial',
        loadChildren: () => import('../pages/reconocimiento-facial/reconocimiento-facial.module').then((m) => m.ReconocimientoFacialModule),
      },
      { path: 'ocr', loadChildren: () => import('../pages/ocr/ocr.module').then((m) => m.OCRModule) },
      { path: 'dashboard', component: DashboardComponent },
      { path: 'user-profile', component: PersonaProfileComponent },
      { path: 'table-list', component: TableListComponent },
      { path: 'typography', component: TypographyComponent },
      { path: 'icons', component: IconsComponent },
      { path: 'maps', component: MapsComponent },
      { path: 'notifications', component: NotificationsComponent },
      { path: 'upgrade', component: UpgradeComponent },
    ],

  },
];

// export const routes: Routes = [
//   { path: "dashboard", component: DashboardComponent },
//   { path: "user-profile", component: PersonaProfileComponent },
//   { path: "table-list", component: TableListComponent },
//   { path: "typography", component: TypographyComponent },
//   { path: "icons", component: IconsComponent },
//   { path: "maps", component: MapsComponent },
//   { path: "notifications", component: NotificationsComponent },
//   { path: "upgrade", component: UpgradeComponent },
// ];

@NgModule({
  imports: [CommonModule, RouterModule.forChild(routes)],
  exports: [],
})
export class LayoutRoutingModule {}
