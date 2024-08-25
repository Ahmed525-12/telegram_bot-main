// get db subscriptions all data
const { createClient } = require("@supabase/supabase-js");
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_KEY;
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

const getSubscriptions = async function getSubscriptions() {
  const { data: Subscriptions, error } = await supabase
    .from("Subscriptions")
    .select("*");
  if (error) {
    console.log(error);
    return;
  }
  return Subscriptions;
};

/**
 * Call getSubscriptions Example
 */

// getSubscriptions().then((data) => {
//   const dataJson = JSON.stringify(data);
//   console.log(`users: \n ${dataJson}`);
//   return dataJson;
// });

// async function getUserChat(user_id) {
//   const chatId = GROUP_CHAT_ID;
//   const userId = "user_id";
//   const chat = await bot.telegram.getChatMember(chatId, userId);
//   console.log(chat);
// }

/**
 * Call getUserChat Example
 */

async function getLastCount() {
  const { data, error } = await supabase
    .from("Subscriptions")
    .select("sub_number")
    .order("created_at", { ascending: false }) // Assuming you have a created_at or id column to sort by
    .limit(1);

  if (error) {
    console.log("Error fetching last sub_number:", error);
    return;
  }

  // Check if data is not empty
  if (data.length > 0) {
    return data[0].sub_number;
  } else {
    console.log("No data found", data);
    return 1;
  }
}

async function getUserCount(user_id) {
  const { data, error } = await supabase
    .from("Subscriptions")
    .select("sub_number")
    .eq("user_id", user_id);

  if (error) {
    console.error("Error fetching sub_number:", error);
  } else {
    console.log("Sub number:", data);
    return data[0].sub_number;
  }
}

async function getIsActive(user_id) {
  const { data, error } = await supabase
    .from("Subscriptions")
    .select("isActive")
    .eq("user_id", user_id)
    .single();

  if (error) {
    console.error("Error fetching isActive: oR First Time user", error);
    return false;
  }

  if (!data) {
    return false;
  }

  console.log("isActive:", data.isActive);
  return data.isActive || false;
}

exports.getAllSubscriptions = {
  getSubscriptions,
  getUserCount,
  getLastCount,
  getIsActive,
};
