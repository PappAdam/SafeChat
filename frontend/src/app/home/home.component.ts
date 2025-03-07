import { Component, ViewChild, ElementRef } from '@angular/core';
import { AuthService } from '../services/http/auth.service';
import { MatButtonModule } from '@angular/material/button';
import { SocketService } from '../services/socket/socket.service';
import { PublicChatMessage } from '@common';
import { CommonModule } from '@angular/common';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';

@Component({
  selector: 'app-home',
  imports: [
    MatSidenavModule,
    MatListModule,
    MatButtonModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatInputModule,
    MatFormFieldModule,
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {
  @ViewChild('messagesContainer') private messagesContainer!: ElementRef;
  selectedChat: string = '';
  selectedChatIndex: number = -1;
  chatMessages: PublicChatMessage[] = [];
  messageControl = new FormControl('');

  constructor(
    private socketService: SocketService,
    public authService: AuthService
  ) {}

  ngAfterViewInit() {
    this.messagesContainer.nativeElement.addEventListener('scroll', () => {
      this.onScroll();
    });

    this.socketService.open$.subscribe((value) => {
      if (value) {
        this.chatMessages.splice(0, this.chatMessages.length);
        this.selectedChat = '';
      }
    });
  }

  onScroll() {
    const element = this.messagesContainer.nativeElement;
    if (element.scrollTop === 0) {
      // User has scrolled to the top, send a sync request
      this.socketService.createPackage({
        header: 'GetChatMessages',
        messageCount: 10,
        fromId: this.chatMessages[this.selectedChatIndex].messages[0].id,
        chatId: this.selectedChat,
      });
    }
  }

  async ngOnInit() {
    this.socketService.addPackageListener('ChatMessages', (pkg) => {
      pkg.chatMessages.forEach((chatmsg) => {
        const chatIndex = this.chatMessages.findIndex(
          (f) => f.chat.id === chatmsg.chat.id
        );
        if (chatIndex < 0) {
          this.chatMessages.push(chatmsg);
        } else if (
          chatmsg.messages.length &&
          chatmsg.messages[0].timeStamp >
            this.chatMessages[chatIndex].messages[
              this.chatMessages[chatIndex].messages.length - 1
            ].timeStamp
        ) {
          this.chatMessages[chatIndex].messages = [
            ...this.chatMessages[chatIndex].messages,
            ...chatmsg.messages,
          ];
          this.scrollToBottom();
        } else {
          this.chatMessages[chatIndex].messages = [
            ...chatmsg.messages,
            ...this.chatMessages[chatIndex].messages,
          ];
        }
      });

      if (this.chatMessages.length > 0 && !this.selectedChat) {
        this.selectedChat = this.chatMessages[0].chat.id;
        this.selectedChatIndex = 0;
        this.scrollToBottom();
      }
    });
  }

  get selectedChatMessages() {
    return (
      this.chatMessages.find((cm) => cm.chat.id === this.selectedChat)
        ?.messages || []
    );
  }

  selectChat(id: string) {
    this.selectedChat = id;
    this.selectedChatIndex = this.chatMessages.findIndex(
      (ch) => ch.chat.id == id
    );
  }

  sendMessage() {
    const message = this.messageControl.value?.trim();
    if (!message || !this.selectedChat) return;

    this.socketService.createPackage({
      header: 'NewMessage',
      chatId: this.selectedChat,
      messageContent: message,
    });
    this.messageControl.reset();
    this.scrollToBottom();
  }

  private scrollToBottom() {
    setTimeout(() => {
      if (this.messagesContainer) {
        this.messagesContainer.nativeElement.scrollTop =
          this.messagesContainer.nativeElement.scrollHeight;
      }
    }, 0);
  }

  // isOwnMessage(username: string): boolean {
  //   return username === this.authService.tok;
  // }
}
