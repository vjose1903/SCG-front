import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ChartsModule } from 'ng2-charts';
import { ToastrModule } from 'ngx-toastr';
import { DashboardComponent } from '../dashboard/dashboard.component';
import { IconsComponent } from '../icons/icons.component';
import { MapsComponent } from '../maps/maps.component';
import { NotificationsComponent } from '../notifications/notifications.component';
import { TableListComponent } from '../table-list/table-list.component';
import { TypographyComponent } from '../typography/typography.component';
import { UpgradeComponent } from '../upgrade/upgrade.component';
import { PersonaProfileComponent } from '../pages/persona-profile/persona-profile.component';
import { AdminLayoutComponent } from './admin-layout/layout.component';
import { FooterComponent } from './admin-layout/footer/footer.component';

import { NavbarComponent } from './admin-layout/navbar/navbar.component';
import { SidebarComponent } from './admin-layout/sidebar/sidebar.component';
import { LayoutRoutingModule } from './layout.routing';

@NgModule({
  declarations: [
    DashboardComponent,
    PersonaProfileComponent,
    AdminLayoutComponent,
    TableListComponent,
    UpgradeComponent,
    TypographyComponent,
    IconsComponent,
    MapsComponent,
    NotificationsComponent,
    FooterComponent,
    NavbarComponent,
    SidebarComponent,
  ],
  imports: [CommonModule, LayoutRoutingModule, FormsModule, RouterModule, ChartsModule, NgbModule, ToastrModule.forRoot()],
  exports: [
    DashboardComponent,
    PersonaProfileComponent,
    AdminLayoutComponent,
    TableListComponent,
    UpgradeComponent,
    TypographyComponent,
    IconsComponent,
    MapsComponent,
    NotificationsComponent,
    FooterComponent,
    NavbarComponent,
    SidebarComponent,
  ],
})
export class LayoutModule {}
