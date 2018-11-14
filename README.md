# Nordic Thingy:52 for Web Bluetooth
**About Thingy:52**

The Nordic Thingy:52™ is a compact, power-optimized, multi-sensor development kit. It is an easy-to-use development platform, designed to help you build IoT prototypes and demos, without the need to build hardware or write firmware. Read more about it [here](https://www.nordicsemi.com/eng/Products/Nordic-Thingy-52).

**This repository**

This repository is an attempt to make it easier to start developing applications for Thingy:52 using Web Bluetooth. Web Bluetooth is a JavaScript API that makes it possible to communicate with Bluetooth Low Energy devices in web browsers. The implementation status for different browsers and platforms can be seen [here](https://github.com/WebBluetoothCG/web-bluetooth/blob/gh-pages/implementation-status.md). 

This is work in progress, and for now this repository will help you connect to a Thingy:52 and access all services and characteristics except for MTU (Maximum Transmission Unit):

### Get started

- Clone or download this repository.
- If you've used this repository, you can serve `index.html` using any http server. You can then navigate to the server address in a supported browser and open the console (ctrl + shift + J or cmd + alt + J). 
- Turn on your Thingy:52. 
- Click the "Connect" button found on the page.
- You can now choose your Thingy:52 and connect to it.
- In the console, you can see the browser connect to the device and discover its services. 
- When connected, the Thingy:52 will use the LED breathe feature and the LED will pulsate with a RED light. 
- In the browser, it will also show the current temperature measured by the device in the HTML element below the connect button.

### Examples
The following example will first connect to a thingy:52 with the option logEnabled set to false, then subscribe to and log all incoming data from the temperature sensor. After that we will request the device's name, before setting it to "Thingy". In the end, we set a timeout for 10 secounds before we disconnect from the device.

```javascript

import Thingy from "./js/thingy.js";

const thingy = new Thingy({logEnabled: false});

function myLoggingFunction(data) {
    const temperatureData = data.detail;
    console.log(temperatureData);
}

async function start(device) {
    try {
        await device.connect();
        
        device.addEventListener("temperature", myLoggingFunction);
        await device.temperature.start();
        
        const deviceName = await device.name.read();
        console.log(deviceName);

        await device.name.write("Thingy");

        setTimeout(async () => {
        await device.disconnect();
        console.log("Disconnected from the device");
        }, 10000);
        
    } catch (error) {
        console.error(error);
    }
}

start(thingy);
```

The following example will first connect to a thingy:52, and then read the current LED configuration. In the end we will set the LED to breathe mode, with an intensity of 50% and a delay of 1 second.

```javascript

import Thingy from "./js/thingy.js";

const thingy = new Thingy();

async function start(device) {
    try {
        await device.connect();

        const currentLedConfiguration = await device.led.read();
        console.log(currentLedConfiguration);
        
        const newLedConfiguration = {
            mode: "breathe",
            color: "cyan",
            intensity: 50,
            delay: 1000,
        }
        
        await device.led.write(newLedConfiguration);  
    } catch (error) {
        console.error(error);
    }
}

start(thingy);
```

**Note**: the Web Bluetooth API requires that a function trying to connect to a BLE device is initiated by a user action such as a mouse click.

### API documentation
Thingy offers several features, all of which rely on established BLE protocols for sending and receiving data. The BLE operations are abstracted away through the following operations:

| Operation | Description |
| --------- | ----------- |
| start/stop | Subscribes to a feature and relays any incoming data from that feature as an event to the device object. |
| read | Reads data from the specified feature on Thingy. |
| write | Writes data to the specified feature on Thingy. |

**Note**: If any connect/start/stop operation is unsuccessful due to network congestion, the method is queued and and re-tried at a later time. If the operation continues to complete unsuccessfully, an event will be dispatched on thingy.operationdiscarded.

| Event | Description |
| --------- | ----------- |
| thingy.error | An event with this name is emitted on any and all errors. The event contains information about the error, as well as the feature and operation that caused the error to occur. |
| thingy.operationdiscarded | An event with this name is emitted whenever a connect/start/stop operation is discarded on one of Thingy's features. The event contains information about the operation that was cancelled along with a function call. |
| thingy.write | An event with this name is emitted whenever a successful write operation has been performed. The event contains information about the feature that triggered the write operation, as well as the value that written. |

# Supported operations

| Feature | Start/Stop | Read | Write |
| :----: | :----: | :----: | :----: |
| Absolute orientation | Yes | No | No |
| Advertising parameters | No  | Yes | Yes |
| Battery | Yes | Yes | No |
| Button | Yes | No | No |
| Cloud token | No | Yes | Yes |
| Color | Yes | No | No |
| Connection parameters | No | Yes | Yes |
| DFU | Yes | No | Yes |
| Eddystone url | No | Yes | Yes |
| Environment configuration | No | Yes | Yes |
| Euler orientation  | Yes | No | No |
| Firmware | No | Yes | No |
| Gas | Yes | No | No |
| Gravity vector | Yes | No | No |
| Heading | Yes | No | No |
| Humidity | Yes | No | No |
| LED | No | Yes | Yes |
| Microphone | Yes | No | No |
| Motion configuration | No | Yes | Yes |
| MTU | No | Yes | Yes |
| Name | No | Yes | Yes |
| Pressure | Yes | No | No |
| Quaternion orientation | Yes | No | No |
| Raw data | Yes | No | No |
| Rotation matrix orientation | Yes | No | No |
| Sound configuration | No | Yes | Yes |
| Speaker Data | No | No | Yes |
| Speaker Status | Yes | No | No |
| Step counter | Yes | No | No |
| Tap | Yes | No | No |
| Temperature | Yes | No | No |





Below you can find extended information on each feature Thingy supports, as well as information about the parameters required to interact with them.

-   [Thingy](#thingy)
    -   [Absolute Orientation](#absolute-orientation)
    -   [Advertising Parameters](#advertising-parameters)
    -   [Battery](#battery)
    -   [Button](#button)
    -   [Cloud Token](#cloud-token)
    -   [Color](#color)
    -   [Connection Parameters](#connection-parameters)
    -   [DFU](#dfu)
    -   [Eddystone url](#eddystone-url)
    -   [Environment Configuration](#environment-configuration)
    -   [Euler Orientation](#euler-orientation)
    -   [Firmware](#firmware)
    -   [Gas](#gas)
    -   [Gravity Vector](#gravity-vector)
    -   [Heading](#heading)
    -   [Humidity](#humidity)
    -   [LED](#led)
    -   [Microphone](#microphone)
    -   [Motion Configuration](#motion-configuration)
    -   [MTU](#mtu)
    -   [Name](#name)
    -   [Pressure](#pressure)
    -   [Quaternion Orientation](#quaternion-orientation)
    -   [Raw Data](#raw-data)
    -   [Rotation Matrix Orientation](#rotation-matrix-orientation)
    -   [Sound Configuration](#sound-configuration)
    -   [Speaker Data](#speaker-data)
    -   [Speaker Status](#speaker-status)
    -   [Step Counter](#step-counter)
    -   [Tap](#tap)
    -   [Temperature](#temperature)


## Thingy

**Parameters**

-   `options`   (optional, default `{logEnabled:true}`)

### Absolute Orientation
`thingy.absoluteorientation`

`event: absoluteorientation`

Allows interaction with the connected device's absolute orientation sensor

**Supported operations**

-   `start` - Starts sending absolute orientation data from the connected device.
-   `stop`  - Terminates sending absolute orientation data from the connected device.

### Advertising Parameters
`thingy.advertisingparameters`

Allows interaction with the connected device's advertising parameters

**Supported operations**

-   `read` - Reads the connected device's advertising parameters.
-   `write` - Writes the advertising parameters of the connected device.
    - **Parameters**:
        - Object:
            - interval (Advertising interval). Integer in the range 20 to 5000 (20ms to 5s)
            - timeout (Advertising timeout). Integer in the range 0 to 180 (0s to 3min)

### Battery
`thingy.battery`

`event: battery`

Allows interaction with the connected device's battery level

**Supported operations**

-   `start` - Starts sending battery level data from the connected device.
-   `stop`  - Terminates sending battery level data from the connected device.
-   `read`  - Reads the connected device's battery level.

### Button
`thingy.button`

`event: button`

Allows interaction with the connected device's button

**Supported operations**

-   `start` - Starts sending button data from the connected device.
-   `stop`  - Terminates sending button data from the connected device.

### Cloud Token
`thingy.cloudtoken`

Allows interaction with the connected device's cloud token service

**Supported operations**

-   `read` - Reads the cloud token currently written to the connected device.
-   `write` - Writes the cloud token of the connected device.
    - **Parameters**:
        - Cloud token - String shorter than or equal to 250 characters.

### Color
`thingy.color`

`event: color`

Allows interaction with the connected device's color sensor (not LED)

**Supported operations**

-   `start` - Starts sending color data from the connected device.
-   `stop`  - Terminates sending color data from the connected device.

### Connection Parameters
`thingy.connectionparameters`

Allows interaction with the connected device's connection parameters

**Supported operations**

-   `read` - Reads the connected device's connection parameters.
-   `write` - Writes the connection parameters of the connected device.
    - **Parameters**:
        - Object:
            - minInterval (Minimum connection interval). Number in the range 7.5 to 4000 (7.5ms to 4s)
            - maxInterval (Maximum connection interval). Number in the range 7.5 to 4000 (7.5ms to 4s)
            - slaveLatency (Slave latency - number of connection events). Integer in the range 0 to 499
            - timeout (Supervision timeout). Integer in the range 100 to 32000 (100ms to 32s)

### DFU
`thingy.dfucontrolpoint_v1`
`thingy.dfucontrolpoint_v2`

Allows interaction with the connected device's DFU service (Device Firmware Upgrade). Note that depending on which firmware version the Thingy has,
the characteristic is different. If the firmware is version 1.x, use the 'thingy.dfucontrolpoint_v1' characteristic. If it is 2.x, use the 'thingy.dfucontrolpoint_v2' characteristic. This is due to a change in the UUID of the service from firmware version 1.1.0 to 2.0.0.

**Supported operations**

-   `start` - Starts sending notifications from the DFU control point characteristic.
-   `stop`  - Stops sending notifications from the DFU control point characteristic.
-   `write` - Writes to the DFU control point characteristic.
    - **Parameters**:
        - Number - Write the number 1 to put the device in DFU mode, enabling Device Firmware Update. This will disconnect the device and it can be reconnected to with the name 'thingyDfu'. To execute the DFU transfer, an external library such as **[this](https://github.com/thegecko/web-bluetooth-dfu)** can be used.

### Eddystone Url
`thingy.eddystone`

Allows interaction with the connected device's eddystone url service

**Supported operations**

-   `read` - Reads the connected device's eddystone url.
-   `write` - Writes the eddystone url of the connected device.
    - **Parameters**:
        - Eddystone url - String between 3 and 17 characters, according to **[this](https://github.com/google/eddystone/tree/master/eddystone-url)** format

### Environment Configuration
`thingy.environmentconfiguration`

Allows interaction with the connected device's environment configuration

**Supported operations**

-   `read` - Reads the connected device's current environment configuration.
-   `write` - Writes the environment configuration of the connected device.
    - **Parameters**:
        - Object:
            - temperatureInterval (Temperature sensor update interval in ms). Integer in the range 100 ms to 60 000 ms.
            - pressureInterval (Pressure sensor update interval in ms). Integer in the range 50 ms to 60 000 ms.
            - humidityInterval (Humidity sensor update interval in ms). Integer in the range 100 ms to 60 000 ms.
            - colorInterval (Color sensor update interval in ms). Integer in the range 200 ms to 60 000 ms.
            - gasInterval (Gas sensor update interval in seconds). Allowed values are 1, 10 and 60 seconds.
            - Object colorSensorCalibration (Configures color sensor calibration parameters):
                - red - Integer in the range 0 to 255
                - green - Integer in the range 0 to 255
                - blue - Integer in the range 0 to 255

### Euler Orientation
`thingy.eulerorientation`

`event: eulerorientation`

Allows interaction with the connected device's euler orientation sensor

**Supported operations**

-   `start` - Starts sending euler orientation data from the connected device.
-   `stop`  - Terminates sending euler orientation data from the connected device.

### Firmware
`thingy.firmware`

Allows interaction with the connected device's firmware service

**Supported operations**

-   `read` - Reads the current firmware version deployed on the device.


### Gas
`thingy.gas`

`event: gas`

Allows interaction with the connected device's gas sensor (co2 and tvoc)

**Supported operations**

-   `start` - Starts sending gas data from the connected device.
-   `stop`  - Terminates sending gas data from the connected device.

### Gravity vector
`thingy.gravityvector`

`event: gravityvector`

Allows interaction with the connected device's gravity vector sensor

**Supported operations**

-   `start` - Starts sending gravity vector data from the connected device.
-   `stop`  - Terminates sending gravity vector data from the connected device.

### Heading
`thingy.heading`

`event: heading`

Allows interaction with the connected device's heading sensor

**Supported operations**

-   `start` - Starts sending heading data from the connected device.
-   `stop`  - Terminates sending heading data from the connected device.

### Humidity
`thingy.humidity`

`event: humidity`

Allows interaction with the connected device's humidity sensor

**Supported operations**

-   `start` - Starts sending humidity data from the connected device.
-   `stop`  - Terminates sending humidity data from the connected device.

### LED
`thingy.led`

Allows interaction with the connected device's LED

**Supported operations**

-   `read` - reads the connected device's current LED configuration.
-   `write` - Writes the LED configuration of the connected device.
    - **Parameters**:
        - Object:
            - mode - Mode of the LED. Can be one of the following: constant, breathe, oneshot, off.
            - mode = constant:
                - red - Integer in the range 0 to 255
                - green - Integer in the range 0 to 255
                - blue - Integer in the range 0 to 255
            - mode = breathe:
                - color - Either a recognized color (red, green, yellow, blue, purple, cyan, white), or an integer in the range 1 to 7
                - intensity - Integer in the range 0 to 100
                - delay - Delay between each breathe (unit ms). Integer in the range 50 to 10 000
            - mode = oneshot:
                - color - Integer in the range 1 to 7
                - intensity: Integer in the range 0 to 100

### Microphone
`thingy.microphone`

`event: microphone`

Allows interaction with the connected device's microphone

**Supported operations**

-   `start` - Starts sending microphone data from the connected device.
-   `stop`  - Terminates sending microphone data from the connected device.

### Motion Configuration
`thingy.motionconfiguration`

Allows interaction with the connected device's motion configuration

**Supported operations**

-   `read` - Reads the connected device's current motion configuration.
-   `write` - Writes the motion configuration of the connected device.
    - **Parameters**:
        - Object:
            - stepCounterInterval (Sets the step counter interval). Must be in the range 100 ms to 5000 ms.
            - tempCompensationInterval (Sets the temperature compensation interval). Must be in the range 100 ms to 5000 ms.
            - magnetCompInterval (Sets the magnetometer compensation interval). Must be in the range 100 ms to 1000 ms.
            - motionProcessFrequency (Sets motion processing unit update frequency). Must be in the range 5 Hz to 200 Hz.
            - wakeOnMotion (Sets wake-on-motion feature to enabled or disabled state). Set to true to enable or false to disable wake-on-motion feature.

### MTU
`thingy.mtu`

Allows interaction with the connected device's MTU service (Maximum Transmission Unit)

**Supported operations**

-   `read` - Reads the MTU of the connected device.
-   `write` - Writes the MTU of the connected device.
    - **Parameters**:
        - MTU - Integer in the range 23 to 276.


### Name
`thingy.name`

Allows interaction with the connected device's name service

**Supported operations**

-   `read` - Reads the name of the connected device.
-   `write` - Writes the name of the connected device.
    - **Parameters**:
        - Name - String shorter than or equal to 10 characters.

### Pressure
`thingy.pressure`

`event: pressure`

Allows interaction with the connected device's pressure sensor

**Supported operations**

-   `start` - Starts sending pressure data from the connected device.
-   `stop`  - Terminates sending pressure data from the connected device.

### Quaternion orientation
`thingy.quaternionorientation`

`event: quaternionorientation`

Allows interaction with the connected device's quaternion orientation sensor

**Supported operations**

-   `start` - Starts sending quaternion orientation data from the connected device.
-   `stop`  - Terminates sending quaternion orientation data from the connected device.

### Raw data
`thingy.rawdata`

`event: rawdata`

Allows interaction with the connected device's raw data sensor (includes accelerometer, gyroscope, and compass)

**Supported operations**

-   `start` - Starts sending raw data from the connected device.
-   `stop`  - Terminates sending raw data from the connected device.

### Rotation matrix orientation
`thingy.rotationmatrixorientation`

`event: rotationmatrixorientation`

Allows interaction with the connected device's rotation matrix orientation sensor

**Supported operations**

-   `start` - Starts sending rotation matrix orientation data from the connected device.
-   `stop`  - Terminates sending rotation matrix orientation data from the connected device.

### Sound Configuration
`thingy.soundconfiguration`

Allows interaction with the connected device's sound configuration

**Supported operations**

-   `read` - Reads the connected device's current sound configuration.
-   `write` - Writes the sound configuration of the connected device.
    - **Parameters**:
        - Object:
            - speakerMode (Sets the speaker mode). Must be one of the integers:
                - 1 - Frequency mode.
                - 2 - 8-bit PCM mode (used for streaming audio to Thingy).
                - 3 - Sample mode.
            - microphoneMode (Sets the microphone mode). Must be one of the integers:
                - 1 - ADPCM mode.
                - 2 - SPL mode.

### Speaker Data
`thingy.speakerdata`

Allows interaction with the connected device's speaker data. 
Note that speaker mode has to be set to the desired mode beforehand by writing to [Sound Configuration](#sound-configuration).

**Supported operations**

-   `write` - Writes to the speaker of the connected device.
    - **Parameters**:
        - Object:
            - mode - Mode of the speaker. Can be one of the following: 1, 2 or 3.
            - mode = 1:
                - frequency - Frequency in Hz. Integer larger than 0.
                - duration - Duration in ms. Integer larger than 0.
                - volume - Volume in %. Integer in the range 0 to 100.
            - mode = 2:
                - data - 8-bit PCM samples. Audio data of size between 20-273 bytes. See audiostream.html in examples folder for example
            - mode = 3:
                - sample - Sample ID. Integer in the range 0 to 8

### Speaker Status
`thingy.speakerstatus`

`event: speakerstatus`

Allows interaction with the connected device's speaker status

**Supported operations**

-   `start` - Starts sending the speaker status from the connected device.
-   `stop`  - Terminates sending the speaker status from the connected device.

### Step counter
`thingy.stepcounter`

`event: stepcounter`

Allows interaction with the connected device's step counter sensor

**Supported operations**

-   `start` - Starts sending step counter data from the connected device.
-   `stop`  - Terminates sending step counter data from the connected device.

### Tap
`thingy.tap`

`event: tap`

Allows interaction with the connected device's tap sensor

**Supported operations**

-   `start` - Starts sending tap data from the connected device.
-   `stop`  - Terminates sending tap data from the connected device.

### Temperature
`thingy.temperature`

`event: temperature`

Allows interaction with the connected device's temperature sensor

**Supported operations**

-   `start` - Starts sending temperature data from the connected device.
-   `stop`  - Terminates sending temperature data from the connected device.
