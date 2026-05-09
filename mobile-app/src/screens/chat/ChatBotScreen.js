import React, { useState, useRef, useEffect } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  ScrollView, StyleSheet, ActivityIndicator,
  KeyboardAvoidingView, Platform
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
const GROQ_API_KEY = process.env.EXPO_PUBLIC_GROQ_API_KEY;

const SYSTEM_PROMPT = `أنت مساعد ذكي لتطبيق Campus Market، سوق إلكتروني للطلاب الجامعيين في مصر.
مهمتك الإجابة على أسئلة الزوار والمستخدمين باللغة العربية بشكل ودي ومختصر.
معلومات عن التطبيق:
- Campus Market هو سوق إلكتروني يتيح للطلاب بيع وشراء المنتجات داخل الجامعة.
- يمكن للمستخدمين نشر إعلانات للمنتجات المستعملة أو الجديدة.
- يمكن التواصل مع البائع عبر رقم الهاتف.
- يمكن تقييم البائع والمنتج بعد الشراء.
- التطبيق مجاني للاستخدام.
- يمكن تصفح المنتجات حسب الفئة والحالة.
قواعد:
- أجب دائماً بالعربية.
- كن ودياً ومختصراً.
- لو السؤال خارج نطاق التطبيق، قل إنك متخصص فقط في Campus Market.`;

export default function ChatBotScreen() {
  const [messages, setMessages] = useState([
    { id: '1', role: 'assistant', text: 'مرحباً! 👋 أنا مساعد Campus Market. كيف يمكنني مساعدتك؟' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 100);
  }, [messages]);

  const sendMessage = async () => {
    const text = input.trim();
    if (!text || loading) return;

    const userMsg = { id: Date.now().toString(), role: 'user', text };
    const updatedMessages = [...messages, userMsg];
    setMessages(updatedMessages);
    setInput('');
    setLoading(true);

    try {
      const history = updatedMessages.slice(1).map(m => ({
        role: m.role === 'user' ? 'user' : 'assistant',
        content: m.text
      }));

      const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + GROQ_API_KEY
        },
        body: JSON.stringify({
         model: 'llama-3.1-8b-instant',
          messages: [
            { role: 'system', content: SYSTEM_PROMPT },
            ...history
          ],
          max_tokens: 1000,
          temperature: 0.7
        })
      });

      const data = await response.json();

      if (data.error) {
        console.log('Groq Error:', data.error.message);
        throw new Error(data.error.message);
      }

      const reply = data.choices?.[0]?.message?.content || 'عذراً، حدث خطأ ما.';

      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        role: 'assistant',
        text: reply
      }]);
    } catch (err) {
      console.log('Error:', err);
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        role: 'assistant',
        text: 'عذراً، حدث خطأ في الاتصال. حاول مرة أخرى.'
      }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={90}
    >
      <ScrollView
        ref={scrollRef}
        style={styles.messagesContainer}
        contentContainerStyle={{ padding: 16, gap: 12 }}
      >
        {messages.map(msg => (
          <View
            key={msg.id}
            style={[styles.bubble, msg.role === 'user' ? styles.userBubble : styles.botBubble]}
          >
            {msg.role === 'assistant' && (
              <View style={styles.botIcon}>
                <Ionicons name="chatbubble-ellipses" size={14} color="#fff" />
              </View>
            )}
            <Text style={[styles.bubbleText, msg.role === 'user' ? styles.userText : styles.botText]}>
              {msg.text}
            </Text>
          </View>
        ))}

        {loading && (
          <View style={[styles.bubble, styles.botBubble]}>
            <View style={styles.botIcon}>
              <Ionicons name="chatbubble-ellipses" size={14} color="#fff" />
            </View>
            <ActivityIndicator size="small" color="#007BFF" style={{ paddingHorizontal: 10 }} />
          </View>
        )}
      </ScrollView>

      {messages.length === 1 && (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.suggestions}
          contentContainerStyle={{ gap: 8, paddingHorizontal: 16 }}
        >
          {['كيف أبيع منتج؟', 'كيف أشتري؟', 'كيف أقيّم البائع؟', 'هل التطبيق مجاني؟'].map(q => (
            <TouchableOpacity key={q} style={styles.suggestionBtn} onPress={() => setInput(q)}>
              <Text style={styles.suggestionText}>{q}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}

      <View style={styles.inputRow}>
        <TextInput
          style={styles.input}
          placeholder="اكتب سؤالك هنا..."
          value={input}
          onChangeText={setInput}
          onSubmitEditing={sendMessage}
          returnKeyType="send"
          multiline
          maxLength={500}
        />
        <TouchableOpacity
          style={[styles.sendBtn, (!input.trim() || loading) && styles.sendBtnDisabled]}
          onPress={sendMessage}
          disabled={!input.trim() || loading}
        >
          <Ionicons name="send" size={20} color="#fff" />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  messagesContainer: { flex: 1 },
  bubble: {
    maxWidth: '80%', borderRadius: 16, padding: 12,
    flexDirection: 'row', alignItems: 'flex-start', gap: 8
  },
  userBubble: { backgroundColor: '#007BFF', alignSelf: 'flex-end', flexDirection: 'row-reverse' },
  botBubble: { backgroundColor: '#fff', alignSelf: 'flex-start', elevation: 1 },
  bubbleText: { fontSize: 15, lineHeight: 22, flexShrink: 1 },
  userText: { color: '#fff', textAlign: 'right' },
  botText: { color: '#1a1a1a' },
  botIcon: {
    width: 24, height: 24, borderRadius: 12,
    backgroundColor: '#007BFF', justifyContent: 'center', alignItems: 'center'
  },
  suggestions: { maxHeight: 50, marginBottom: 8 },
  suggestionBtn: { backgroundColor: '#e8f0fe', borderRadius: 20, paddingHorizontal: 14, paddingVertical: 8 },
  suggestionText: { color: '#007BFF', fontSize: 13 },
  inputRow: {
    flexDirection: 'row', alignItems: 'flex-end', gap: 10,
    padding: 12, backgroundColor: '#fff', borderTopWidth: 1, borderTopColor: '#eee'
  },
  input: {
    flex: 1, backgroundColor: '#f5f5f5', borderRadius: 20,
    paddingHorizontal: 16, paddingVertical: 10, fontSize: 15, maxHeight: 100
  },
  sendBtn: { width: 44, height: 44, borderRadius: 22, backgroundColor: '#007BFF', justifyContent: 'center', alignItems: 'center' },
  sendBtnDisabled: { backgroundColor: '#a0c4ff' },
});