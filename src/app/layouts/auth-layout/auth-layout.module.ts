import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { AuthLayoutComponent } from "./auth-layout.component";
import { AuthLayoutRoutingModule } from "./auth-layout.routing";
import { RouterModule } from "@angular/router";

@NgModule({
  declarations: [AuthLayoutComponent],
  imports: [CommonModule, AuthLayoutRoutingModule, RouterModule],
})
export class AuthLayoutModule {}
