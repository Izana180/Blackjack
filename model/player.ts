import { Card } from "@model/card"
import { GameDecision, playerAction } from "@model/gamedecision";

export type playerType = "ai" | "user" | "house";

export class Player{
    private readonly name: string;
    private readonly type: playerType;
    private readonly chips: number | null;
    private bet: number = 0;
    private winAmount: number = 0;
    private gameStatus: string = "betting";
    private hand: Card[] = [];

    constructor(name: string, type: playerType, chips: number = 400){
        this.name = name;
        this.type = type;
        this.chips = chips;
    }

    public promptPlayer(userData: Number | { action: playerAction; amount: Number } | null): GameDecision{
        if(this.type === "user"){
            if(typeof userData === "object" && userData != null && "action" in userData && "amount" in userData){
                return new GameDecision(userData.action, userData.amount);
            }
            else{
                throw new Error("userdata is invalid");
            }
        }

        if(this.type === "ai"){
            const score = this.getHandScore();
            if(this.gameStatus === "betting"){
                return new GameDecision("bet", 100);
            }
            // TODO: AIの挙動をベーシックストラテジーに従うようにする
            return score < 17 ? new GameDecision("hit", 0) : new GameDecision("stand", 0)
        }
        if(this.type === "house"){
            const score = this.getHandScore();
            return score < 17 ? new GameDecision("hit", 0) : new GameDecision("stand", 0)
        }
        throw new Error("playerType invalid");
    }

    public getHandScore(): number{
        let total = 0;
        let aceCount = 0;
        for(const card of this.hand){
            const value = card.getRankNumber();
            total += value;
            if(card.getRank() === "A") aceCount++;
        }

        while(total>21 && aceCount > 0){
            total -= 10;
            aceCount --;
        }
        return total;
    }

    public receiveCard(card: Card): void{
        this.hand.push(card);
    }

    public getChips(): number{
        return this.chips;
    }
}