import Coin from "../coinModel.js";

const options = {
    method: 'GET',
    headers: {
        'Content-Type': 'application/json',
        'x-cg-demo-api-key': process.env.COINGECKO_API_KEY
    }
};

const fetchData = async () => {
    try {
        const coins = ["bitcoin", "ethereum", "matic-network"];
        
        for (let i = 0; i < coins.length; i++) {  
            const res = await fetch(`${process.env.COINGECKO_API_ENDPOINT}/${coins[i]}`, options);
        
            if (res.ok) {
                const data = await res.json();
                
                const coinId = (i === 2) ? "matic" : coins[i]; 
                const existingCoin = await Coin.findOne({ id: coinId });
                
                if (!existingCoin) {
                    
                    const newCoin = new Coin({
                        id: coinId,
                        prices: [data.market_data?.current_price?.usd],  
                        marketCap: [data.market_data?.market_cap?.usd],  
                        change: [data.market_data?.price_change_24h],     
                    });
                    
                    await newCoin.save();
                    console.log(`Saved new coin: ${coinId}`,newCoin);
                } else {
                    
                    existingCoin.prices.push(data.market_data?.current_price?.usd);
                    existingCoin.marketCap.push(data.market_data?.market_cap?.usd);
                    existingCoin.change.push(data.market_data?.price_change_24h);

                    await existingCoin.save();
                    console.log(`Updated existing coin: ${coinId}`,existingCoin);
                }
            } else {
                console.error("Error in fetching the messages: ", res.statusText);
            }
        }
        
    } catch (error) {
        console.error("Fetch error: ", error);  
    }
};

export default fetchData;
