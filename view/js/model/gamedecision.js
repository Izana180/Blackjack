// プレイヤーのアクションとサイジングを提供するオブジェクト
export class GameDecision {
    action;
    amount;
    constructor(action, amount) {
        this.action = action;
        this.amount = amount;
    }
    getAction() {
        return this.action;
    }
    getAmount() {
        return this.amount;
    }
}
