require('dotenv').config()
const fetch = require('node-fetch')
const W3CWebSocket = require('websocket').w3cwebsocket;

const ws = new W3CWebSocket(process.env['BINANCE_WEBSOCKET']);

ws.onmessage = (e) => {
    const { data } = JSON.parse(e.data);
    const { symbol, volume, baseAsset, eventType, noticeType, priceChange, period } = data;

    if (process.env['BASE_ASSET'] && baseAsset !== process.env['BASE_ASSET']) {
        return;
    }

    if (priceChange && process.env['PRICE_CHANGE_THRESHOLD'] && Math.abs(priceChange) < process.env['PRICE_CHANGE_THRESHOLD']) {
        return;
    }

    const color = colorize(eventType);
    const fields = [
        {
            "name": "Event",
            "value": formatEvent(eventType),
            "inline": false
        },
        {
            "name": "Symbol",
            "value": symbol,
            "inline": true
        },
        {
            "name": volume ? 'Volume' : 'Price',
            "value": formatVolume(volume, baseAsset) || formatPriceChange(priceChange),
            "inline": true
        },
    ];

    if (period) {
        fields.push(
            {
                "name": 'Period',
                "value": formatPeriod(period),
                "inline": true
            }
        );
    }

    const msg = { 'embeds': [{ color, fields }] };

    fetch(
        process.env['DISCORD_WEBHOOK'],
        {
            method: 'post',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(msg)
        }
    );
};

const colorize = eventType => {
    switch(true) {
        case eventType.includes('UP_'):
        case eventType.includes('_BUY'):
        case eventType.includes('RISE_'):
            return '3066993'
        case eventType.includes('DOWN_'):
        case eventType.includes('_SELL'):
        case eventType.includes('DROP_'):
            return '15158332'
        default:
            return 0
    }
}

const formatPriceChange = value => {
    if (!value) {
        return null
    }

    return (Math.sign(value) > 0 ? '+' : '-') + (Math.abs(value) * 100).toFixed(2) + ' %'
}

const formatVolume = (value, baseAsset) => {
    if (!value) {
        return null
    }

    return `${value} ${baseAsset}`
}

const formatEvent = value => {
    return value.replaceAll('_', ' ').replace(/\d+$/, '').trim()
}

const formatPeriod = value => {
    return value.replace(/(\w+?)_(\d)/gm, '$2 $1')
}
