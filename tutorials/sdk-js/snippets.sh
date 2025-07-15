ALICE_ADDRESS="erd1qyu5wthldzr8wx5c9ucg8kjagg0jfs53s8nr3zpz3hypefsdd8ssycr6th"
GRACE_ADDRESS="erd1r69gk66fmedhhcg24g2c5kn2f2a5k4kvpr6jfw67dn2lyydd8cfswy6ede"
WALLET_ALICE="~/multiversx-sdk/testwallets/latest/users/alice.json"
WALLET_GRACE="~/multiversx-sdk/testwallets/latest/users/grace.json"

ADDER_ADDRESS="erd1qqqqqqqqqqqqqpgqxz75akhwz0snrv9fwnsfhulqfv2463aed8ss979yh3"
LOTTERY_ADDRESS="erd1qqqqqqqqqqqqqpgqn6p928wfxka2qh3cwaxha0mq50vzg828d8ssc9wsxv"
LOTTERY_NAME="test"

TOKEN_CHOCOLATE="CHOCOLATE-e98f2b"
TOKEN_ALICE="ALICE-5627f1"

transferEGLD() {
    ./src/transfers.js transfer-egld --receiver ${GRACE_ADDRESS} --wallet ${WALLET_ALICE} --amount 100000000000000000
}

transferEGLDUsingFactory() {
    ./src/transfers.js transfer-egld-using-factory --receiver ${GRACE_ADDRESS} --wallet ${WALLET_ALICE} --amount 100000000000000000
}

transferESDT() {
    ./src/transfers.js transfer-esdt --receiver ${GRACE_ADDRESS} --wallet ${WALLET_ALICE} --token ${TOKEN_CHOCOLATE} --amount 10
}

transferESDTUsingFactory() {
    ./src/transfers.js transfer-esdt-using-factory --receiver ${GRACE_ADDRESS} --wallet ${WALLET_ALICE} --token ${TOKEN_CHOCOLATE} --amount 10
}

getBalances() {
    ./src/transfers.js get-balances --address ${GRACE_ADDRESS}
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
    ./src/lottery.js start --contract ${LOTTERY_ADDRESS} --name ${LOTTERY_NAME} --token ${TOKEN_ALICE} --price 1 --duration 100 --wallet ${WALLET_ALICE}
}

lotteryGetInfo() {
    ./src/lottery.js get-info --contract ${LOTTERY_ADDRESS} --name ${LOTTERY_NAME}
}

lotteryBuyTicketAlice() {
    ./src/lottery.js buy-ticket --contract ${LOTTERY_ADDRESS} --name ${LOTTERY_NAME} --token ${TOKEN_ALICE} --amount 1 --wallet ${WALLET_ALICE}
}

lotteryBuyTicketAliceUsingFactory() {
    ./src/lottery.js buy-ticket-using-factory --contract ${LOTTERY_ADDRESS} --name ${LOTTERY_NAME} --token ${TOKEN_ALICE} --amount 1 --wallet ${WALLET_ALICE}
}

lotteryBuyTicketGrace() {
    ./src/lottery.js buy-ticket --contract ${LOTTERY_ADDRESS} --name ${LOTTERY_NAME} --token ${TOKEN_ALICE} --amount 1 --wallet ${WALLET_GRACE}
}

lotteryDetermineWinner() {
    ./src/lottery.js determine-winner --contract ${LOTTERY_ADDRESS} --name ${LOTTERY_NAME} --wallet ${WALLET_ALICE}
}
