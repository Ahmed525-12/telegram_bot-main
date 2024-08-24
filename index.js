require("dotenv").config();
const { createClient } = require("@supabase/supabase-js");
const { Telegraf } = require("telegraf");

const { checkUniqueMember } = require("./helpers/checkUniqueMember");
const { insertSubscription } = require("./helpers/insertSubscription");
const { addDaysToNow } = require("./helpers/addDaysToNow");
const { getAllSubscriptions} = require("./helpers/getAllSubscriptions");

const bot = new Telegraf(process.env.BOT_TOKEN);
const GROUP_CHAT_ID = process.env.GROUP_CHAT_ID;
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_KEY;
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);




let isActive = false;
bot.help((ctx) => ctx.reply("نحن هنا لمساعدتك"));

bot.start (async (ctx) => {
  const first_name = ctx.from.first_name;
  const last_name = ctx.from.last_name;
  const user_name = ctx.from.username;
  const user_id = ctx.from.id;
 
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

bot
  .launch()
  .then(() => console.log("Bot is running..."))
  .catch((err) => console.error("Failed to start bot:", err));

console.log("Bot is running...");
