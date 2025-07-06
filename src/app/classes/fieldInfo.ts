import { Figure } from "./figure";

export class FieldInfo{
  figure: Figure;
  colorType: string = '';
  accessable: boolean = false;

  constructor(colorType: string) {
    this.figure = new Figure();
    this.colorType = colorType;
    this.accessable = false;
  }
}