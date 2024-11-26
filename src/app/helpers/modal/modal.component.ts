import { Component, OnInit } from '@angular/core';
import {ModalService} from "./modal.service";
import {NgClass} from "@angular/common";

export type ModalConfig = {
  title: string,
  id: string,
  class?: string,
  size?: string,
  bodyText?: string,
  form?: any[],
  buttons?: any[],
}

@Component({
  selector: 'fg-modal',
  templateUrl: './modal.component.html',
  standalone: true,
  imports: [
    NgClass
  ],
  styleUrls: ['./modal.component.scss']
})
export class ModalComponent implements OnInit {

  show = false;
  config: ModalConfig | undefined;

  constructor(private modalService: ModalService) { }

  ngOnInit(): void {
    this.modalService.showSubscriber.subscribe(payload => {
      this.config = payload.config
      this.show = true;
    });
    this.modalService.closeRequest.subscribe(() => {
      this.close();
    })
  }

  close(): void {
    this.show = false;
  }

}
