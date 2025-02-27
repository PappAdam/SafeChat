import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.scss'],
})
export class MessageComponent implements OnInit {
  @Input() sender: string = '';
  @Input() first: string = '';
  @Input({ required: true }) msg: string = '';
  constructor() {}

  ngOnInit() {}
}
