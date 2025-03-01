const { getContextInfo, sendReply } = require(__dirname + "/../../lib/context"); // // Import sendReply from context.js

module.exports = async (context) => {
  const { client, m } = context;

  try {
    // Fetch repository data from GitHub
    const response = await fetch("https://api.github.com/repos/Keithkeizzah/KEITH-MD");
    const repoData = await response.json();

    // Extract relevant information
    const repoInfo = {
      stars: repoData.stargazers_count,
      forks: repoData.forks_count,
      lastUpdate: repoData.updated_at,
      owner: repoData.owner.login,
      createdAt: repoData.created_at,
      url: repoData.html_url
    };

    // Format dates
    const createdDate = new Date(repoInfo.createdAt).toLocaleDateString("en-GB");
    const lastUpdateDate = new Date(repoInfo.lastUpdate).toLocaleDateString("en-GB");

    // Construct message caption
    const messageCaption = `
      *Hello ,,,👋 This is 𝐊𝐄𝐈𝐓𝐇-𝐌𝐃*
      The best bot in the universe developed by Kᴇɪᴛʜ Kᴇɪᴢᴢᴀʜ. Fork and give a star 🌟 to my repo
      ╭───────────────────
      │✞ *Stars:* ${repoInfo.stars}
      │✞ *Forks:* ${repoInfo.forks}
      │✞ *Release Date:* ${createdDate}
      │✞ *Last Update:* ${lastUpdateDate}
      │✞ *Owner:* ${repoInfo.owner}
      │✞ *Repository:* ${repoInfo.url}
      │✞ *Session:* https://keith-sessions-pi5z.onrender.com
      ╰───────────────────
    `;

    // Send the generated message to the user with contextInfo
    await sendReply(client, m, messageCaption, {
      contextInfo: {
        externalAdReply: {
          title: "🌟 𝐊𝐄𝐈𝐓𝐇-𝐌𝐃 ✨",
          body: "𝐫𝐞𝐠𝐚𝐫𝐝𝐬 𝐊𝐞𝐢𝐭𝐡𝐤𝐞𝐢𝐳𝐳𝐚𝐡",
          sourceUrl: "https://whatsapp.com/channel/0029Vaan9TF9Bb62l8wpoD47",
          mediaType: 1,
          renderLargerThumbnail: true
        }
      }
    });

  } catch (error) {
    console.error("Error:", error);
    await sendReply(client, m, 'An unexpected error occurred while generating the repo information.'); // Use sendReply for error messages
  }
};
