import client from "./client";

const getUserInfo = async (params: any) => {
  return await client.get("Users/user_info", { params });
};

const getLeaderboard = async () => {
  return await client.get("Users/leaderboard");
};

const updateBotBtc = async (body: { telegram_id: any; level: string }) => {
  return await client.post("Update/update/bot_BTC_level", body);
};

const updateTokenBtc = async (body: {
  telegram_id: any;
  btc_value: number;
}) => {
  return await client.post("Update/update/token_btc", body);
};

const updateBotResourcesLevel = async (body: {
  telegram_id: any;
  name: string;
  level_resource: string;
}) => {
  return await client.post("Update/update/bot_resource_level", body);
};

const updateMining = async (body: {
  telegram_id: any;
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

const swapResource = async (body: {
  telegram_id: any;
  from_resource: string;
  to_resource: string;
  value: number;
}) => {
  return await client.post("Swap/swap_resource", body);
};

const sendInviteLink = async (body: { telegram_id: number }) => {
  return await client.post("referal/send_invite_link", body);
};

const systemService = {
  getUserInfo,
  getLeaderboard,

  updateBotBtc,
  updateTokenBtc,
  updateBotResourcesLevel,
  updateMining,

  swapResource,

  sendInviteLink,
};
export default systemService;
