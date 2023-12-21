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
import { MAX_SUPPORTED_TRANSACTION_VERSION } from './constants'
import { postSaleToDiscord } from './discord'
import {
    coingeckoClient,
    connectionSOL,
    logger,
    SUPABASE_KEY,
    SUPABASE_URL,
} from './setting'
import { NFTMetaType, walletType } from './types'
import {
    fetchTransaction,
    getMetaData,
    inferMarketPlace,
    inferTradeDirection,
} from './utils'

import jsonWallet from '../wallet.json';

const wallets: walletType[] = jsonWallet;

/**
 * Retrieve a processed block from the solana cluster
 * @param slot Slot where block is located
 * @returns Fetched block
 */
const retrieveBlock = async (slot: number): Promise<BlockResponse> => {
    return await retryAsync(
        async () => {
            logger.info(`Attempting to retrieve block in slot: ${slot}`)
            return (await connectionSOL.getBlock(slot, {
                maxSupportedTransactionVersion:
                    MAX_SUPPORTED_TRANSACTION_VERSION,
            })) as BlockResponse
        },
        { delay: 300, maxTry: 3 }
    )
}

const onAccountChangeCallBack = async (
    _accountInfo: AccountInfo<Buffer>,
    context: Context
) => {
    logger.info('Account change detected')
    const { slot } = context
    let wallet: PublicKey = new PublicKey(PublicKey.default)
    try {
        const block: BlockResponse = await retrieveBlock(slot)
        const { transactions } = block

        logger.info('Searching transactions')
        const transaction = transactions.find((item) => {
            const { accountKeys } = item.transaction.message
            const walletList: string[] = wallets.map(item => item.address);
            const publicKey = accountKeys.find((publicKey) =>
                walletList.includes(publicKey.toString())
            )
            if (publicKey) {
                wallet = publicKey
                return item
            }
        })?.transaction

        logger.info('Transaction found')
        const signature = transaction?.signatures[0] ?? ''
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
                console.log();
            } else {
                //token
            }
        } else {
            logger.info('Not an NFT or Swap Token transaction')
        }
    } catch (e) {
        logger.error('onAccountChangeCallBack"', e)
    }
}

const runBot = async () => {
    logger.info('Starting SOL-BF bot')
    wallets.forEach((item) => {

        logger.info(`Subscribing to account changes for ${item.address}`)
        connectionSOL.onAccountChange(
            new PublicKey(item.address),
            onAccountChangeCallBack,
            'confirmed'
        )
    })
}

if (require.main) {
    void runBot()
}