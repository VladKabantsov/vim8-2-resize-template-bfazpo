import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { HelloComponent } from './hello.component';
import { TestComponent } from './test.component';

import { ViewportModule } from './viewport/viewport.module';
import { environment } from './environments/environment';

@NgModule({
  imports:      [
    BrowserModule,
    FormsModule,
    ViewportModule.forRoot(environment.config)
  ],
  declarations: [ AppComponent, HelloComponent, TestComponent ],
  bootstrap:    [ AppComponent ],
})
export class AppModule { }
