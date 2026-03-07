'use client';

import { useState, useEffect, useRef, useCallback } from 'react';

export type Language = 'sinhala' | 'tamil' | 'english';

const SYSTEM_PROMPTS: Record<Language, string> = {
    sinhala: `ඔබ Kathava.lk හි විකුණුම් නියෝජිත Sam (සෑම්). ඔබේ ඉලක්කය වන්නේ ශ්‍රී ලාංකික ව්‍යාපාර වලට Kathava AI voice agents හඳුන්වා දීම සහ ඒවා මිලදී ගැනීමට ඔවුන්ව පොළඹවා ගැනීමයි.
සෑම විටම සිංහලෙන් පමණක් කතා කරන්න. ඉතා උද්‍යෝගිමත් සහ මිත්‍රශීලී වන්න.
අපගේ සේවාවේ විශේෂතා:
1. සාමාන්‍ය call center එකකට වඩා 90% ක පිරිවැය ඉතිරියක්.
2. පැය 24 පුරාම සේවය ලබාගත හැක, කිසිම පෝලිමක් (wait time) නැත.
3. සිංහල සහ දෙමළ භාෂා ඉතා ස්වාභාවිකව හැසිරවිය හැක.
4. ඔවුන්ගේ විකුණුම් දත්ත (Inventory) හෝ පාරිභෝගික දත්ත (CMS) සමඟ සම්බන්ධ විය හැක.
කවුරුන් හෝ කෝල් කළහොත්, මෙම තාක්ෂණය ඔවුන්ගේ ව්‍යාපාරයට කොතරම් ලාභදායීද යන්න පැහැදිලි කරන්න.`,

    tamil: `நீங்கள் Kathava.lk இன் விற்பனை பிரதிநிதி சாம் (Sam). உங்கள் குறிக்கோள் இலங்கை வணிகங்களுக்கு Kathava AI குரல் முகவர்களை (AI voice agents) அறிமுகப்படுத்துவதும், அவற்றை அவர்கள் பயன்படுத்த தூண்டுவதும் ஆகும்.
எப்போதும் தமிழில் மட்டுமே பேசவும். மிகவும் உற்சாகமாகவும் நட்பாகவும் இருக்கவும்.
எங்கள் சேவையின் சிறப்பம்சங்கள்:
1. சாதாரண கால் சென்டரை விட 90% செலவு குறைவு.
2. 24 மணிநேரமும் சேவை கிடைக்கும், காத்திருக்க வேண்டிய அவசியம் இல்லை.
3. சிங்களம் மற்றும் தமிழ் மொழிகளை மிகவும் இயல்பாக பேசும் திறன்.
4. அவர்களின் விற்பனை தரவு (Inventory) அல்லது வாடிக்கையாளர் தரவுகளுடன் (CMS) இணைக்க முடியும்.
வணிகங்கள் இந்த தொழில்நுட்பத்தை பயன்படுத்துவதன் மூலம் எவ்வாறு லாபம் ஈட்டலாம் என்பதை விளக்குங்கள்.`,

    english: `You are Sam, a high-energy and persuasive sales executive for Kathava.lk. Your goal is to convince businesses in Sri Lanka to adopt Kathava's AI voice agents.
Speak only in English. Be charming, professional, and enthusiastic.
Your key selling points:
1. 90% cost reduction compared to traditional human call centers.
2. 24/7 availability - Sam never sleeps and there are zero wait times.
3. Native fluency in Sinhala, Tamil, and English - customers feel like they're talking to a local person.
4. Deep integration - Sam can pull inventory data or verify customers against a CMS live.
5. Scalability - Handles 10,000+ concurrent calls without breaking a sweat.
If they ask about the SLT Mobitel number, tell them it's a real-world demonstration of our technology in action.`
};

