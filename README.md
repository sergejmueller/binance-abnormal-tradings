<p align="center">
    <b>Binance abnormal tradings</b>
    <br>
    Post Binance abnormal tradings to Discord
</p>

Subscribe to Binance Websocket to follow abnormal tradings and post updates on Discord.

#### Content of the `.env` file
```
DISCORD_WEBHOOK=https://discord.com/api/webhooks/...
BINANCE_WEBSOCKET=wss://bstream.binance.com:9443/stream?streams=abnormaltradingnotices
BASE_ASSET=DATA
```

_Leave `BASE_ASSET=` blank to subscribe to all assets_
