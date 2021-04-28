import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { Routes, RouterModule } from "@angular/router";
import { AuthLayoutComponent } from "./auth-layout.component";
import { LoginComponent } from "../../pages/login/login.component";

const routes: Routes = [
  {
    path: "",
    component: AuthLayoutComponent,
    children: [
      {
        path: "login",
        loadChildren: () =>
          import("../../pages/login/login.module").then((m) => m.LoginModule),
      },
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
export class AuthLayoutRoutingModule {}
