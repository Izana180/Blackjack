export type Suit = "S" | "H" | "D" | "C";
export type Rank = "A" | "2" | "3" | "4" | "5" | "6" | "7" | "8" | "9" | "10" | "J" | "Q" | "K";

export class Card{
    private readonly suit : Suit;
    private readonly rank : Rank;

    constructor(suit: Suit, rank: Rank){
        this.suit = suit;
        this.rank = rank;
    }

    public getSuit(): Suit{
        return this.suit;
    }
    public getRank(): Rank{
        return this.rank;
    }

    public getRankNumber(): number{
        if(this.rank === "A") return 11;
        if(this.rank === "J" || this.rank === "Q" || this.rank === "K") return 10;
        return Number(this.rank);
    }
}