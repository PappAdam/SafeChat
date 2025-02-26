import { Component, OnInit } from '@angular/core';
import { ChatInputComponent } from '../../chat-input/chat-input.component';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss'],
  imports: [ChatInputComponent],
})
export class ChatComponent implements OnInit {
  constructor() {}

  ngOnInit() {}
}
