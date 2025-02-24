class Figure{
  name: string = '';
  type: string = '';
  color: string = '';
  field: string = '';
}

export class FieldInfo{
  figure: Figure;
  colorType: string = '';

  constructor(colorType: string) {
    this.figure = new Figure();
    this.colorType = colorType;
  }
}