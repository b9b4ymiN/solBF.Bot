export type NFTMetaType = {
    name: string
    tradeDirection: string
    price: number
    priceUSD: number
    image: string
    transactionDate: number
    marketPlaceURL: string
}

export interface MarketPlace {
    name: string
    url: string
}

export interface walletType {
    name: string
    address: string
}
