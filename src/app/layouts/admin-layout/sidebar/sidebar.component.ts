import { Component, OnInit } from '@angular/core';

declare interface RouteInfo {
  path: string;
  title: string;
  icon: string;
  class: string;
}
export const ROUTES: RouteInfo[] = [
  { path: '/app/dashboard', title: 'Dashboard', icon: 'fas fa-chart-pie', class: '' },
  { path: '/app/reconocimiento_facial', title: 'Reconocimiento Facial', icon: 'far fa-smile', class: '' },
  // { path: '/app/ocr', title: 'Lectura de placas', icon: 'fas fa-underline', class: '' },

  // { path: "/icons", title: "Icons", icon: "education_atom", class: "" },
  // { path: "/maps", title: "Maps", icon: "location_map-big", class: "" },
  // {
  //   path: "/notifications",
  //   title: "Notifications",
  //   icon: "ui-1_bell-53",
  //   class: "",
  // },

  // {
  //   path: "/user-profile",
  //   title: "User Profile",
  //   icon: "users_single-02",
  //   class: "",
  // },
  // {
  //   path: "/table-list",
  //   title: "Table List",
  //   icon: "design_bullet-list-67",
  //   class: "",
  // },
  // {
  //   path: "/typography",
  //   title: "Typography",
  //   icon: "text_caps-small",
  //   class: "",
  // },
  // {
  //   path: "/upgrade",
  //   title: "Upgrade to PRO",
  //   icon: "objects_spaceship",
  //   class: "active active-pro",
  // },
];

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
})
export class SidebarComponent implements OnInit {
  menuItems: any[];

  constructor() {}

  ngOnInit() {
    this.menuItems = ROUTES.filter((menuItem) => menuItem);
  }
  isMobileMenu() {
    if (window.innerWidth > 991) {
      return false;
    }
    return true;
  }
}
