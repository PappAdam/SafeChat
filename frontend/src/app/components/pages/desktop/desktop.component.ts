import { Component, OnInit } from '@angular/core';
import { ChatComponent } from '../chat/chat.component';
import { BrowserComponent } from '../browser/browser.component';
import { SettingsComponent } from '../settings/settings.component';

@Component({
  selector: 'app-desktop',
  templateUrl: './desktop.component.html',
  styleUrls: ['./desktop.component.scss'],
  imports: [ChatComponent, BrowserComponent, SettingsComponent],
})
export class DesktopComponent implements OnInit {
  constructor() {}

  ngOnInit() {}
}
