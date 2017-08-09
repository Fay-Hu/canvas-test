import { Component, OnInit } from '@angular/core';

import { HignlightDirective } from './../shared/hignlight.directive';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  host:{
    "[style.position]":'"absolute"'
  }
})
export class HomeComponent implements OnInit {

  activeIndex:number = 0;
  constructor() { }

  ngOnInit() {
  }

}
