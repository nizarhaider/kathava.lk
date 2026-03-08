class AudioCaptureProcessor extends AudioWorkletProcessor {
    constructor() {
        super();
    }

    process(inputs, outputs, parameters) {
        const input = inputs[0];
        if (input && input.length > 0) {
            const channelData = input[0];
            // Send a copy of the audio data to the main thread
            this.port.postMessage(channelData);
        }
        return true;
    }
}

registerProcessor('audio-capture-processor', AudioCaptureProcessor);
