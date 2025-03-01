const { Catbox } = require("node-catbox");
const fs = require("fs");
const path = require("path");
const { downloadAndSaveMediaMessage } = require("@whiskeysockets/baileys");

// Initialize Catbox
const catbox = new Catbox();

// Function to upload a file to Catbox and return the URL
async function uploadToCatbox(filePath) {
  if (!fs.existsSync(filePath)) {
    throw new Error("File does not exist");
  }
  try {
    const uploadResult = await catbox.uploadFile({ path: filePath });
    if (uploadResult) {
      return uploadResult;
    } else {
      throw new Error("Error retrieving file link");
    }
  } catch (error) {
    throw new Error(String(error));
  }
}

module.exports = async (context) => {
  const { client, m } = context;

  // Get quoted media or current message
  let q = m.quoted ? m.quoted : m;
  let mime = (q.msg || q).mimetype || "";

  // Check if mime type exists
  if (!mime) return m.reply("Please quote or send a media file.");

  // Download media buffer
  let mediaBuffer = await q.download();

  // Check if media is too large
  if (mediaBuffer.length > 10 * 1024 * 1024) {
    return m.reply("Media is too large. Please upload a file smaller than 10MB.");
  }

  // Supported MIME types
  const supportedMimeTypes = [
    "image/png",
    "image/jpeg",
    "image/jpg",
    "image/gif",
    "video/mp4",
    "audio/mpeg",
    "audio/ogg",
    "audio/wav",
    "audio/webm",
    "image/webp",
  ];

  // Check if the media is supported
  if (supportedMimeTypes.includes(mime)) {
    try {
      // Download and save the media file
      let filePath = await downloadAndSaveMediaMessage(q, {
        logger: console,
        savePath: path.join(__dirname, "temp"),
      });

      // Upload to Catbox
      let link = await uploadToCatbox(filePath);

      // Calculate file size
      const fileSizeMB = (mediaBuffer.length / (1024 * 1024)).toFixed(2);

      // Send media link to user
      m.reply(`Media Link:\n\n${link}`);

      // Clean up: Delete the temporary file
      fs.unlinkSync(filePath);
    } catch (error) {
      m.reply("Error uploading media. Please try again later.");
      console.error(error); // Log any error to the console for debugging
    }
  } else {
    m.reply("Unsupported media format. Please send a supported file.");
  }
};
