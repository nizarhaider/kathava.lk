export interface AgentTool<TParams = unknown, TResult = unknown> {
  name: string;
  description: string;
  execute: (params: TParams) => Promise<TResult>;
}

export interface SendWhatsAppMessageParams {
  phoneNumber: string;
  message: string;
}

interface SendWhatsAppMessageResponse {
  status: string;
}

async function sendWhatsAppMessage({
  phoneNumber,
  message,
}: SendWhatsAppMessageParams): Promise<SendWhatsAppMessageResponse> {
  const apiKey = process.env.INTERNAL_API_KEY;

  if (!apiKey) {
    throw new Error('INTERNAL_API_KEY is not set on the server');
  }

  const response = await fetch('https://webhook.hervestudio.lk/send-message', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
    },
    body: JSON.stringify({
      phone_number: phoneNumber,
      message,
    }),
  });

  let data: any = null;
  try {
    data = await response.json();
  } catch {
    // Ignore JSON parse errors; we'll still throw based on status below.
  }

  if (!response.ok) {
    const detail =
      data?.detail ||
      (typeof data === 'string' ? data : `Status ${response.status}`);
    throw new Error(`Failed to send WhatsApp message: ${detail}`);
  }

  return data as SendWhatsAppMessageResponse;
}

export const sendWhatsAppMessageTool: AgentTool<
  SendWhatsAppMessageParams,
  SendWhatsAppMessageResponse
> = {
  name: 'send_whatsapp_message',
  description:
    'Send a WhatsApp message to a given phone number using the internal Kathava webhook service.',
  execute: sendWhatsAppMessage,
};

