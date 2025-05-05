import { GameDecision } from "@model/gamedecision";
export class Player {
    name;
    type;
    chips;
    bet = 0;
    winAmount = 0;
    gameStatus = "betting";
    hand = [];
    constructor(name, type, chips = 400) {
        this.name = name;
        this.type = type;
        this.chips = chips;
    }
    promptPlayer(userData) {
        if (this.type === "user") {
            if (typeof userData === "object" && userData != null && "action" in userData && "amount" in userData) {
                return new GameDecision(userData.action, userData.amount);
            }
            else {
                throw new Error("userdata is invalid");
            }
        }
        if (this.type === "ai") {
            const score = this.getHandScore();
            if (this.gameStatus === "betting") {
                return new GameDecision("bet", 100);
            }
            // TODO: AIの挙動をベーシックストラテジーに従うようにする
            return score < 17 ? new GameDecision("hit", 0) : new GameDecision("stand", 0);
        }
        if (this.type === "house") {
            const score = this.getHandScore();
            return score < 17 ? new GameDecision("hit", 0) : new GameDecision("stand", 0);
        }
        throw new Error("playerType invalid");
    }
    getHandScore() {
        let total = 0;
        let aceCount = 0;
        for (const card of this.hand) {
            const value = card.getRankNumber();
            total += value;
            if (card.getRank() === "A")
                aceCount++;
        }
        while (total > 21 && aceCount > 0) {
            total -= 10;
            aceCount--;
        }
        return total;
    }
    receiveCard(card) {
        this.hand.push(card);
    }
    getChips() {
        return this.chips;
    }
    getGameStatus() {
        return this.gameStatus;
    }
    getType() {
        return this.type;
    }
    getName() {
        return this.name;
    }
    getBet() {
        return this.bet;
    }
    getWinAmount() {
        return this.winAmount;
    }
    winChips(chips) {
        this.chips += chips;
        return this.chips;
    }
    applyDecision(decision) {
        const action = decision.getAction();
        const amount = decision.getAmount();
        switch (action) {
            case "bet":
                this.bet = amount;
                this.chips -= amount;
                this.gameStatus = "acting";
                break;
            case "hit":
                this.gameStatus = "done";
                break;
            case "stand":
                this.gameStatus = "done";
                break;
            case "surrender":
                this.chips -= Math.floor(this.bet / 2);
                this.gameStatus = "done";
                break;
            case "double":
                if (this.chips >= this.bet) {
                    this.chips -= this.bet;
                    this.bet *= 2;
                    this.gameStatus = "done";
                }
                break;
            default:
                throw new Error("invalid action");
        }
    }
    clearHand() {
        this.hand = [];
    }
    clearBet() {
        this.bet = 0;
    }
}
