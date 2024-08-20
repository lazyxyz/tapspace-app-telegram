import client from "./client";

const accessToken =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJmcmVzaCI6ZmFsc2UsImlhdCI6MTcyNDA2MDI0OSwianRpIjoiNDUzNzc3ZmEtZTk1Zi00NGUzLWE4ZGYtY2MwYjg0MDQ0NGIwIiwidHlwZSI6ImFjY2VzcyIsInN1YiI6Ijc3MTUxNzk5NTgwMzc1ODljODI4ZjAwMSIsIm5iZiI6MTcyNDA2MDI0OSwiY3NyZiI6ImU3M2RkOGYxLTQ0NTctNDc5ZS04MzI2LWFjODQxZTg5YjgwZSIsImV4cCI6MTcyOTI0NDI0OX0.6XIl1q77BYuVG1JfFUU79R31j9xEiX87ku-4eX1zEb0";

const getUserInfo = async (params: any) => {
  return await client.get("Users/user_info", {
    params,
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
};

const getLeaderboard = async () => {
  return await client.get("Users/leaderboard", {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
};

const updateBotBtc = async (body: { telegram_id: any; level: string }) => {
  return await client.post("Update/update/bot_BTC_level", body, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
};

const updateTokenBtc = async (body: {
  telegram_id: any;
  btc_value: number;
}) => {
  return await client.post("Update/update/token_btc", body, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
};

const updateBotResourcesLevel = async (body: {
  telegram_id: any;
  name: string;
  level_resource: string;
}) => {
  return await client.post("Update/update/bot_resource_level", body, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
};

const updatePropertiesSpaceship = async (body: {
  telegram_id: any;
  name: string;
  level: string;
}) => {
  return await client.post("Update/update/properties_spaceship", body, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
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
  return await client.post("Update/update/mining", body, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
};

const buyResources = async (body: {
  telegram_id: any;
  resource_name: string;
  value_btc: number;
  value_resource: number;
}) => {
  return await client.post("Storage/storage", body, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
};

const swapResource = async (body: {
  telegram_id: any;
  from_resource: string;
  to_resource: string;
  value: number;
}) => {
  return await client.post("Swap/swap_resource", body, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
};

const sendInviteLink = async (body: { telegram_id: number }) => {
  return await client.post("referal/send_invite_link", body, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
};
const systemService = {
  getUserInfo,
  getLeaderboard,

  updateBotBtc,
  updateTokenBtc,
  updateBotResourcesLevel,
  updatePropertiesSpaceship,
  updateMining,

  buyResources,
  swapResource,

  sendInviteLink,
};
export default systemService;
