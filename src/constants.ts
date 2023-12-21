type ProgramAccountType = {
    [key: string]: string[]
}

type ProgramAccountUrlType = {
    [key: string]: string
}

export const PROGRAM_ACCOUNTS: ProgramAccountType = {
    MagicEden: [
        'MEisE1HzehtrDpAAT8PnLHjpSSkRYakotTuJRPjTpo8',
        'M2mx93ekt1fmXSVkTrUL9xVFHkmME8HTUi5Cyc5aF7K',
    ],
    Solanart: [
        'CJsLwbP1iu5DuUikHEJnLfANgKy6stB2uFgvBBHoyxwz',
        'hausS13jsjafwWwGqZTUQRmWyvyxn9EQpqMwV1PBBmk',
    ],
    MortuaryInc: ['minc9MLymfBSEs9ho1pUaXbQQPdfnTnxUvJa8TWx85E'],
    Yawww: ['5SKmrbAxnHV2sgqyDXkGrLrokZYtWWVEEk5Soed7VLVN'],
    Hyperspace: ['HYPERfwdTjyJ2SCaKHmpF2MtrXqWxrsotYDsTrshHWq8'],
    CoralCube: ['6U2LkBQ6Bqd1VFt7H76343vpSwS5Tb1rNyXSNnjkf9VL'],
    Tensor: ['TSWAPaqyCSx2KABk68Shruf4rp7CxcNi8hAsbdwmHbN'],
    SpinerMarket: ['SNPRohhBurQwrpwAptw1QYtpFdfEKitr4WSJ125cN1g']
}

export const PROGRAM_ACCOUNTS_DEX: ProgramAccountType = {
    Jupiter: [
        'JUP2jxvXaqu7NQY1GmNF4m1vodw12LVXYxbFL2uJvfo',
        'DCA265Vj8a9CEuX1eb1LWRnDT7uK6q1xMipnNyatn23M',
        'JUP6LkbZbjS1jKKwapdHNy74zcZ3tLUZoi5QNyVTaV4'
    ],
    Orca: ['whirLbMiicVdio4qvUfM5KAg6Ct8VwpYzGff3uctyCc'],
    Raydium: ['routeUGWgWzqBWFcrCfv8tritsqukccJPu3q5GPP3xS',
        '675kPX9MHTjS2zt1qfr1NYHuzeLXfQM9H24wFSUt1Mp8']
}

export const PROGRAM_ACCOUNT_URLS: ProgramAccountUrlType = {
    MagicEden: 'https://www.magiceden.io/item-details',
    Solanart: 'https://solanart.io/search',
    MortuaryInc: 'https://mortuary-inc.io',
    Yawww: 'https://www.yawww.io/marketplace/listing',
    Hyperspace: 'https://hyperspace.xyz/token',
    CoralCube: 'https://coralcube.io/detail',
    SpinerMarket: 'https://www.sniper.xyz/asset',
    Tensor: 'https://www.tensor.trade/item',
    Jupiter: 'https://jup.ag/swap/SOL-',
    Raydium: 'https://raydium.io/swap/?inputCurrency=sol&outputCurrency=',
    Orca: 'https://www.orca.so/'
}

export const BUY = 'BUY 🛒'
export const SELL = 'SELL 💰'
export const BURN = 'BURN 🔥'
export const LISTING = 'LISTING 🛍️'
export const DE_LISTING = 'DE-LISTING 🏃'
export const MAX_SUPPORTED_TRANSACTION_VERSION = 0
export const SWAP = 'SWAP'