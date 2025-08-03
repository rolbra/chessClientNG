export class Player{
    name: string;
    id: number;
    color: string;

    constructor(initName?:string){
        this.name = initName? initName : '';
        this.id = -1;
        this.color = '';
    };
}