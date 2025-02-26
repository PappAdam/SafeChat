import { Component, OnInit } from '@angular/core';
import { ChatComponent } from '../pages/chat/chat.component';
import { BrowserComponent } from '../pages/browser/browser.component';
import { SettingsComponent } from '../pages/settings/settings.component';

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
