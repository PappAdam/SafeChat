import { Component } from '@angular/core';
import { IonApp, IonRouterOutlet } from '@ionic/angular/standalone';
import { BrowserComponent } from './components/pages/browser/browser.component';
import { ChatComponent } from './components/pages/chat/chat.component';
import { SettingsComponent } from './components/pages/settings/settings.component';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrl: 'app.component.scss',
  imports: [
    IonApp,
    IonRouterOutlet,
    ChatComponent,
    BrowserComponent,
    SettingsComponent,
  ],
})
export class AppComponent {
  constructor() {}
}
