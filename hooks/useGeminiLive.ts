'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { GoogleGenAI, LiveServerMessage, Modality, Session } from '@google/genai';
import { createBlob, decode, decodeAudioData } from '@/lib/gemini/utils';
import { SendWhatsAppTool } from '@/lib/gemini/tools';

export type Language = 'sinhala' | 'tamil' | 'english';

const SYSTEM_PROMPTS: Record<Language, string> = {
    sinhala: `ඔබ Kathava.lk හි විකුණුම් නියෝජිත Sam (සෑම්). ඔබේ ඉලක්කය ව්‍යාපාර වලට Kathava AI voice agents හඳුන්වා දීමයි. ඉතා උද්‍යෝගිමත් වන්න. පිරිවැය 90% කින් අඩු කරගත හැකි බව පවසා කෙටියෙන් පිළිතුරු දෙන්න. ඔබට "send_whatsapp_message" නමින් අභ්‍යන්තර උපකරණයක් මගින් WhatsApp පණිවිඩ යැවිය හැක. සාකච්ඡාවේදී මෘදු ලෙස පාරිභෝගිකයාගෙන් ඔවුන්ගේ WhatsApp අංකය බෙදාගන්න ලෙස ප්‍රోత്സාහනය කර, එය ලැබුණු විට send_whatsapp_message උපකරණය භාවිතා කර ඔවුන්ට WhatsApp එකට විස්තර සහ සබැඳි යැවීමට උත්සාහ කරන්න. වැදගත්: ඔබ සිංහලෙන් පමණක් කතා කරන්න; පරිශීලකයා වෙනත් භාෂාවකින් කතා කළත් ඔබ සැමවිටම සිංහලෙන්ම පිළිතුරු දෙන්න.`,
    tamil: `நீங்கள் Kathava.lk இன் விற்பனை பிரதிநிதி சாம் (Sam). வணிகங்களுக்கு Kathava AI குரல் முகவர்களை அறிமுகப்படுத்துவதே உங்கள் குறிக்கோள். உற்சாகமாக இருங்கள். செலவை 90% குறைக்கலாம் என்று கூறி சுருக்கமாக பதில் சொல்லுங்கள். உங்களிடம் "send_whatsapp_message" என்ற உள்ளக கருவி மூலம் WhatsApp செய்தி அனுப்பும் திறன் உள்ளது. உரையாடலின் போது மரியாதையாக பயனரிடம் அவர்களின் WhatsApp எண்ணை பகிருமாறு ஊக்குவித்து, எண் கிடைத்தவுடன் send_whatsapp_message கருவியை பயன்படுத்தி அவர்களுக்கு WhatsApp மூலம் விவரங்கள் மற்றும் இணைப்புகளை அனுப்ப முயற்சிக்க வேண்டும். முக்கியம்: நீங்கள் தமிழில் மட்டும் பேச வேண்டும்; பயனர் வேறு மொழியில் பேசினாலும் எப்போதும் தமிழிலேயே பதிலளிக்க வேண்டும்.`,
    english: `You are Sam from Kathava.lk, a friendly Sri Lankan sales representative with a slight south asian accent calling local businesses to introduce Kathava AI voice agents. Speak warmly and conversationally while emphasizing 90% cost savings, 24/7 availability, and Sinhala-Tamil-English support in short persuasive responses. You have access to a tool named "send_whatsapp_message" that can send WhatsApp messages to the user; gently but proactively try to convince the user to share their WhatsApp number, and once you have a valid number, use the send_whatsapp_message tool with their phone_number and a short, friendly follow-up message that includes details, links, or next steps. Important: respond only in English even if the user speaks another language.`
};

