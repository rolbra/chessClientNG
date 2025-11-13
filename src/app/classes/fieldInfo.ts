import { Figure } from "./figure";

export class FieldInfo{
  figure: Figure;
  colorType: string = '';
  accessable: boolean;
  selected: boolean;

  constructor(colorType: string) {
    this.figure = new Figure();
    this.colorType = colorType;
    this.accessable = false;
    this.selected = false;
  }
}