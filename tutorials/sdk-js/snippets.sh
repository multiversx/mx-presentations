ALICE_ADDRESS="erd1qyu5wthldzr8wx5c9ucg8kjagg0jfs53s8nr3zpz3hypefsdd8ssycr6th"
BOB="erd1spyavw0956vq68xj8y4tenjpq2wd5a9p2c6j8gsz7ztyrnpxrruqzu66jx"
WALLET_ALICE="~/multiversx-sdk/testwallets/latest/users/alice.json"
WALLET_BOB="~/multiversx-sdk/testwallets/latest/users/bob.json"

ADDER_ADDRESS="erd1qqqqqqqqqqqqqpgqcquk3zvncpypt7vaclw4unje6gd4n7xdd8ssa6xas9"
LOTTERY_ADDRESS="erd1qqqqqqqqqqqqqpgq5x7an29astzlwcuemchz0va9fqs26a72d8ssuzywnf"
LOTTERY_NAME="test"

TOKEN_CHOCOLATE="ONE-83a7c0"
TOKEN_BEER="ALICE-5627f1"

transferEGLD() {
    ./src/transfers.js transfer-egld --receiver ${BOB} --wallet ${WALLET_ALICE} --amount 100000000000000000
}

transferEGLDUsingFactory() {
    ./src/transfers.js transfer-egld-factory --receiver ${BOB} --wallet ${WALLET_ALICE} --amount 100000000000000000
}

transferESDT() {
    ./src/transfers.js transfer-esdt --receiver ${BOB} --wallet ${WALLET_ALICE} --token ${TOKEN_CHOCOLATE} --amount 100000000000000000
}

transferESDTUsingFactory() {
    ./src/transfers.js transfer-esdt-factory --receiver ${BOB} --wallet ${WALLET_ALICE} --token ${TOKEN_CHOCOLATE} --amount 100000000000000000
}

getBalances() {
    ./src/transfers.js get-balances --address ${BOB}
}

adderDeploy() {
    ./src/adder.js deploy --initial-value 0 --wallet ${WALLET_ALICE}
}

adderAddValue() {
    ./src/adder.js add --contract ${ADDER_ADDRESS} --value 7 --wallet ${WALLET_ALICE}
}

adderGetSum() {
    ./src/adder.js get-sum --contract ${ADDER_ADDRESS}
}

lotteryDeploy() {
    ./src/lottery.js deploy --wallet ${WALLET_ALICE}
}

lotteryStart() {
    ./src/lottery.js start --contract ${LOTTERY_ADDRESS} --name ${LOTTERY_NAME} --token ${TOKEN_BEER} --price 1 --duration 80 --wallet ${WALLET_ALICE}
}

lotteryGetInfo() {
    ./src/lottery.js get-info --contract ${LOTTERY_ADDRESS} --name ${LOTTERY_NAME}
}

lotteryBuyTicketAlice() {
    ./src/lottery.js buy-ticket --contract ${LOTTERY_ADDRESS} --name ${LOTTERY_NAME} --token ${TOKEN_BEER} --amount 1 --wallet ${WALLET_ALICE}
}

lotteryBuyTicketAliceUsingFactory() {
    ./src/lottery.js buy-ticket --contract ${LOTTERY_ADDRESS} --name ${LOTTERY_NAME} --token ${TOKEN_BEER} --amount 1 --wallet ${WALLET_ALICE}
}

lotteryBuyTicketBob() {
    ./src/lottery.js buy-ticket --contract ${LOTTERY_ADDRESS} --name ${LOTTERY_NAME} --token ${TOKEN_BEER} --amount 1 --wallet ${WALLET_BOB}
}

lotteryDetermineWinner() {
    ./src/lottery.js determine-winner --contract ${LOTTERY_ADDRESS} --name ${LOTTERY_NAME} --wallet ${WALLET_ALICE}
}
