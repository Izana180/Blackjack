export const ALL_SUITS = ["S", "H", "D", "C"];
export const ALL_RANKS = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];
export class Card {
    suit;
    rank;
    constructor(suit, rank) {
        this.suit = suit;
        this.rank = rank;
    }
    getSuit() {
        return this.suit;
    }
    getRank() {
        return this.rank;
    }
    getRankNumber() {
        if (this.rank === "A")
            return 11;
        if (this.rank === "J" || this.rank === "Q" || this.rank === "K")
            return 10;
        return Number(this.rank);
    }
}
