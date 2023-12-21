import {
    AccountInfo,
    BlockResponse,
    ConfirmedTransactionMeta,
    Context,
    LAMPORTS_PER_SOL,
    PublicKey,
    TokenBalance,
} from '@solana/web3.js'
import { retryAsync } from 'ts-retry'
import { MAX_SUPPORTED_TRANSACTION_VERSION } from '../constants'
import { postSaleToDiscord } from '../discord'
import {
    coingeckoClient,
    connectionSOL,
    logger,
    SUPABASE_KEY,
    SUPABASE_URL,
} from '../setting'
import { NFTMetaType, walletType } from '../types'
import {
    fetchTransaction,
    getMetaData,
    inferMarketPlace,
    inferTradeDirection,
} from '../utils'

import jsonWallet from '../../wallet.json';

const wallets: walletType[] = jsonWallet;

const getTran = async (signature: string) => {
    try {
        let wallet: PublicKey = new PublicKey(PublicKey.default)
        const txn = await fetchTransaction(connectionSOL, signature)

        //Getting information balance
        const { preBalances, postBalances } =
            txn.meta as ConfirmedTransactionMeta
        const preTokenBalances = txn.meta
            ?.preTokenBalances as Array<TokenBalance>
        const postTokenBalances = txn.meta
            ?.postTokenBalances as Array<TokenBalance>

        const price =
            Math.abs(preBalances[0] - postBalances[0]) / LAMPORTS_PER_SOL
        let mintToken = postTokenBalances[0]?.mint

        if (mintToken) {
            let tradeDirection = ''
            const accountKeys = txn.transaction.message.staticAccountKeys
            const marketPlaceNFT = await inferMarketPlace(accountKeys, "NFT")
            logger.info(`Marketplace_NFT: ${marketPlaceNFT}`)
            if (marketPlaceNFT) {

                //Calculate Price
                const solanaPrice = await coingeckoClient.simplePrice({
                    vs_currencies: 'usd',
                    ids: 'solana',
                })
                const priceUSD = solanaPrice.solana.usd * price

                tradeDirection = inferTradeDirection(
                    wallet.toString(),
                    txn.meta?.logMessages || [],
                    preTokenBalances || [],
                    postTokenBalances || []
                )
                logger.info(`Trade direction: ${tradeDirection}`)
                const metadata = await getMetaData(mintToken)
                const nftMeta: NFTMetaType = {
                    name: metadata.name,
                    tradeDirection,
                    price: price,
                    priceUSD: priceUSD,
                    image: metadata.image,
                    transactionDate: txn.blockTime as number,
                    marketPlaceURL: `${marketPlaceNFT.url}/${mintToken}`,
                }
                console.log('nftMeta:', nftMeta);
            } else {
                //token
            }
        } else {
            logger.info('Not an NFT or Swap Token transaction')
        }
    } catch (e) {
        logger.info(`error: ${e}`)
    }
}

getTran('rxyt3rhtgC2xP4NZ9j6C7XZSNwEbAkq3VguLGEQ5y6JHvNYkmCoMQMtqTehSzfVRrsFZkyemt6UnazK6JXknuC5')