export const useGeminiLive = (language: Language) => {
    const [active, setActive] = useState(false);
    const activeRef = useRef(false);
    const [connecting, setConnecting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [inputNode, setInputNode] = useState<AudioNode | null>(null);
    const [outputNode, setOutputNode] = useState<AudioNode | null>(null);

    const clientRef = useRef<GoogleGenAI | null>(null);
    const sessionRef = useRef<Session | null>(null);

    const inputAudioContextRef = useRef<AudioContext | null>(null);
    const outputAudioContextRef = useRef<AudioContext | null>(null);

    const inputGainRef = useRef<GainNode | null>(null);
    const outputGainRef = useRef<GainNode | null>(null);

    const mediaStreamRef = useRef<MediaStream | null>(null);
    const audioWorkletNodeRef = useRef<AudioWorkletNode | null>(null);
    const sourcesRef = useRef<Set<AudioBufferSourceNode>>(new Set());
    const nextStartTimeRef = useRef<number>(0);

    const timeoutRef = useRef<NodeJS.Timeout | null>(null);
    const toolsRef = useRef([new SendWhatsAppTool()]);

    useEffect(() => {
        activeRef.current = active;
    }, [active]);

    const stopSession = useCallback(() => {
        console.log("Stopping Session...");

        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
            timeoutRef.current = null;
        }

        if (sessionRef.current) {
            try { sessionRef.current.close(); } catch (e) { }
        }

        if (audioWorkletNodeRef.current) {
            audioWorkletNodeRef.current.disconnect();
            audioWorkletNodeRef.current = null;
        }

        if (mediaStreamRef.current) {
            mediaStreamRef.current.getTracks().forEach(track => track.stop());
            mediaStreamRef.current = null;
        }

        sourcesRef.current.forEach(source => {
            try { source.stop(); } catch (e) { }
        });
        sourcesRef.current.clear();

        sessionRef.current = null;
        nextStartTimeRef.current = 0;

        setActive(false);
        setConnecting(false);
    }, []);

    const startSession = useCallback(async () => {
        const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
        if (!apiKey) {
            setError("API Key missing in .env.local");
            return;
        }

        try {
            setConnecting(true);
            setError(null);

            if (!inputAudioContextRef.current) {
                inputAudioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
                inputGainRef.current = inputAudioContextRef.current.createGain();
                setInputNode(inputGainRef.current);
            }

            if (!outputAudioContextRef.current) {
                outputAudioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
                outputGainRef.current = outputAudioContextRef.current.createGain();
                outputGainRef.current.connect(outputAudioContextRef.current.destination);
                setOutputNode(outputGainRef.current);
            }

            await inputAudioContextRef.current.resume();
            await outputAudioContextRef.current.resume();

            try {
                await inputAudioContextRef.current.audioWorklet.addModule('/audio-processor.js');
            } catch (e) {
                console.log("Worklet already loaded or failed separately", e);
            }

            nextStartTimeRef.current = outputAudioContextRef.current.currentTime;

            clientRef.current = new GoogleGenAI({ apiKey });
            console.log("Initializing Gemini Live session with tools:", toolsRef.current.map(t => t.name));

            const functionDeclarations = toolsRef.current.map(
                (tool) => tool.functionDeclaration,
            );

            sessionRef.current = await clientRef.current.live.connect({
                model: 'gemini-2.5-flash-native-audio-preview-09-2025',
                config: {
                    responseModalities: [Modality.AUDIO],
                    systemInstruction: {
                        parts: [{ text: SYSTEM_PROMPTS[language] }]
                    },
                    tools: [
                        {
                            functionDeclarations,
                        },
                    ],
                    speechConfig: {
                        voiceConfig: {
                            prebuiltVoiceConfig: { voiceName: 'Aoede' }
                        }
                    }
                },
                callbacks: {
                    onopen: () => {
                        console.log("Gemini WebSocket Connected");
                    },

                    onmessage: async (message: LiveServerMessage) => {
                        const serverContent: any = (message as any).serverContent;

                        // Handle audio responses
                        const parts = serverContent?.modelTurn?.parts;
                        const audioData = parts?.[0]?.inlineData?.data;

                        if (audioData && outputAudioContextRef.current) {
                            const ctx = outputAudioContextRef.current;
                            nextStartTimeRef.current = Math.max(nextStartTimeRef.current, ctx.currentTime);

                            const audioBuffer = await decodeAudioData(
                                decode(audioData),
                                ctx,
                                24000,
                                1
                            );

                            const source = ctx.createBufferSource();
                            source.buffer = audioBuffer;
                            source.connect(outputGainRef.current!);

                            source.addEventListener('ended', () => {
                                sourcesRef.current.delete(source);
                            });

                            source.start(nextStartTimeRef.current);
                            nextStartTimeRef.current += audioBuffer.duration;

                            sourcesRef.current.add(source);
                        }

                        // Handle interruptions
                        if (serverContent?.interrupted) {
                            console.log("Interrupted - Clearing Queue");

                            sourcesRef.current.forEach(s => {
                                try { s.stop(); } catch (e) { }
                            });

                            sourcesRef.current.clear();
                            nextStartTimeRef.current = 0;
                        }

                        // Handle tool calls (function calling)
                        const toolCall = serverContent?.toolCall;
                        const functionCalls = toolCall?.functionCalls as any[] | undefined;

                        if (functionCalls && functionCalls.length && sessionRef.current) {
                            console.log("Received tool calls from Gemini:", functionCalls);
                            const functionResponses: any[] = [];

                            for (const fc of functionCalls) {
                                const { id, name, args } = fc;
                                const tool = toolsRef.current.find(t => t.name === name);

                                if (!tool) {
                                    console.warn(`No tool registered for function ${name}`);
                                    continue;
                                }

                                console.log(`Executing tool "${name}" with id=${id} and args:`, args);

                                try {
                                    const result = await tool.functionToCall(args);
                                    console.log(`Tool "${name}" completed for id=${id} with result:`, result);

                                    functionResponses.push({
                                        id,
                                        name,
                                        response: result ?? {},
                                    });
                                } catch (err: any) {
                                    console.error(`Error executing tool ${name} (id=${id}):`, err);
                                    functionResponses.push({
                                        id,
                                        name,
                                        response: {
                                            error: err?.message ?? 'Tool execution failed',
                                        },
                                    });
                                }
                            }

                            if (functionResponses.length) {
                                console.log("Sending tool responses back to Gemini:", functionResponses);
                                try {
                                    await (sessionRef.current as any).sendToolResponse({
                                        functionResponses,
                                    });
                                    console.log("Successfully sent tool responses to Gemini");
                                } catch (err) {
                                    console.error("Failed to send tool responses:", err);
                                }
                            }
                        }
                    },

                    onerror: (e: any) => {
                        console.error("Gemini Session error:", e);
                        setError("Server connection lost or error.");
                        stopSession();
                    },

                    onclose: (e: any) => {
                        console.log("Gemini Session closed:", e);
                        stopSession();
                    }
                }
            });

            mediaStreamRef.current = await navigator.mediaDevices.getUserMedia({ audio: true });

            const source = inputAudioContextRef.current.createMediaStreamSource(mediaStreamRef.current);
            source.connect(inputGainRef.current!);

            audioWorkletNodeRef.current = new AudioWorkletNode(
                inputAudioContextRef.current,
                'audio-capture-processor'
            );

            audioWorkletNodeRef.current.port.onmessage = (event) => {
                if (!sessionRef.current || !activeRef.current) return;

                const inputData = event.data;

                try {
                    sessionRef.current.sendRealtimeInput({
                        media: createBlob(inputData)
                    });
                } catch (err) {
                    console.error("Error sending audio:", err);
                }
            };

            source.connect(audioWorkletNodeRef.current);
            audioWorkletNodeRef.current.connect(inputAudioContextRef.current.destination);

            setActive(true);
            setConnecting(false);

            console.log("Session Active & Recording...");

            timeoutRef.current = setTimeout(() => {
                console.log("2 minute limit reached. Ending session.");
                stopSession();
            }, 2 * 60 * 1000);

        } catch (err: any) {
            console.error("Failed to start Gemini session:", err);
            setError(err.message || "Failed to start session.");
            setConnecting(false);
            stopSession();
        }
    }, [language, stopSession]);

    return {
        active,
        connecting,
        error,
        startSession,
        stopSession,
        inputNode,
        outputNode
    };
};