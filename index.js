require("dotenv").config();
const { createClient } = require("@supabase/supabase-js");
const { Telegraf } = require("telegraf");
const cron = require("node-cron");

const { insertSubscription } = require("./helpers/insertSubscription");
const { addDaysToNow } = require("./helpers/addDaysToNow");
const { getAllSubscriptions } = require("./helpers/getAllSubscriptions");
const { removeExpiredMembers } = require("./helpers/removeExpiredMembers");
const bot = new Telegraf(process.env.BOT_TOKEN);

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_KEY;
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

bot.help((ctx) => {
  if (ctx.chat.type === "group" || ctx.chat.type === "supergroup") {
    ctx.reply("يمكنك استخدام البوت في الدردشة الخاصة");
    return;
  }
  ctx.reply(
    "للحصول على رقم شخصي اضغط /start\nللمساعدة تواصل مع هذا الرقم ********"
  );
});

bot.start(async (ctx) => {
  const first_name = ctx.from.first_name || "";
  const last_name = ctx.from.last_name || "";
  const user_name = ctx.from.username || "غير معرف";
  const user_id = ctx.from.id;
  let isActive = await getAllSubscriptions.getIsActive(user_id);

  // Check if the user is in a group or supergroup
  if (ctx.chat.type === "group" || ctx.chat.type === "supergroup") {
    ctx.reply("يمكنك استخدام البوت في الدردشة الخاصة");
    return;
  }

  if (isActive === true) {
    const count = await getAllSubscriptions.getUserCount(user_id);
    ctx.reply(`رقمك الشخصي هو: <b>${count}</b>`, { parse_mode: "HTML" });
    return;
  }

  const lastCount = await getAllSubscriptions.getLastCount();

  if (isActive === false) {
    // Check if the user is already subscribed

    await insertSubscription.insertSubNumber(user_id, lastCount + 1);

    console.log("The last count is:", lastCount + 1);

    // Reply to the user with their personal number
    ctx.reply(`أهلًا وسهلًا بك ${first_name} ${last_name} في الإنجاز البحثي`);
    ctx.reply(`هذا هو رقمك الشخصي: ${lastCount}`);

    // Increment the count for the next user
    isActive = true;

    // Insert the subscription details in the background
    setTimeout(async () => {
      try {
        const subscription_end = addDaysToNow();
        await insertSubscription.insertSubscription(
          user_id,
          user_name,
          subscription_end,
          isActive,
          first_name,
          last_name
        );
      } catch (error) {
        console.error("Failed to insert subscription:", error);
      }
    }, 0); // Insert the details immediately after sending the response
  }
});

// __________________________________________________RemoveMember_______________________________________

cron.schedule("* * * * * *", () => {
  console.log("Running removeExpiredMembers at midnight...");

  removeExpiredMembers()
    .then((error) => {
      if (error) {
        console.error("Failed to process expired members:", error);
        return;
      }
      console.log("Completed processing expired members.");
    })
    .catch((err) => {
      console.error(
        "An error occurred during the execution of removeExpiredMembers:",
        err
      );
    });
});

bot
  .launch()
  .then(() => console.log("Bot is running..."))
  .catch((err) => console.error("Failed to start bot:", err));

console.log("Bot is running...");
