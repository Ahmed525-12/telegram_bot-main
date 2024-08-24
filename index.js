require("dotenv").config();
const { createClient } = require("@supabase/supabase-js");
const { Telegraf } = require("telegraf");
const cron = require('node-cron');

const { insertSubscription } = require("./helpers/insertSubscription");
const { addDaysToNow } = require("./helpers/addDaysToNow");
const { getAllSubscriptions} = require("./helpers/getAllSubscriptions");
const { removeExpiredMembers} = require("./helpers/removeExpiredMembers");
const bot = new Telegraf(process.env.BOT_TOKEN);

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_KEY;
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);




bot.help((ctx) => ctx.reply("نحن هنا لمساعدتك"));

bot.start (async (ctx) => {
  const first_name = ctx.from.first_name;
  const last_name = ctx.from.last_name;
  const user_name = ctx.from.username;
  const user_id = ctx.from.id;
  let isActive = false;
 
  if (first_name === undefined && last_name === undefined) {
    if (user_name === undefined) {
      return ctx.reply("أهلًا وسهلًا بك في الإنجاز البحثي");
    }
    ctx.reply(`أهلًا وسهلًا بك في الإنجاز البحثي ${user_name}!`);
  }

  if (ctx.chat.type === "group" || ctx.chat.type === "supergroup") {
    ctx.reply("يمكنك استخدام البوت في الدردشة الخاصة ");
  } else if (isActive === false) {
    let count = await getAllSubscriptions.getLastCount();
    console.log('The last count is:', count);
    ctx.reply(`أهلًا وسهلًا بك ${first_name} ${last_name} في الإنجاز البحثي`);
    ctx.reply(`هذا هو رقمك الشخصي: ${count}`);
    count++;
    isActive = true;

   const subscription_end = addDaysToNow();
    await insertSubscription(user_id, user_name, subscription_end,isActive,first_name,last_name,count);
    
  } else {
 
    const count= await getAllSubscriptions.getUserCount(user_id)
    ctx.reply(`رقمك الشخصي هو: <b>${count}</b>`, { parse_mode: "HTML" });
  }
});


// _______________________________________________________________________RemoveMEber_______________________________________




cron.schedule('0 0 * * *', () => {
  console.log('Running removeExpiredMembers at midnight...');
  
  removeExpiredMembers().then((error) => {
    if (error) {
      console.error("Failed to process expired members:", error);
      return;
    }
    console.log("Completed processing expired members.");
  }).catch((err) => {
    console.error("An error occurred during the execution of removeExpiredMembers:", err);
  });
});













bot
  .launch()
  .then(() => console.log("Bot is running..."))
  .catch((err) => console.error("Failed to start bot:", err));

console.log("Bot is running...");
