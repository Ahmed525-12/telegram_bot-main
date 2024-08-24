const { createClient } = require("@supabase/supabase-js");
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_KEY;
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

const insertSubscription = async (
  user_id,
  user_name,
  subscription_end,
  isActive,
  first_name,
  last_name
) => {
  const { error } = await supabase
    .from("Subscriptions") // Table name
    .update([
      {
        first_name: first_name,
        last_name: last_name,
        user_name: user_name,

        subscription_end: subscription_end,
        isActive: isActive,
      },
    ])
    .eq("user_id", user_id);

  if (error) {
    console.error("Error inserting data:", error);
    return null;
  }
};

/**
 * Call insertSubscription Example
 */

// const userId = "123456";
// const userName = "JohnDoe";
// const subscriptionEnd = "2024-09-23T13:45:30.123Z"; // Timestamp with timezone

// insertSubscription(userId, userName, subscriptionEnd);

const insertSubNumber = async (user_id, sub_number) => {
  const { error } = await supabase.from("Subscriptions").insert([
    {
      user_id: user_id,
      sub_number: sub_number,
    },
  ]);

  if (error) {
    console.error("Error updating data:", error);
    return null;
  }
};

exports.insertSubscription = { insertSubscription, insertSubNumber };
