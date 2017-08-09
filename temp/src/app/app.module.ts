import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from './app.component';
import { Page2Component } from './page2/page2.component';
import { HomeComponent } from './home/home.component';
import { HignlightDirective } from './shared/hignlight.directive';
import { CurrencyPipe } from './shared/currency.pipe';
import { DropShapeDirective } from './shared/directives/drop-shape.directive';
import { DropShapeGroupDirective } from './shared/directives/drop-shape-group.directive';

@NgModule({
  declarations: [
    HignlightDirective,    
    DropShapeDirective,
    DropShapeGroupDirective,
    AppComponent,
    Page2Component,
    HomeComponent,
    CurrencyPipe
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
