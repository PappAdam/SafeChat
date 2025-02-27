import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-group-card',
  templateUrl: './group-card.component.html',
  styleUrls: ['./group-card.component.scss'],
})
export class GroupCardComponent implements OnInit {
  constructor() {}
  @Input() unread: string = '0';
  @Input({ required: true }) name: string = '';
  @Input({ required: true }) last_msg: string = '';
  @Input() status: string = '';

  ngOnInit() {}
}
