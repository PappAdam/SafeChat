import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { GroupCardComponent } from '../../group-card/group-card.component';

@Component({
  selector: 'app-browser',
  templateUrl: './browser.component.html',
  styleUrls: ['./browser.component.scss'],
  imports: [RouterOutlet, GroupCardComponent],
})
export class BrowserComponent implements OnInit {
  ngOnInit() {}
}
