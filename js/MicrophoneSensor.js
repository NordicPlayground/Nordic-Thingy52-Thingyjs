/*
  Copyright (c) 2010 - 2017, Nordic Semiconductor ASA
  All rights reserved.
  Redistribution and use in source and binary forms, with or without modification,
  are permitted provided that the following conditions are met:
  1. Redistributions of source code must retain the above copyright notice, this
     list of conditions and the following disclaimer.
  2. Redistributions in binary form, except as embedded into a Nordic
     Semiconductor ASA integrated circuit in a product or a software update for
     such product, must reproduce the above copyright notice, this list of
     conditions and the following disclaimer in the documentation and/or other
     materials provided with the distribution.
  3. Neither the name of Nordic Semiconductor ASA nor the names of its
     contributors may be used to endorse or promote products derived from this
     software without specific prior written permission.
  4. This software, with or without modification, must only be used with a
     Nordic Semiconductor ASA integrated circuit.
  5. Any software provided in binary form under this license must not be reverse
     engineered, decompiled, modified and/or disassembled.
  THIS SOFTWARE IS PROVIDED BY NORDIC SEMICONDUCTOR ASA "AS IS" AND ANY EXPRESS
  OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES
  OF MERCHANTABILITY, NONINFRINGEMENT, AND FITNESS FOR A PARTICULAR PURPOSE ARE
  DISCLAIMED. IN NO EVENT SHALL NORDIC SEMICONDUCTOR ASA OR CONTRIBUTORS BE
  LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR
  CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE
  GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION)
  HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT
  LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT
  OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */

import FeatureOperations from "./FeatureOperations.js";

class Microphone extends FeatureOperations {
  constructor(device, eventListeners = []) {
    super(device, "microphone");

    // gatt service and characteristic used to communicate with Thingy's microphone
    this.service = {
      uuid: this.device.TSS_UUID,
    };

    this.characteristic = {
      uuid: this.device.TSS_MIC_UUID,
      decoder: this.decodeMicrophoneData.bind(this),
      // verifyAction: this.verifyMicrophoneAction.bind(this),
      // verifyReaction: this.verifyMicrophoneReaction.bind(this),
    };

    const AudioContext = window.AudioContext || window.webkitAudioContext;
    this.audioCtx = new AudioContext();

    this._MICROPHONE_INDEX_TABLE = [-1, -1, -1, -1, 2, 4, 6, 8, -1, -1, -1, -1, 2, 4, 6, 8];

    this._MICROPHONE_STEP_SIZE_TABLE = [7, 8, 9, 10, 11, 12, 13, 14, 16, 17, 19, 21, 23, 25, 28, 31, 34, 37, 41, 45, 50, 55, 60, 66, 73, 80, 88, 97, 107, 118, 130, 143, 157, 173, 190, 209,
      230, 253, 279, 307, 337, 371, 408, 449, 494, 544, 598, 658, 724, 796, 876, 963, 1060, 1166, 1282, 1411, 1552, 1707, 1878, 2066, 2272, 2499, 2749, 3024, 3327, 3660, 4026, 4428, 4871, 5358,
      5894, 6484, 7132, 7845, 8630, 9493, 10442, 11487, 12635, 13899, 15289, 16818, 18500, 20350, 22385, 24623, 27086, 29794, 32767];

    this.suspendAudioContext = this.suspendAudioContext.bind(this);
  }

  async suspendAudioContext() {
    await this.audioCtx.suspend();
  }
  decodeMicrophoneData(event) {
    const audioPacket = event.buffer;
    const adpcm = {
      header: new DataView(audioPacket.slice(0, 3)),
      data: new DataView(audioPacket.slice(3)),
    };
    const decodedAudio = this._decodeAudio(adpcm);

    return decodedAudio;
  }

  async verifyMicrophoneAction() {
    try {
      await this.device.mtu._write(140);
    } catch (error) {
      throw error;
    }
  }

