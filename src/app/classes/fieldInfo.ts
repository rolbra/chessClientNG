import { Figure } from "./figure";

export class FieldInfo{
  figure: Figure;
  colorType: string = '';

  constructor(colorType: string) {
    this.figure = new Figure();
    this.colorType = colorType;
  }
}