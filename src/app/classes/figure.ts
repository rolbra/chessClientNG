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
    moveCount: number = 0;
}

export class Rook extends Figure {
    constructor() {
        super();
        this.directions = [
            Directions.down,
            Directions.left,
            Directions.up,
            Directions.right
        ];
    }
}

export class Knight extends Figure {
    constructor() {
        super();
        this.directions = [
            Directions.jumpDownLeft,
            Directions.jumpLeftDown,
            Directions.jumpLeftUp,
            Directions.jumpUpLeft,
            Directions.jumpUpRight,
            Directions.jumpRightUp,
            Directions.jumpRightDown,
            Directions.jumpDownRight,
        ];
    }
}

export class Bishop extends Figure {
    constructor() {
        super();
        this.directions = [
            Directions.downLeft,
            Directions.upLeft,
            Directions.upRight,
            Directions.downRight
        ];
    }
}

export class Queen extends Figure {
    constructor() {
        super();
        this.directions = [
            Directions.downLeft,
            Directions.left,
            Directions.upLeft,
            Directions.up,
            Directions.upRight,
            Directions.right,
            Directions.downRight,
            Directions.down
        ];
    }
}

export class King extends Figure {
    constructor() {
        super();
        this.directions = [
            Directions.downLeft,
            Directions.left,
            Directions.upLeft,
            Directions.up,
            Directions.upRight,
            Directions.right,
            Directions.downRight,
            Directions.down
        ];
    }
}

export class Pawn extends Figure {
    constructor() {
        super();
        this.directions = [
            Directions.upLeft,
            Directions.upRight
        ];
    }
}