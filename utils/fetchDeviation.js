import Coin from "../coinModel.js";

export default async function fetchDeviation(req, res) {
    const { coin } = req.query;
    const validCoins = ['bitcoin', 'ethereum', 'matic'];

    if (!validCoins.includes(coin)) {
        return res.status(400).json({ error: 'Invalid coin parameter. Please choose from bitcoin, ethereum, or matic.' });
    }

    try {
        const coinData = await Coin.findOne({ id: coin });

        if (!coinData) {
            return res.status(404).json({ error: 'Coin data not found.' });
        }

        const pricesToUse = coinData.prices.length >= 100 ? coinData.prices.slice(-100) : coinData.prices;

        if (pricesToUse.length === 0) {
            return res.status(404).json({ error: 'No price data available.' });
        }

        const mean = pricesToUse.reduce((acc, price) => acc + price, 0) / pricesToUse.length;
        const variance = pricesToUse.reduce((acc, price) => acc + Math.pow(price - mean, 2), 0) / pricesToUse.length;
        const stdDeviation = Math.sqrt(variance).toFixed(2);

        res.status(200).json({ deviation: parseFloat(stdDeviation) });
    } catch (error) {
        console.error("Error fetching coin data:", error);
        res.status(500).json({ error: 'Internal server error.' });
    }
}
