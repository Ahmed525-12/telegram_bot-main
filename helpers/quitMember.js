const { createClient } = require("@supabase/supabase-js");
const { Telegraf } = require("telegraf");
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_KEY;
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
const bot = new Telegraf(process.env.BOT_TOKEN);

const quitMessageMember = async function quitMessageMember() {
   
    const now = new Date();
    
    const { data: members, error } = await supabase
      .from("Subscriptions")
      .select("*")
      .eq("subscription_end",  now.toISOString());// Filter by subscriptions ending exactly four days from now
    
    if (error) {
      console.error("Failed to fetch members:", error);
      return;
    }
    
   
    if (members.length === 0) {
      console.log("No subscriptions ending exactly found.");
      return;
    }
    
    // Continue with your logic for members with subscriptions ending in four days
  

  
    // Process each expired member
    for (const member of members) {
      try {
        const QuitMessage =
        `لقد بلغ بنا الطريق نهايته 👋🛣\nومازالت لرحلتنا بقية وأيادينا مرحبة بأصدقاء الإنجاز البحثي، فإذا رغبت  بتجديد اشتراك نأمل التواصل معنا عبر الواتس آب: \n00966556673350\nوإذا اخترت المضي دون صحبتنا فلا تنس مشاركتنا خبر إنجازك وتسليم رسالتك.. \n\n${member.first_name}\nدمت بخير🌻`;
        console.log(`message user ${member.first_name} from the group...`);
        await bot.telegram
          .sendMessage(member.user_id,QuitMessage )
          .then((data) => {
            console.log(
              `User ${member.user_id} has been removed from the group.`
            );
           
          });
      } catch (err) {
        console.error(
          `Failed to remove user ${member.user_id} from the group:, err`
        );
      }
    }
  };
  
  
  exports.quitMessageMember= quitMessageMember;
  