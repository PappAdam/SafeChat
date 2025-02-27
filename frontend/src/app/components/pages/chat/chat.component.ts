import { Component, OnInit } from '@angular/core';
import { ChatInputComponent } from '../../chat-input/chat-input.component';
import { ChatHeaderComponent } from '../../chat-header/chat-header.component';
import { MessageComponent } from '../../message/message.component';
@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss'],
  imports: [ChatInputComponent, ChatHeaderComponent, MessageComponent],
})
export class ChatComponent implements OnInit {
  constructor() {}

  ngOnInit() {}
}
