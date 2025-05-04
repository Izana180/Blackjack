import { Card, ALL_SUITS, ALL_RANKS } from "@controller/card";

export class Deck{
    private cards: Card[] = [];

    constructor(){
        this.initializeDeck();
        this.shuffle();
    }

    private initializeDeck(): void{
        this.cards = [];
        for(const suit of ALL_SUITS){
            for(const rank of ALL_RANKS){
                this.cards.push(new Card(suit, rank));
            }
        }
    }

    public shuffle(): void{
        for(let i = this.cards.length - 1; i>0; i--){
            const j = Math.floor(Math.random()*(i+1));
            [this.cards[i], this.cards[j]] = [this.cards[j], this.cards[i]];
        }
    }

    public drawCard(): Card{
        const card = this.cards.pop();
        if(!card){
            throw new Error("empty deck");
        }
        return card;
    }
}