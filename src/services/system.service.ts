import client from "./client";

const getUserInfo = async (params: any) => {
  return await client.get("Users/user_info", { params });
};

const updateBotBtc = async (body: { telegram_id: string; level: string }) => {
  return await client.post("Update/update/bot_BTC_level", body);
};

const updateTokenBtc = async (body: {
  telegram_id: string;
  btc_value: number;
}) => {
  return await client.post("Update/update/token_btc", body);
};

const updateBotResourcesLevel = async (body: {
  telegram_id: string;
  name: string;
  level_resource: string;
}) => {
  return await client.post("Update/update/bot_resource_level", body);
};

const updateMining = async (body: {
  telegram_id: string;
  mining_values: {
    Steel: number;
    Aluminum: number;
    Copper: number;
    Fiber: number;
    Titanium: number;
  };
}) => {
  return await client.post("Update/update/mining", body);
};

const systemService = {
  getUserInfo,
  updateBotBtc,
  updateTokenBtc,
  updateBotResourcesLevel,
  updateMining,
};
export default systemService;
