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
import SoundConfigurationService from "./SoundConfigurationService.js";

class SpeakerDataService extends FeatureOperations {
  constructor(device) {
    super(device, "speakerdata");

    // gatt service and characteristic used to communicate with Thingy's speaker data
    this.service = {
      uuid: this.device.TSS_UUID,
    };

    this.characteristic = {
      uuid: this.device.TSS_SPEAKER_DATA_UUID,
      encoder: this.encodeSpeakerData.bind(this),
    };

    this.soundconfigurationservice = new SoundConfigurationService(this);
  }

  async encodeSpeakerData(data) {
    try {
      if (data.mode === 1) {
        const dataArray = new Uint8Array(5);
        const frequency = data.frequency;
        const duration = data.duration;
        const volume = data.volume;

        dataArray[0] = frequency & 0xff;
        dataArray[1] = (frequency >> 8) & 0xff;
        dataArray[2] = duration & 0xff;
        dataArray[3] = (duration >> 8) & 0xff;
        dataArray[4] = volume & 0xff;

        return dataArray;
      } else if (data.mode === 2) {
        return data.data;
      } else if (data.mode === 3) {
        const dataArray = new Uint8Array(1);
        const sample = data.sample;

        dataArray[0] = sample & 0xff;

        return dataArray;
      }
    } catch (error) {
      throw error;
    }
  }
}

export default SpeakerDataService;
