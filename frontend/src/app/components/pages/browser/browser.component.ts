import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
@Component({
  selector: 'app-browser',
  templateUrl: './browser.component.html',
  styleUrls: ['./browser.component.scss'],
  imports: [RouterOutlet],
})
export class BrowserComponent implements OnInit {
  ngOnInit() {}
}
