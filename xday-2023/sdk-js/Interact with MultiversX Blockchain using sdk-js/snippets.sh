FRANK_ADDRESS="erd1kdl46yctawygtwg2k462307dmz2v55c605737dp3zkxh04sct7asqylhyv"
GRACE_ADDRESS="erd1r69gk66fmedhhcg24g2c5kn2f2a5k4kvpr6jfw67dn2lyydd8cfswy6ede"
WALLET_FRANK="~/multiversx-sdk/testwallets/latest/users/frank.json"
WALLET_GRACE="~/multiversx-sdk/testwallets/latest/users/grace.json"

ADDER_ADDRESS="erd1qqqqqqqqqqqqqpgq5h3h37kzmg3rk2gzw52f5vtl66kmu80zt7as75qvsu"
LOTTERY_ADDRESS="erd1qqqqqqqqqqqqqpgqrv2uxy85tluushhdk335hmv0w44d6ksat7as6mqkuh"
LOTTERY_NAME="test"

TOKEN_CHOCOLATE="CHOCOLATE-daf625"
TOKEN_BEER="BEER-b16c6d"

transferEGLD() {
    ./src/transfers.js transfer-egld --receiver ${GRACE_ADDRESS} --wallet ${WALLET_FRANK} --amount 100000000000000000
}

transferESDT() {
    ./src/transfers.js transfer-esdt --receiver ${GRACE_ADDRESS} --wallet ${WALLET_FRANK} --token ${TOKEN_CHOCOLATE} --amount 100
}

getBalances() {
    ./src/transfers.js get-balances --address ${GRACE_ADDRESS}
}

adderDeploy() {
    ./src/adder.js deploy --initial-value 0 --wallet ${WALLET_FRANK}
}

adderAddValue() {
    ./src/adder.js add --contract ${ADDER_ADDRESS} --value 7 --wallet ${WALLET_FRANK}
}

adderGetSum() {
    ./src/adder.js get-sum --contract ${ADDER_ADDRESS}
}

lotteryDeploy() {
    ./src/lottery.js deploy --wallet ${WALLET_FRANK}
}

lotteryStart() {
    ./src/lottery.js start --contract ${LOTTERY_ADDRESS} --name ${LOTTERY_NAME} --token ${TOKEN_BEER} --price 1 --duration 80 --wallet ${WALLET_FRANK}
}

lotteryGetInfo() {
    ./src/lottery.js get-info --contract ${LOTTERY_ADDRESS} --name ${LOTTERY_NAME}
}

lotteryBuyTicketFrank() {
    ./src/lottery.js buy-ticket --contract ${LOTTERY_ADDRESS} --name ${LOTTERY_NAME} --token ${TOKEN_BEER} --amount 1 --wallet ${WALLET_FRANK}
}

lotteryBuyTicketGrace() {
    ./src/lottery.js buy-ticket --contract ${LOTTERY_ADDRESS} --name ${LOTTERY_NAME} --token ${TOKEN_BEER} --amount 1 --wallet ${WALLET_GRACE}
}

lotteryDetermineWinner() {
    ./src/lottery.js determine-winner --contract ${LOTTERY_ADDRESS} --name ${LOTTERY_NAME} --wallet ${WALLET_FRANK}
}
