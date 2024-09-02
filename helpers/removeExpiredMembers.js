const { createClient } = require("@supabase/supabase-js");
const { Telegraf } = require("telegraf");
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_KEY;
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
const bot = new Telegraf(process.env.BOT_TOKEN);


const removeExpiredMembers = async function removeExpiredMembers() {
  // Get the current date and time
  const now = new Date();

  // Fetch members with subscriptions ending at or before the current timestamp
  const { data: members, error } = await supabase
    .from("Subscriptions")
    .select("*")
    .lte("subscription_end", now.toISOString()); // Filter by subscriptions ending at or before the current timestamp
  console.log(members);
  if (error) {
    console.error("Failed to fetch members:", error);
    return;
  }

  console.log("Fetched members with expired subscriptions:");
  if (members.length === 0) {
    console.log("No expired subscriptions found.");
    return;
  }

  // Display the list of expired members
  members.forEach((member) => {
    console.log(
      `User ID: ${member.user_id}, Subscription End Date: ${member.subscription_end}  `
    );
  });
  const groupIds = [process.env.GROUP_CHAT_ID_1, process.env.GROUP_CHAT_ID_2, /* add more group IDs as needed */];
  for (const groupId of groupIds) {
  // Process each expired member
  for (const member of members) {
    try {
      console.log(`Removing user ${member.user_id} from the group...`);
      await bot.telegram
        .banChatMember(groupId, member.user_id)
        .then((data) => {
          console.log(
            `User ${member.user_id} has been removed from the group.`
          );
          console.log(data);
        });
    } catch (err) {
      console.error(
        `Failed to remove user ${member.user_id} from the group:, err`
      );
    }
  }}
};


exports.removeExpiredMembers= removeExpiredMembers;
