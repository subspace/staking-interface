import { ChainDetails, ExtensionState, Registration, StakingConstants } from '../types'
export * from './errors'
export * from './styles'

export const ROUTES = {
  HOME: '/',
  REGISTER: '/register',
  MANAGE: '/manage',
  STATS: '/stats',
  OPERATORS: '/operators',
  NOMINATORS: '/nominators',
  OPERATOR_STATS: '/operatorStats',
  NOMINATORS_STATS: '/nominatorsStats'
}

export const EXTERNAL_ROUTES = {
  OPERATORS_DOCS: 'https://docs.subspace.network/docs/farming-&-staking/staking/operators/register-operator',
  STAKING_INCENTIVES: 'https://docs.subspace.network/docs/farming-&-staking/staking/intro',
  STAKING_INFORMATION: 'https://docs.subspace.network/docs/farming-&-staking/staking/',
  RISK: 'https://docs.subspace.network/docs/learn/security',
  ASTRAL: 'https://explorer.subspace.network/',
  DISCORD: 'https://discord.gg/subspace-network',
  TELEGRAM: 'https://t.me/subspace_network',
  TWITTER: 'https://twitter.com/NetworkSubspace',
  GITHUB: 'https://github.com/subspace',
  REDDIT: 'https://www.reddit.com/r/sub',
  MEDIUM: 'https://medium.com/subspace-network',
  YOUTUBE: 'https://www.youtube.com/channel/UCojYRCZOtVTJHJXivOYJzeQ',
  LINKEDIN: 'https://www.linkedin.com/company/subspace-blockchain/'
}

export const SUBSPACE_EXTENSION_ID = 'subspace-staking-interface'

export const SUBSPACE_ACCOUNT_FORMAT = 2254

export const SYMBOL = 'tSSC'

export const DECIMALS = 18

export const SUBSCAN_URL = 'https://subspace.subscan.io/'

export const MAX_BLOCKS_TO_FETCH_FOR_TRANSACTIONS_SPOTTER = 30

export const AMOUNT_TO_SUBTRACT_FROM_MAX_AMOUNT = 5000000000000000

export enum ActionType {
  AddFunds = 'addFunds',
  Withdraw = 'withdraw',
  Deregister = 'deregister'
}

export const initialRegistrationValues: Registration = {
  domainId: process.env.NEXT_PUBLIC_DOMAIN_ID || '0',
  minimumNominatorStake: '',
  formattedMinimumNominatorStake: '',
  amountToStake: '',
  formattedAmountToStake: '',
  nominatorTax: 0,
  signingKey: ''
}

export const initialActionInput = {
  operatorId: '',
  amount: '',
  formattedAmount: ''
}

export const initialExtensionValues: ExtensionState = {
  loading: false,
  data: undefined,
  error: null
}

export const initialChainDetails: ChainDetails = {
  chain: 'Subspace',
  name: 'Subspace',
  tokenDecimals: DECIMALS,
  tokenSymbol: SYMBOL,
  ss58Format: SUBSPACE_ACCOUNT_FORMAT
}

export const initialStakingConstants: StakingConstants = {
  maxNominators: 0,
  minOperatorStake: BigInt(0),
  stakeEpochDuration: 0,
  stakeWithdrawalLockingPeriod: 0,
  domainRegistry: [],
  domainStakingSummary: [],
  operators: [],
  nominators: [],
  pendingStakingOperationCount: [],
  pendingDeposits: []
}

export const toastConfig = {
  duration: 9000,
  isClosable: true
}

export enum TransactionStatus {
  Pending = 'pending',
  Success = 'success',
  Failed = 'failed'
}

export enum OperatorListType {
  LIST = 'list',
  CARD_GRID = 'card-grid'
}

export enum ViewOrderBy {
  OperatorId = 'OperatorId',
  NominatorTax = 'NominatorTax',
  NominatorCount = 'NominatorCount',
  MinimumNominatorStake = 'MinimumNominatorStake',
  TotalStake = 'TotalStake'
}

export enum ViewOrderDirection {
  Ascending = 'Ascending',
  Descending = 'Descending'
}
