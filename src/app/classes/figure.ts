import { Directions } from "./directions";

export class Figure{
    name: string = '';
    type: string = '';
    color: string = '';
    field: string = '';
    code: string = '';
    x: number = -1;
    y: number = -1;
    directions: Directions[] = [];
}

export class Rook extends Figure {
    constructor() {
        super();
        this.directions = [
            Directions.bottom,
            Directions.left,
            Directions.top,
            Directions.right
        ]
    }
}

export class Bishop extends Figure {
    constructor() {
        super();
        this.directions = [
            Directions.bottomLeft,
            Directions.topLeft,
            Directions.topRight,
            Directions.bottomRight
        ]
    }
}
