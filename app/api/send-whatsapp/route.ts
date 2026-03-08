import { NextRequest, NextResponse } from 'next/server';
import { sendWhatsAppMessageTool } from '@/lib/whatsappTool';

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { phone_number, message } = body ?? {};

        console.log('[API /api/send-whatsapp] Incoming request', {
            phone_number,
            hasMessage: typeof message === 'string' && message.length > 0,
        });

        if (!phone_number || !message) {
            return NextResponse.json(
                { detail: 'phone_number and message are required' },
                { status: 400 },
            );
        }

        const result = await sendWhatsAppMessageTool.execute({
            phoneNumber: phone_number,
            message,
        });

        console.log('[API /api/send-whatsapp] WhatsApp tool executed successfully with result:', result);

        return NextResponse.json(result);
    } catch (err: any) {
        console.error('[API /api/send-whatsapp] Error while processing request:', err);
        return NextResponse.json(
            {
                detail:
                    err?.message ??
                    'Unexpected error while sending WhatsApp message',
            },
            { status: 500 },
        );
    }
}

