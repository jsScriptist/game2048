import {Component, HostListener, OnInit} from '@angular/core';
import {Item} from '../../models/item';
import {GameService} from '../../services/game.service';

const colorMap: {[k: number]: string} = {
  2: '#FF5733',
  4: '#FF8933',
  8: '#c4961a',
  16: '#bebb08',
  32: '#84990c',
  64: '#3d960d',
  128: '#0b8854',
  256: '#089398',
  512: '#3385FF',
  1024: '#3338FF',
  2048: '#8A33FF'
};

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.css']
})
export class GameComponent implements OnInit {
  keyEventCodMap: {[type: string]: string} = {
    ArrowUp: 'up',
    ArrowDown: 'down',
    ArrowLeft: 'left',
    ArrowRight: 'right'
  };
  constructor(public gameService: GameService) { }
  ngOnInit(): void {
  }
  getStyles(item: Item): {[p: string]: string} {
    const top = (item.row * 110 - 100) + 'px';
    const left = (item.col * 110 - 100) + 'px';
    return {top, left, 'background-color': colorMap[item.value] || 'black'};
  }
  @HostListener('window:keyup', ['$event'])
  onKeyup(event: KeyboardEvent): void {
    if (this.keyEventCodMap[event.code]) {
      this.gameService[this.keyEventCodMap[event.code]]();
      console.log(this.keyEventCodMap[event.code]);
    }
  }
}
