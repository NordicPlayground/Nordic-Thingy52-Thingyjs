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

const defaultLedOptions = {
    mode: "breathe",
    color: 1,
    red: 255,
    green: 0,
    blue: 0,
    intensity: 20,
    delay: 3500
};

const supportedLedColors = [
    { name: "red", value: {red: 255, green: 0, blue: 0} },
    { name: "green", value: {red: 0, green: 128, blue: 0} },
    { name: "yellow", value: {red: 255, green: 255, blue: 0} },
    { name: "blue", value: {red: 0, green: 0, blue: 255} },
    { name: "purple", value: {red: 128, green: 0, blue: 128} },
    { name: "cyan", value: {red: 0, green: 255, blue: 255} },
    { name: "white", value: {red: 255, green: 255, blue: 255} }
];

export class LEDPreviousValue {
    constructor() {
        this.dataCache = { ...defaultLedOptions };
    }

    update(newData) {
        this.dataCache = this.mixWith(newData);
    }

    mixWith(newData) {
        const data = { ...newData };

        if (newData.hasOwnProperty('color')) {
            Object.assign(data, LEDColor.fromCode(newData));
        } else if (newData.hasOwnProperty('r') || data.hasOwnProperty('red')) {
            Object.assign(data, LEDColor.fromRGB(newData));
        }

        return { ...this.dataCache, ...data };
    }
}

export class LEDColor {
    constructor({ red, green, blue, colorNumber }) {
        this.red = red;
        this.green = green;
        this.blue = blue;
        this.color = colorNumber;
    }

    static fromCode({ color }) {
        const colorNumber = typeof color === 'string'
            ? supportedLedColors.findIndex(({ name }) => name === color) + 1
            : color;

        const { value } = supportedLedColors[colorNumber - 1];

        return new LEDColor({ ...value, colorNumber });
    }

    static fromRGB({ red, green, blue, r, g, b }) {
        const rgb = {
            red: red || r || 0,
            green: green || g || 0,
            blue: blue || b || 0
        };

        const calcDistanceToGiven = ({ red, green, blue }) => Math.sqrt(
            Math.pow(red - rgb.red, 2) +
            Math.pow(green - rgb.green, 2) +
            Math.pow(blue - rgb.blue, 2)
        );

        const distancesToGiven = supportedLedColors
            .map(color => color.value)
            .map(calcDistanceToGiven);

        const closestMatchIndex = distancesToGiven.indexOf(Math.min(...distancesToGiven)) + 1;

        return new LEDColor({ ...rgb, colorNumber: closestMatchIndex });
    }
}


