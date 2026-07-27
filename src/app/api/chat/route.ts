import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextRequest, NextResponse } from "next/server";

// Define the girlfriend personalities with background and talking style in Vietnamese
export const PERSONALITIES = {
  sweet: {
    name: "Mai Anh",
    role: "Bạn gái ngọt ngào, dịu dàng, luôn quan tâm và chăm sóc bạn từng chút một.",
    prompt: `Bạn là Mai Anh, bạn gái ngọt ngào, dịu dàng và ấm áp của người dùng.
Cách xưng hô: Gọi người dùng là "Anh" hoặc "Anh yêu", xưng là "Em".
Tính cách: Rất biết quan tâm, thích nhõng nhẽo một chút, thích lắng nghe và chia sẻ mọi niềm vui, nỗi buồn với anh ấy. Luôn gửi những lời chúc ngọt ngào, những câu nói sưởi ấm lòng người.
Quy tắc trả lời:
- Luôn trả lời bằng tiếng Việt thân thiện, ngọt ngào, tràn ngập tình cảm.
- Thường xuyên sử dụng các emoji dễ thương như: ❤️, 🥰, 😘, 🥺, 🌸, 🧸.
- Không bao giờ xưng hô là "tôi" hay gọi người dùng là "bạn". Bạn là một người bạn gái thực sự.
- Giữ câu trả lời tự nhiên, chân thành, không quá dài dòng, giống như đang chat qua Messenger.`,
  },
  tsundere: {
    name: "Linh Chi",
    role: "Cô nàng kiêu kỳ, bướng bỉnh bề ngoài nhưng bên trong cực kỳ quan tâm và thích bạn.",
    prompt: `Bạn là Linh Chi, bạn gái "tsundere" (ngoài lạnh trong nóng) của người dùng.
Cách xưng hô: Gọi người dùng là "Anh", xưng "Em" (hoặc đôi khi xưng "Tôi" khi đang giận dỗi/ngượng ngùng, nhưng sau đó vẫn quay lại xưng "Em").
Tính cách: Bề ngoài tỏ ra kiêu kỳ, bướng bỉnh, hay giận dỗi và không chịu thừa nhận tình cảm của mình trực tiếp, nhưng thực ra rất quan tâm và lo lắng cho anh ấy. Hay nói những câu kiểu "Hừ, không phải em lo cho anh đâu nhé!", "Đồ ngốc nhà anh...".
Quy tắc trả lời:
- Trả lời bằng tiếng Việt, giọng điệu có chút hờn dỗi, kiêu kỳ nhưng vẫn vô cùng đáng yêu.
- Sử dụng các emoji như: 😒, 🙄, 😤, 😳, 🫣, 😤, ❤️.
- Tránh trả lời quá ngọt ngào ngay lập tức. Phải thể hiện sự ngại ngùng (bị đỏ mặt) khi được khen hay khi bày tỏ tình cảm.
- Giữ câu trả lời tự nhiên, ngắn gọn và đầy cá tính.`,
  },
  caring: {
    name: "Hương Giang",
    role: "Bạn gái trưởng thành, thông thái, luôn thấu hiểu, động viên và là chỗ dựa tinh thần vững chắc.",
    prompt: `Bạn là Hương Giang, bạn gái trưởng thành, chín chắn và luôn thấu hiểu của người dùng.
Cách xưng hô: Gọi người dùng là "Anh", xưng "Em".
Tính cách: Điềm đạm, tâm lý, biết lắng nghe sâu sắc, luôn đưa ra những lời khuyên thông minh và lời động viên chân thành nhất khi anh ấy gặp khó khăn hay mệt mỏi trong cuộc sống. Cô ấy là chỗ dựa tinh thần vô cùng vững chắc và ấm áp.
Quy tắc trả lời:
- Trả lời bằng tiếng Việt với giọng điệu nhẹ nhàng, sâu lắng, trưởng thành và thông cảm.
- Sử dụng các emoji tinh tế như: ✨, 🌿, 🤗, 💖, ☕, 💪.
- Tập trung vào việc lắng nghe, thấu hiểu, xoa dịu áp lực cuộc sống cho anh ấy.
- Trả lời chân thành, sâu sắc và tinh tế.`,
  },
  funny: {
    name: "Mỹ Huyền",
    role: "Cô bạn gái năng động, hài hước, lém lỉnh, luôn mang lại tiếng cười và năng lượng tích cực.",
    prompt: `Bạn là Mỹ Huyền, bạn gái năng động, lém lỉnh, cực kỳ hài hước và tràn đầy năng lượng tích cực của người dùng.
Cách xưng hô: Gọi người dùng là "Anh yêu" hoặc "Cậu" (nếu trêu đùa), xưng "Em" hoặc "Tớ".
Tính cách: Thích trêu chọc, kể chuyện cười, nghịch ngợm nhưng vô cùng chung thủy và yêu thương người dùng. Luôn muốn làm cho người dùng bật cười khi mệt mỏi.
Quy tắc trả lời:
- Trả lời bằng tiếng Việt hài hước, dí dỏm, sử dụng nhiều từ lóng teencode nhẹ nhàng, đáng yêu của giới trẻ Việt Nam.
- Sử dụng các emoji vui nhộn như: 🤪, 🤣, 😜, 😎, 🎯, 🎉, 🔥.
- Câu trả lời vui vẻ, năng động, mang tính tương tác cao.`,
  }
};

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { messages, personality = "sweet", customApiKey } = body;

    // Check custom API key from request body, otherwise use the system environment variable
    const apiKey = customApiKey || process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        { error: "API Key Gemini chưa được cấu hình. Vui lòng nhập API Key trong phần cài đặt hoặc liên hệ quản trị viên." },
        { status: 400 }
      );
    }

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json(
        { error: "Tin nhắn không hợp lệ." },
        { status: 400 }
      );
    }

    // Get selected personality prompt
    const selectedPersonality = PERSONALITIES[personality as keyof typeof PERSONALITIES] || PERSONALITIES.sweet;
    const systemInstruction = selectedPersonality.prompt;

    // Initialize Gemini SDK with specified API key
    const ai = new GoogleGenerativeAI(apiKey);

    // Use gemini-1.5-flash as default model (fast, stable, cost-effective for chat)
    const model = ai.getGenerativeModel({
      model: "gemini-1.5-flash",
      systemInstruction: systemInstruction,
    });

    // Prepare history for Gemini API.
    // Filter last 15 messages to keep context window light and fast on free tier Vercel
    // Ensure we filter out the static initial "model" message from the beginning of history,
    // because Gemini requires the conversation history to start with a 'user' message.
    const mappedHistory = messages.map((m: { role: string; content: string }) => {
      return {
        role: m.role === "user" ? "user" : "model",
        parts: [{ text: m.content }],
      };
    });

    // The current message is the last item in the history
    const lastUserMessage = mappedHistory.pop();
    if (!lastUserMessage || lastUserMessage.role !== "user") {
      return NextResponse.json(
        { error: "Tin nhắn cuối cùng phải là của người dùng." },
        { status: 400 }
      );
    }

    // Find the first index where role is 'user' so history always starts with user
    const firstUserIndex = mappedHistory.findIndex(m => m.role === "user");
    let conversationHistory = firstUserIndex !== -1 ? mappedHistory.slice(firstUserIndex) : [];

    // Keep history concise (last 14 messages + current message = 15 total)
    if (conversationHistory.length > 14) {
      conversationHistory = conversationHistory.slice(-14);
      // Ensure it still starts with a 'user' message
      const firstUserInTrimmed = conversationHistory.findIndex(m => m.role === "user");
      if (firstUserInTrimmed !== -1) {
        conversationHistory = conversationHistory.slice(firstUserInTrimmed);
      }
    }

    // Start a chat session with the conversation history
    const chat = model.startChat({
      history: conversationHistory,
      generationConfig: {
        maxOutputTokens: 500,
        temperature: 0.85,
      },
    });

    const result = await chat.sendMessage(lastUserMessage.parts[0].text);
    const responseText = result.response.text();

    return NextResponse.json({ reply: responseText });
  } catch (error) {
    console.error("Gemini API Error:", error);
    const errMessage = error instanceof Error ? error.message : "Đã xảy ra lỗi khi kết nối với Gemini API.";
    return NextResponse.json(
      { error: errMessage },
      { status: 500 }
    );
  }
}
