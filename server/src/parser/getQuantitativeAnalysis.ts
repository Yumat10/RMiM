import { Database } from "sql.js";

// Fetches instances where texting significantly exceeds the average.
export async function getBingeTexterAlerts(db: Database) {
  const sql = `
    WITH hourly_stats AS (
        SELECT
        strftime('%Y-%m-%d %H', datetime(date / 1000000000 + 978307200, 'unixepoch')) AS hour,
        count(*) as messages
        FROM message
        WHERE is_from_me = 1 -- Sent messages
        GROUP BY hour
    ),
    average_stats AS (
        SELECT avg(messages) as avg_messages_per_hour FROM hourly_stats
    )
    SELECT hour, messages
    FROM hourly_stats, average_stats
    WHERE messages > avg_messages_per_hour * 2 -- Adjust multiplier as needed
    ORDER BY messages DESC
    LIMIT 5;
    `;
  const res = db.exec(sql);
  return res;
}

// Identifies days with the highest number of active conversations.
export async function getSerialConversationalist(db: Database) {
  const sql = `
    SELECT
    date(datetime(m.date / 1000000000 + 978307200, 'unixepoch', 'localtime')) AS day,
    count(DISTINCT cmj.chat_id) as active_chats
    FROM message m
    JOIN chat_message_join cmj ON cmj.message_id = m.ROWID
    WHERE m.is_from_me = 1
    GROUP BY day
    ORDER BY active_chats DESC
    LIMIT 5;
    `;
  const res = db.exec(sql);
  return res;
}

// Compares the volume of texts sent in the morning vs. night.
export async function getEarlyBirdVsNightOwl(db: Database) {
  const sql = `
    SELECT
    (SELECT count(*) FROM message WHERE is_from_me = 1 AND strftime('%H', datetime(date / 1000000000 + 978307200, 'unixepoch')) < '09') as morning_texts,
    (SELECT count(*) FROM message WHERE is_from_me = 1 AND strftime('%H', datetime(date / 1000000000 + 978307200, 'unixepoch')) >= '21') as night_texts
    FROM message
    LIMIT 1;
    `;
  const res = db.exec(sql);
  return res;
}

// Finds the longest streak of texts sent without a reply.
// export async function getMonologueMaster(db: Database) {
//   // Note: This query is illustrative. Crafting an exact query to calculate streaks without replies would require more complex logic and potentially processing outside of SQL.
//   const sql = `
//     SELECT cmj.chat_id, count(*) as consecutive_messages
//     FROM message
//     JOIN chat_message_join cmj ON cmj.message_id = message.ROWID
//     WHERE is_from_me = 1
//     GROUP BY cmj.chat_id, (date / 300) -- Group by every 5 minutes
//     ORDER BY consecutive_messages DESC
//     LIMIT 5;
//     `;
//   const res = db.exec(sql);
//   return res;
// }

// Identifies the most used emojis.
// export async function getEmojiMoodRing(db: Database) {
//   const sql = `
//     SELECT count(*) as usage_count, '😂' as emoji
//     FROM message
//     WHERE text LIKE '%😂%'
//     `;
//   const res = db.exec(sql);
//   return res;
// }
