require("dotenv").config();

const { Telegraf } = require("telegraf");
const cron = require("node-cron");

const Keep_alive= require("./Keep_alive.js")

const { insertSubscription } = require("./helpers/insertSubscription");
const { addDaysToNow } = require("./helpers/addDaysToNow");
const { getAllSubscriptions } = require("./helpers/getAllSubscriptions");
const { removeExpiredMembers } = require("./helpers/removeExpiredMembers");
const { quitMessageMember } = require("./helpers/quitMember");
const bot = new Telegraf(process.env.BOT_TOKEN);







  const GreetingMessage =
  "حيّا هلًا بك🌻\nفي بيئة الإنجاز البحثي التحفيزية والتفاعلية، نسير معاً في ركب واحد، عزيمة الفرد منا وقود المجتمع، وإذا تراخت همة أحدنا تداعت له سائر الأعضاء، فخذت بيده وشدّدت من عزيمته.";

bot.start(async (ctx) => {
  const first_name = ctx.from.first_name || "غير معرف";
  const last_name = ctx.from.last_name || "غير معرف";
  const user_name = ctx.from.username || "غير معرف";
  const user_id = ctx.from.id;
  let isActive = await getAllSubscriptions.getIsActive(user_id);

  // Check if the user is in a group or supergroup
  if (ctx.chat.type === "group" || ctx.chat.type === "supergroup") {
    ctx.reply("يمكنك استخدام البوت في الدردشة الخاصة");
    ctx.reply("اضغط هنا--->  t.me/enjaz_nadeem_bot");
    return;
  }

  if (isActive === true) {
    const count = await getAllSubscriptions.getUserCount(user_id);
    ctx.reply(`رقمك الشخصي هو: <b>${count}</b>`, { parse_mode: "HTML" });
    return;
  }

  const lastCount = await getAllSubscriptions.getLastCount();
  const isUserExist = await getAllSubscriptions.isUserExist(user_id);

  const subscription = await getAllSubscriptions.IsSubscriptionEnd(user_id);

  if (isActive === false && isUserExist === true && subscription === true) {
    ctx.reply("لقد انتهى اشتراكك السابق، يمكنك تجديد اشتراكك الحالي");
    ctx.reply("اضغط هنا--->  /renew");
    return;
  }

  if (isActive === false) {
    // Check if the user is already subscribed
    await insertSubscription.insertSubNumber(user_id, lastCount + 1);

    console.log("The last count is:", lastCount + 1);


    ctx.reply(`هذا هو رقمك الشخصي: ${lastCount + 1} \n\nرابط الهدية من الإنجاز البحثي:\nhttps://drive.google.com/file/d/1K-pZbE9YHr_GAJsoi-3XGclzpzJnR-5J/view?usp=share_link`);
    ctx.reply(GreetingMessage);
   
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

cron.schedule("0 0 * * * *", () => {
  console.log("Running removeExpiredMembers at midnight...");
  quitMessageMember().then((error) => {
    if (error) {
      console.error("Failed to process Send a message to members:", error);
      return;
    }
   
    console.log("Completed processing Send a message to members.");
  })
  .catch((err) => {
    console.error(
      "An error occurred during the execution of removeExpiredMembers:",
      err
    );
  });


  removeExpiredMembers()
    .then((error) => {
      if (error) {
        console.error("Failed to process expired members:", error);
        return;
      }
      insertSubscription.updateIsActive(user_id, false);
      console.log("Completed processing expired members.");
    })
    .catch((err) => {
      console.error(
        "An error occurred during the execution of removeExpiredMembers:",
        err
      );


 
    });
});

bot.command("renew", async (ctx) => {
  ctx.reply("contact us : 00966556673350");
});


bot
  .launch()
  .then(() => console.log("Bot is running..."))
  .catch((err) => console.error("Failed to start bot:", err));

console.log("Bot is running...");
