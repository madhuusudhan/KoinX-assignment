    import mongoose from "mongoose";

    const coinSchema = new mongoose.Schema({
    id: {
        type: String,
        required: true
    },
    prices: {
        type: [Number],
        default:[],
    },
    marketCap: {
        type: [Number],
        default:[],
    },
    change: {
        type: [Number],
        default:[],
    },
    });

    const Coin = mongoose.model('Coin', coinSchema);

    export default Coin;
