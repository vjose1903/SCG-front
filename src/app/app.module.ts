import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AppRoutingModule } from './app.routing';
import { AppComponent } from './app.component';
import { CoreModule } from './core/core.module';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { InterceptorService } from './core/services/interceptor.service';
@NgModule({
  imports: [BrowserAnimationsModule, FormsModule, HttpClientModule, RouterModule, AppRoutingModule, NgbModule, CoreModule, ToastModule],
  declarations: [AppComponent],
  providers: [MessageService, { provide: HTTP_INTERCEPTORS, useClass: InterceptorService, multi: true }],
  bootstrap: [AppComponent],
})
export class AppModule {}
