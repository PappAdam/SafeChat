import { Component, OnInit } from '@angular/core';
import {
  IonContent,
  IonHeader,
  IonIcon,
  IonTab,
  IonTabBar,
  IonTabButton,
  IonTabs,
  IonTitle,
  IonToolbar,
  AnimationController,
} from '@ionic/angular/standalone';

@Component({
  selector: 'app-browser',
  templateUrl: './browser.component.html',
  styleUrls: ['./browser.component.scss'],
  imports: [
    IonContent,
    IonHeader,
    IonIcon,
    IonTab,
    IonTabBar,
    IonTabButton,
    IonTabs,
    IonTitle,
    IonToolbar,
  ],
})
export class BrowserComponent implements OnInit {
  constructor(private animationCtrl: AnimationController) {}

  animateTabChange() {
    const animation = this.animationCtrl
      .create()
      .addElement(document.querySelector('ion-tab')!)
      .duration(500)
      .easing('ease-in-out')
      .fromTo('opacity', '0', '1')
      .fromTo('transform', 'translateX(100%)', 'translateX(0)');

    animation.play();
  }
  ngOnInit() {}
}