export const useGeminiLive = (language: Language) => {
    const [active, setActive] = useState(false);
    const [connecting, setConnecting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const wsRef = useRef<WebSocket | null>(null);
    const audioContextRef = useRef<AudioContext | null>(null);
    const processorRef = useRef<ScriptProcessorNode | null>(null);
    const mediaStreamRef = useRef<MediaStream | null>(null);
    const audioQueue = useRef<Int16Array[]>([]);
    const isPlaying = useRef(false);

    // Helper to convert ArrayBuffer to Base64
    const arrayBufferToBase64 = (buffer: ArrayBuffer) => {
        let binary = '';
        const bytes = new Uint8Array(buffer);
        const len = bytes.byteLength;
        for (let i = 0; i < len; i++) {
            binary += String.fromCharCode(bytes[i]);
        }
        return window.btoa(binary);
    };

    const stopSession = useCallback(() => {
        if (wsRef.current) wsRef.current.close();
        if (processorRef.current) processorRef.current.disconnect();
        if (mediaStreamRef.current) mediaStreamRef.current.getTracks().forEach(track => track.stop());
        if (audioContextRef.current) audioContextRef.current.close();

        wsRef.current = null;
        processorRef.current = null;
        mediaStreamRef.current = null;
        audioContextRef.current = null;
        audioQueue.current = [];
        isPlaying.current = false;

        setActive(false);
        setConnecting(false);
    }, []);

    const playNextInQueue = useCallback(async () => {
        if (audioQueue.current.length === 0 || isPlaying.current || !audioContextRef.current) return;

        isPlaying.current = true;
        const pcmData = audioQueue.current.shift()!;

        try {
            const floatData = new Float32Array(pcmData.length);
            for (let i = 0; i < pcmData.length; i++) {
                floatData[i] = pcmData[i] / 0x7FFF;
            }

            const buffer = audioContextRef.current.createBuffer(1, floatData.length, 24000);
            buffer.getChannelData(0).set(floatData);

            const source = audioContextRef.current.createBufferSource();
            source.buffer = buffer;
            source.connect(audioContextRef.current.destination);

            source.onended = () => {
                isPlaying.current = false;
                playNextInQueue();
            };

            source.start();
        } catch (err) {
            console.error("Playback error:", err);
            isPlaying.current = false;
            playNextInQueue();
        }
    }, []);

    const startSession = useCallback(async () => {
        const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
        if (!apiKey) {
            setError("Gemini API Key is missing.");
            return;
        }

        try {
            setConnecting(true);
            setError(null);

            audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });

            const url = `wss://generativelanguage.googleapis.com/ws/google.ai.generativelanguage.v1alpha.GenerativeService.BidiGenerateContent?key=${apiKey}`;
            wsRef.current = new WebSocket(url);

            wsRef.current.onopen = () => {
                const setup = {
                    setup: {
                        model: "models/gemini-2.0-flash-exp",
                        generation_config: {
                            response_modalities: ["audio"],
                            speech_config: {
                                voice_config: {
                                    prebuilt_voice_config: { voice_name: "Aoede" }
                                }
                            }
                        },
                        system_instruction: {
                            parts: [{ text: SYSTEM_PROMPTS[language] }]
                        }
                    }
                };
                wsRef.current?.send(JSON.stringify(setup));
            };

            wsRef.current.onmessage = async (event) => {
                const response = JSON.parse(event.data);

                if (response.setup_complete) {
                    await startRecording();
                    setActive(true);
                    setConnecting(false);
                }

                if (response.server_content?.model_turn?.parts) {
                    for (const part of response.server_content.model_turn.parts) {
                        if (part.inline_data) {
                            const binaryString = atob(part.inline_data.data);
                            const bytes = new Uint8Array(binaryString.length);
                            for (let i = 0; i < binaryString.length; i++) {
                                bytes[i] = binaryString.charCodeAt(i);
                            }
                            const pcmData = new Int16Array(bytes.buffer);
                            audioQueue.current.push(pcmData);
                            playNextInQueue();
                        }
                    }
                }
            };

            wsRef.current.onerror = () => {
                setError("Connection error. Check your API key.");
                stopSession();
            };

        } catch (err: any) {
            setError(err.message || "Failed to start session.");
            setConnecting(false);
        }
    }, [language, stopSession, playNextInQueue]);

    const startRecording = async () => {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        mediaStreamRef.current = stream;

        const source = audioContextRef.current!.createMediaStreamSource(stream);
        const processor = audioContextRef.current!.createScriptProcessor(2048, 1, 1);

        processor.onaudioprocess = (e) => {
            const inputData = e.inputBuffer.getChannelData(0);
            const pcmData = new Int16Array(inputData.length);
            for (let i = 0; i < inputData.length; i++) {
                pcmData[i] = Math.max(-1, Math.min(1, inputData[i])) * 0x7FFF;
            }

            if (wsRef.current?.readyState === WebSocket.OPEN) {
                wsRef.current.send(JSON.stringify({
                    realtime_input: {
                        media_chunks: [{
                            mime_type: "audio/pcm;rate=16000",
                            data: arrayBufferToBase64(pcmData.buffer)
                        }]
                    }
                }));
            }
        };

        source.connect(processor);
        processor.connect(audioContextRef.current!.destination);
        processorRef.current = processor;
    };

    return { active, connecting, error, startSession, stopSession };
};
