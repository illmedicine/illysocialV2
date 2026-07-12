import { Anthropic } from "@anthropic-ai/sdk";

const client = new Anthropic({
  apiKey: import.meta.env.VITE_ANTHROPIC_API_KEY,
  dangerouslyAllowBrowser: true,
});

export const generateFanpageHTML = async (creatorData) => {
  const { youtubeHandle, instagramUrl, cornerNickname, displayName } = creatorData;

  const prompt = `You are a creative web designer. Generate a custom, visually unique HTML fanpage for a content creator. The fanpage should:

Creator Info:
- Name: ${displayName || cornerNickname}
- YouTube: @${youtubeHandle}
- Instagram: ${instagramUrl || "Not provided"}
- Fanpage URL: illy-ris.com/movie/${cornerNickname}/

Requirements:
1. Create a single, self-contained HTML file (no external dependencies)
2. Use inline CSS and JavaScript only
3. Design should be unique and reflect a modern creator aesthetic
4. Include:
   - Hero section with creator name and tagline
   - Sections for YouTube and Instagram (if provided)
   - Call-to-action buttons linking to their social media
   - Message/comment section placeholder
   - Donation/support section with generic payment link placeholders
5. Use a color scheme that feels premium and creative
6. Include smooth animations and transitions
7. Make it fully responsive for mobile and desktop
8. Use a dark theme with vibrant accent colors (similar to Illy Social R&D Labs aesthetic)
9. Footer with links and branding

Generate ONLY the HTML code, starting with <!DOCTYPE html> and ending with </html>. Include all CSS in <style> tags and all JavaScript in <script> tags.`;

  try {
    const response = await client.messages.create({
      model: "claude-opus-4-1",
      max_tokens: 4000,
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
    });

    const htmlContent = response.content[0].text;

    // Validate that it starts with <!DOCTYPE
    if (!htmlContent.includes("<!DOCTYPE")) {
      throw new Error("Generated content does not appear to be valid HTML");
    }

    return {
      success: true,
      html: htmlContent,
      cornerNickname,
      createdAt: new Date().toISOString(),
    };
  } catch (err) {
    console.error("Fanpage generation error:", err);
    return {
      success: false,
      error: err.message || "Failed to generate fanpage",
    };
  }
};
