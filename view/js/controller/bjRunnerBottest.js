import { Table } from "@model/table";
import { Player } from "@model/player";
// playerリスト
const players = [
    new Player("Bob", "ai", 400),
    new Player("Alice", "ai", 400),
    new Player("Dealer", "house", 0),
];
// betサイズの選択肢
const betOptions = [10, 50, 100];
const table = new Table(betOptions, players);
while (table.getGamePhase() !== "gameOver") {
    table.haveTurn();
    // アクション終了
    if (table.allPlayerActionsResolved()) {
        const result = table.bjEvaluateAndGetRoundResults();
        console.log("--------- Result ---------");
        console.log(result);
        break;
    }
}
