import * as Hammer from 'hammerjs';

import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';

import { Router } from '@angular/router';
import { TvShow } from './../../interfaces/user';

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss'],
})
export class CardComponent implements OnInit, AfterViewInit {
  @Input() tvShow: TvShow;
  @Input() idTvShowSelected: number;
  @Output() idTvShow = new EventEmitter<number>();
  isBack: boolean;

  cardOpen: boolean;
  shortOverview: string;
  clickTime: number;
  likeTv: boolean;
  saveTv: boolean;
  timeoutId: any;
  @ViewChild('myImage', { static: false }) myElementRef!: ElementRef;
  @ViewChild('myImage2', { static: false }) myElementRef2!: ElementRef;

  constructor(private _router: Router) {
    this.cardOpen = false;
    this.tvShow = {} as TvShow;

    this.isBack = true;
    this.clickTime = 0;

    this.shortOverview = '';
    this.idTvShowSelected = 0;
    this.likeTv = false;
    this.saveTv = false;
    this.timeoutId = 0;
  }

  ngOnInit(): void {}
  ngAfterViewInit() {
    // if (this.myElementRef) {
    //   const myElement = this.myElementRef.nativeElement;
    //   const hammer = new Hammer(myElement);
    //   hammer.get('press').set({ enable: true, time: 300 });
    //   hammer.get('press').recognizeWith([]);
    //   hammer.get('press').requireFailure('pan');
    //   hammer.get('press').requireFailure('tap');
    //   hammer.on('press', (event) => {
    //     event.preventDefault();
    //     this.toogleFlippCard();
    //   });
    //   hammer.on('tap', (event) => {
    //     console.log('tap');
    //     setTimeout(() => {
    //       this._router.navigate(['home/details/', this.tvShow.id]);
    //     }, 300);
    //   });
    //   hammer.on('pressup', (event) => {
    //     event.preventDefault();
    //   });
    // }
    // if (this.myElementRef2) {
    //   const myElement = this.myElementRef2.nativeElement;
    //   const hammer2 = new Hammer(myElement);
    //   hammer2.get('press').set({ enable: true, time: 300 });
    //   hammer2.get('press').recognizeWith([]);
    //   hammer2.get('press').requireFailure('pan');
    //   hammer2.get('press').requireFailure('tap');
    //   hammer2.on('press', (event) => {
    //     event.preventDefault();
    //   });
    //   hammer2.on('pressup', (event) => {
    //     event.preventDefault();
    //     setTimeout(() => {
    //       this.cardOpen = true;
    //     }, 200);
    //   });
    // }
  }

  toogleFlippCard() {
    console.log('toogleFlippCard');
    clearTimeout(this.timeoutId);
    if (this.idTvShowSelected !== this.tvShow.id) {
      this.isBack = false;
      this.cardOpen = false;
    }
    this.idTvShow.emit(this.tvShow.id);
    this.isBack = !this.isBack;

    this.timeoutId = setTimeout(() => {
      this.isBack = false;
      this.cardOpen = false;
    }, 2000);
  }
  toogleLikeOrSave(value: string) {
    console.log('toogleLikeOrSave');

    if (this.cardOpen) {
      value === 'like'
        ? (this.likeTv = !this.likeTv)
        : (this.saveTv = !this.saveTv);
    }
  }
  @HostListener('mouseup', ['$event'])
  onMouseUp(event: MouseEvent) {
    this.clickTime = event.timeStamp - this.clickTime;
    console.log(`Duración del clic: ${this.clickTime}ms`);
    if (this.clickTime < 200) {
      this._router.navigate(['home/details/', this.tvShow.id]);
    } else if (!this.cardOpen) {
      this.toogleFlippCard();
      setTimeout(() => {
        this.cardOpen = true;
      }, 200);
    }
  }

  onMouseDown(event: MouseEvent) {
    this.clickTime = event.timeStamp;
  }
  onContextMenu(event: MouseEvent) {
    console.log('Se previene el default');
    event.preventDefault();
    if (!this.cardOpen) {
      this.toogleFlippCard();
      setTimeout(() => {
        this.cardOpen = true;
      }, 200);
    }
  }
  onContextMenuBack(event: MouseEvent) {
    console.log('Se previene el default');
    event.preventDefault();
  }
}
