// src/utils/chatbotService.js
// ⚠️ الـ API Key بتيجي من .env - مش من هنا مباشرةً

const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";

const SYSTEM_PROMPT = `أنت مساعد ذكي لموقع Campus Market - سوق إلكتروني مخصص لطلاب الجامعة.

مهامك:
- مساعدة المستخدمين في البحث عن المنتجات والإجابة على أسئلتهم
- تقديم نصائح للبيع والشراء داخل المجتمع الجامعي
- شرح كيفية استخدام الموقع (التسجيل، رفع المنتجات، إدارة الحساب)
- الإجابة باللغة العربية أو الإنجليزية حسب سؤال المستخدم

قواعد مهمة:
- كن ودوداً ومختصراً في إجاباتك
- إذا سُئلت عن شيء خارج نطاق الموقع، وجّه المستخدم بلطف
- لا تشارك معلومات شخصية أو بيانات حساسة`;

/**
 * إرسال رسالة للـ Groq API والحصول على رد
 * @param {Array} messages - تاريخ المحادثة
 * @returns {Promise<string>} - رد المساعد
 */
export const sendMessageToGroq = async (messages) => {
  const apiKey = process.env.REACT_APP_GROQ_API_KEY;

  if (!apiKey) {
    throw new Error("GROQ_API_KEY غير موجود. تأكد من إضافته في ملف .env");
  }

  const response = await fetch(GROQ_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: "llama-3.3-70b-versatile", // أسرع موديل في Groq
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        ...messages,
      ],
      max_tokens: 1024,
      temperature: 0.7,
      stream: false,
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error?.message || "فشل الاتصال بـ Groq API");
  }

  const data = await response.json();
  return data.choices[0]?.message?.content || "عذراً، لم أتمكن من الرد.";
};