  async verifyMicrophoneReaction(data) {
    if (this.getGattAvailable()) {
      try {
        const microphoneData = data.detail.data;
        await this._notify(false, true);
        this.removeEventListener("verifyReaction", this.characteristic.verifyReaction);

        if (microphoneData.byteLength === 131) {
          await this._notify(true);
        } else {
          console.log(microphoneData.byteLength);
          const e = new Error("Your device does not currently support the use of Thingy's microphone. Check back at a later date.");
          this.notifyError(e);
          throw e;
        }
      } catch (error) {
        throw error;
      }
    }
  }

  _decodeAudio(adpcm) {
    try {
      // Allocate output buffer
      const audioBufferDataLength = adpcm.data.byteLength;
      const audioBuffer = new ArrayBuffer(512);
      const pcm = new DataView(audioBuffer);
      let diff;
      let bufferStep = false;
      let inputBuffer = 0;
      let delta = 0;
      let sign = 0;
      let step;

      // The first 2 bytes of ADPCM frame are the predicted value
      let valuePredicted = adpcm.header.getInt16(0, false);
      // The 3rd byte is the index value
      let index = adpcm.header.getInt8(2);
      if (index < 0) {
        index = 0;
      }
      if (index > 88) {
        index = 88;
      }
      step = this._MICROPHONE_STEP_SIZE_TABLE[index];
      for (let _in = 0, _out = 0; _in < audioBufferDataLength; _out += 2) {
        /* Step 1 - get the delta value */
        if (bufferStep) {
          delta = inputBuffer & 0x0F;
          _in++;
        } else {
          inputBuffer = adpcm.data.getInt8(_in);
          delta = (inputBuffer >> 4) & 0x0F;
        }
        bufferStep = !bufferStep;
        /* Step 2 - Find new index value (for later) */
        index += this._MICROPHONE_INDEX_TABLE[delta];
        if (index < 0) {
          index = 0;
        }
        if (index > 88) {
          index = 88;
        }
        /* Step 3 - Separate sign and magnitude */
        sign = delta & 8;
        delta = delta & 7;
        /* Step 4 - Compute difference and new predicted value */
        diff = (step >> 3);
        if ((delta & 4) > 0) {
          diff += step;
        }
        if ((delta & 2) > 0) {
          diff += (step >> 1);
        }
        if ((delta & 1) > 0) {
          diff += (step >> 2);
        }
        if (sign > 0) {
          valuePredicted -= diff;
        } else {
          valuePredicted += diff;
        }
        /* Step 5 - clamp output value */
        if (valuePredicted > 32767) {
          valuePredicted = 32767;
        } else if (valuePredicted < -32768) {
          valuePredicted = -32768;
        }
        /* Step 6 - Update step value */
        step = this._MICROPHONE_STEP_SIZE_TABLE[index];
        /* Step 7 - Output value */
        pcm.setInt16(_out, valuePredicted, true);
      }

      return pcm;
    } catch (error) {
      throw error;
    }
  }

  play(audio) {
    if (this._audioStack === undefined) {
      this._audioStack = [];
    }
    this._audioStack.push(audio);
    if (this._audioStack.length) {
      this._scheduleAudioBuffers();
    }
  }
  _scheduleAudioBuffers() {
    while (this._audioStack.length > 0) {
      const bufferTime = 0.01; // Buffer time in seconds before initial audio chunk is played
      const buffer = this._audioStack.shift();
      const channels = 1;
      const framecount = buffer.byteLength / 2;
      if (this._audioNextTime === undefined) {
        this._audioNextTime = 0;
      }
      if (this.audioCtx.state === "suspended") {
        this.audioCtx.resume();
      }
      const myArrayBuffer = this.audioCtx.createBuffer(channels, framecount, 16000);
      // This gives us the actual array that contains the data
      const nowBuffering = myArrayBuffer.getChannelData(0);
      for (let i = 0; i < buffer.byteLength / 2; i++) {
        nowBuffering[i] = buffer.getInt16(2 * i, true) / 32768.0;
      }
      const source = this.audioCtx.createBufferSource();
      source.buffer = myArrayBuffer;
      source.connect(this.audioCtx.destination);
      if (this._audioNextTime === 0) {
        this._audioNextTime = this.audioCtx.currentTime + bufferTime;
      }
      source.start(this._audioNextTime);
      this._audioNextTime += source.buffer.duration;
    }
  }
}

export default Microphone;
