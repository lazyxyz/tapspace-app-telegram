export interface ResourceRates {
  [key: string]: number;
}
export interface Resource {
  resource_name: string;
  level_resource: number;
}
export interface QueryData {
  btc_value: number;
  resources: Resource[];
  referred_users: string[];
}
export interface BitcoinContextType {
  bitcoinValue: number;
  resetBitcoinValue: () => void;
  offlineEarnings: number;
  resources: ResourceRates;
  resetResources: () => void;
  resourcesSocket: any;
  isSocketConnected: boolean;
}
