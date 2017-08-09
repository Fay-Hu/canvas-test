import { Component, OnInit ,HostBinding} from '@angular/core';
import { Router } from '@angular/router';
import { trigger, transition, animate, style, state } from '@angular/animations';
@Component({
  selector: 'app-page2',
  templateUrl: './page2.component.html',
  styleUrls: ['./page2.component.css'],
  animations: [
    trigger('routeAnimation', [
    state('*',
      style({
        opacity: 1,
        transform: 'translateX(0)'
      })
    ),
    transition(':enter', [
      style({
        opacity: 0,
        transform: 'translateX(100%)'
      }),
      animate('0.5s ease-in')
    ]),
    transition(':leave', [
      animate('0.5s ease-out', style({
        opacity: 0,
        transform: 'translateX(-100%)'
      }))
    ])
  ])
  ],
  host: {
    '[style.background]':'"black"',
    '[style.display]':'"block"',
    "[style.position]":'"absolute"',
    '[@routeAnimation]': 'true'
  }
})
export class Page2Component implements OnInit {

  constructor(private router: Router) { }

  ngOnInit() {

  }

  back() {
    this.router.navigate(['../'])
  }

}
