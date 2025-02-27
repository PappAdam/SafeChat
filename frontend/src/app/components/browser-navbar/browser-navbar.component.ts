import { Component, OnInit } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
@Component({
  selector: 'app-browser-navbar',
  templateUrl: './browser-navbar.component.html',
  styleUrls: ['./browser-navbar.component.scss'],
  imports: [MatIconModule],
})
export class BrowserNavbarComponent implements OnInit {
  constructor() {}

  ngOnInit() {}
}
