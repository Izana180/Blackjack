import { Player } from "@model/player";
import { Deck } from "@model/deck";
import { Card } from "@model/card";
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
}