const { createClient } = require("@supabase/supabase-js");
const { Telegraf } = require("telegraf");

const bot = new Telegraf("7430433017:AAHZnjkMfZgGSwPcS3yQeGDkgSjA38HRBnM");
const GROUP_CHAT_ID = "-1002179440228";

let count = 1;
let isActive = false;

// bot.start((ctx) => ctx.reply("مرحبا بك"));
bot.help((ctx) => ctx.reply("نحن هنا لمساعدتك"));

const SUPABASE_URL = "https://mutbgnoulgmsuiptnfib.supabase.co";
const SUPABASE_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im11dGJnbm91bGdtc3VpcHRuZmliIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjQzODg4ODUsImV4cCI6MjAzOTk2NDg4NX0.qFhAJpisFzOAmb7fvv9F81hCOJANo7kbNOux5bt-PNQ";
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

console.log("Bot is running...");

// Get all subscriptions

// async function getSubscriptions() {
//   const { data: Subscriptions, error } = await supabase
//     .from("Subscriptions")
//     .select("*");
//   if (error) {
//     console.log(error);
//     return;
//   }
//   return Subscriptions;
// }

// getSubscriptions().then((data) => {
//   const dataJson = JSON.stringify(data);
//   console.log(`users: \n ${dataJson}`);
// });

// async function removeExpiredMembers() {
//   // Get the current date and time
//   const now = new Date();

//   // Fetch members with subscriptions ending at or before the current timestamp
//   const { data: members, error } = await supabase
//     .from("Subscriptions")
//     .select("*")
//     .lte("subscription_end", now.toISOString()); // Filter by subscriptions ending at or before the current timestamp
//   console.log(members);
//   if (error) {
//     console.error("Failed to fetch members:", error);
//     return;
//   }

//   console.log("Fetched members with expired subscriptions:");
//   if (members.length === 0) {
//     console.log("No expired subscriptions found.");
//     return;
//   }

//   // Display the list of expired members
//   members.forEach((member) => {
//     console.log(
//       `User ID: ${member.user_id}, Subscription End Date: ${member.subscription_end}  `
//     );
//   });

//   // Process each expired member
//   for (const member of members) {
//     try {
//       console.log(`Removing user ${member.user_id} from the group...`);
//       await bot.telegram
//         .banChatMember(GROUP_CHAT_ID, member.user_id)
//         .then((data) => {
//           console.log(
//             `User ${member.user_id} has been removed from the group.`
//           );
//           console.log(data);
//         });
//     } catch (err) {
//       console.error(
//         "Failed to remove user ${member.user_id} from the group:, err"
//       );
//     }
//   }
// }

// removeExpiredMembers().then((error) => {
//   if (error) {
//     console.error("Failed to process expired members:", error);
//     return;
//   }
//   console.log("Completed processing expired members.");
// });

// async function getUserChat() {
//   const chatId = GROUP_CHAT_ID;
//   const userId = "seifelesllam";
//   const chat = await bot.telegram.getChatMember(chatId, userId);
//   console.log(chat);
// }

// getUserChat();

// Start the bot
// start function and stop on group

const addDaysToNow = (days) => {
  const now = new Date();
  const futureDate = new Date(now.setDate(now.getDate() + days));

  // Convert to timestamp with time zone (ISO 8601 format)
  const timestampz = futureDate.toISOString();

  return timestampz;
};

// Example usage
const x = 30;
const futureTimestampz = addDaysToNow(x);
console.log(`Timestamp after ${x} days:`, futureTimestampz);

const insertSubscription = async (userId, userName, subscriptionEnd) => {
  const { error } = await supabase
    .from("Subscriptions") // Table name
    .insert([
      {
        user_id: userId,
        username: userName,
        subscription_end: subscriptionEnd,
      },
    ]);

  if (error) {
    console.error("Error inserting data:", error);
    return null;
  }
};

// Example usage:
const userId = "123456";
const userName = "JohnDoe";
const subscriptionEnd = "2024-09-23T13:45:30.123Z"; // Timestamp with timezone

insertSubscription(userId, userName, subscriptionEnd);

bot.start((ctx) => {
  if (ctx.chat.type === "group" || ctx.chat.type === "supergroup") {
    ctx.reply("يمكنك استخدام البوت في الدردشة الخاصة بك");
    // if this first time using /start give them a count
  } else if (isActive === true) {
    ctx.reply("ur count is " + count);
    count++;
  } else {
    ctx.reply("ur sub number is " + count);
  }
});

bot
  .launch()
  .then(() => console.log("Bot is running..."))
  .catch((err) => console.error("Failed to start bot:", err));
