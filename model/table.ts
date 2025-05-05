import { Player } from "@model/player";
import { Deck } from "@model/deck";
import { GameDecision } from "@model/gamedecision";

export type phaseType = "betting" | "acting" | "evaluatingWinners" | "Gameover";

export class Table{
    private readonly betDenominations: number[];
    private turnCounter: number = 0;
    private gamePhase: phaseType;
    private resultsLog: string[];
    private deck: Deck;
    private players: Player[];

    constructor(betDenominations: number[], players: Player[]){
        this.betDenominations = betDenominations;
        this.players = players;
        this.deck = new Deck();
        this.bjClearPlayerHandsAndBets();
        this.bjAssignPlayerHands();
    }

    // ハンドを配る
    public bjAssignPlayerHands(): void{
        for(const player of this.players){
            player.receiveCard(this.deck.drawCard());
            player.receiveCard(this.deck.drawCard());
        }
    }

    // ハンド、ベットサイズの初期化
    public bjClearPlayerHandsAndBets(): void{
        for(const player of this.players){
            player.clearHand();
            player.clearBet();
        }
    }

    public evaluateMove(player: Player): void{
        const decision: GameDecision = player.promptPlayer(null);
        player.applyDecision(decision);
    }

    public getTurnPlayer(): Player{
        return this.players[this.turnCounter % this.players.length];
    }

    public haveTurn(userData?: any): void{
        if(this.gamePhase === "betting" || this.gamePhase === "acting"){
            const currentPlayer = this.getTurnPlayer();
            const decision = currentPlayer.promptPlayer(userData);
            currentPlayer.applyDecision(decision);
            this.turnCounter++;
        }
    }

    public getResultsLog(): string[]{
        return this.resultsLog;
    }

    public getGamePhase(): string{
        return this.gamePhase;
    }

    public getTurnCount(): number{
        return this.turnCounter;
    }

    public isLastPlayer(): boolean{
        return (this.turnCounter + 1) % this.players.length === 0;
    }

    public onFirstPlauer(): boolean{
        return this.turnCounter % this.players.length === 0;
    }

    public allPlayerActionsResolved(): boolean{
        return this.players.every(player => {
            const status = player.getGameStatus();
            return ["broken", "bust", "stand", "surrender"].indexOf(status) !== -1;
        })
    }

    public bjEvaluateAndGetRoundResults(): string{
        const house = this.players.find(p => p.getType() === "house");
        const houseScore = house?.getHandScore() ?? 0;

        const resultMessages: string[] = [];

        for(const player of this.players){
            if(player.getType() === "house") continue;
            const score = player.getHandScore();
            const status = player.getGameStatus();

            if(["bust", "surrender", "broken"].includes(status)){
                resultMessages.push(`${player.getName()} の負け(${status})`)
                continue;
            }

            if(score > houseScore || houseScore > 21){
                player.winChips(player.getBet() * 2);
                resultMessages.push(`${player.getName()}の勝ち!(${score})`);
            }
            else if(score === houseScore){
                player.winChips(player.getBet());
                resultMessages.push(`チョップ(${score})`);
            }
            else{
                resultMessages.push(`${player.getName()}の負け(${score})`);
            }
        }

        const summary = resultMessages.join("\n");
        this.resultsLog.push(summary);
        return summary;
    }
}