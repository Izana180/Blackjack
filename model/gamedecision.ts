export type playerAction = "bet" | "surrender" | "stand" | "hit" | "double";

// プレイヤーのアクションとサイジングを提供するオブジェクト
export class GameDecision{
    private readonly action: playerAction;
    private readonly amount: number;

    constructor(action: playerAction, amount: number){
        this.action = action;
        this.amount = amount;
    }

    public getAction(){
        return this.action;
    }
    public getAmount(){
        return this.amount;
    }
}