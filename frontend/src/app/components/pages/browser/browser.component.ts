import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { GroupCardComponent } from '../../group-card/group-card.component';
import { BrowserNavbarComponent } from '../../browser-navbar/browser-navbar.component';
@Component({
  selector: 'app-browser',
  templateUrl: './browser.component.html',
  styleUrls: ['./browser.component.scss'],
  imports: [RouterOutlet, GroupCardComponent, BrowserNavbarComponent],
})
export class BrowserComponent implements OnInit {
  ngOnInit() {}
}
