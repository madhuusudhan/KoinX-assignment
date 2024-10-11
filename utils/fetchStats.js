import Coin from "../coinModel.js";

export default async function fetchStats(req, res) {
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

        const response = {
            price: coinData.prices[coinData.prices.length - 1],
            marketCap: coinData.marketCap[coinData.marketCap.length - 1],
            "24hChange": coinData.change[coinData.change.length - 1]
        };

        res.status(200).json(response);
    } catch (error) {
        console.error("Error fetching coin data:", error);
        res.status(500).json({ error: 'Internal server error.' });
    }
}
