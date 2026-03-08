export abstract class FunctionCallDefinition<TParams = any, TResult = any> {
    readonly name: string;
    readonly description: string;
    /** JSON schema for parameters */
    readonly parameters: any;
    readonly required: string[];

    constructor(
        name: string,
        description: string,
        parameters: any,
        required: string[] = [],
    ) {
        this.name = name;
        this.description = description;
        this.parameters = parameters;
        this.required = required;
    }

    /**
     * Shape expected by the Gemini Live API `functionDeclarations` config.
     */
    get functionDeclaration() {
        return {
            name: this.name,
            description: this.description,
            // The Live API expects a JSON schema object here.
            parameters: this.parameters,
        } as const;
    }

    /**
     * Implement the tool's behavior.
     */
    abstract functionToCall(parameters: TParams): Promise<TResult> | TResult;
}

export interface SendWhatsAppToolParams {
    phone_number: string;
    message: string;
}

export interface SendWhatsAppToolResult {
    status: string;
    [key: string]: any;
}

/**
 * Tool that proxies WhatsApp sending through a Next.js API route.
 *
 * This keeps the INTERNAL_API_KEY on the server while still letting
 * the Gemini Live API call `send_whatsapp_message` from the browser.
 */
export class SendWhatsAppTool extends FunctionCallDefinition<
    SendWhatsAppToolParams,
    SendWhatsAppToolResult
> {
    constructor() {
        super(
            'send_whatsapp_message',
            'Send a WhatsApp message to the user with details about Kathava.lk and next steps.',
            {
                type: 'object',
                properties: {
                    phone_number: {
                        type: 'string',
                        description:
                            'User WhatsApp phone number including country code, e.g. +9477XXXXXXX',
                    },
                    message: {
                        type: 'string',
                        description:
                            'Short, friendly WhatsApp message summarizing the offer and including any relevant links or next steps.',
                    },
                },
                required: ['phone_number', 'message'],
            },
        );
    }

    async functionToCall(
        parameters: SendWhatsAppToolParams,
    ): Promise<SendWhatsAppToolResult> {
        console.log('[SendWhatsAppTool] Sending WhatsApp message via /api/send-whatsapp', {
            phone_number: parameters.phone_number,
        });

        const response = await fetch('/api/send-whatsapp', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                phone_number: parameters.phone_number,
                message: parameters.message,
            }),
        });

        let data: any = null;
        try {
            data = await response.json();
        } catch {
            // If the body isn't JSON, fall back to a generic result.
            console.warn('[SendWhatsAppTool] Response from /api/send-whatsapp was not JSON');
        }

        if (!response.ok) {
            const detail =
                data?.detail ||
                (typeof data === 'string' ? data : response.statusText);
            console.error('[SendWhatsAppTool] WhatsApp API returned error status', response.status, detail);
            throw new Error(
                `Failed to send WhatsApp message: ${detail || 'Unknown error'}`,
            );
        }

        const result = (data || { status: 'ok' }) as SendWhatsAppToolResult;
        console.log('[SendWhatsAppTool] WhatsApp message sent successfully with result:', result);
        return result;
    }
}

