const addDaysToNow = () => {
  const now = new Date();
  const futureDate = new Date(now.setDate(now.getDate() + 30));

  // Convert to timestamp with time zone (ISO 8601 format)
  const timestampz = futureDate.toISOString();

  return timestampz;
};

/**
 * Call addDaysToNow Example
 * addDaysToNow(); // Returns a timestamp with timezone
 */

exports.addDaysToNow = addDaysToNow;
