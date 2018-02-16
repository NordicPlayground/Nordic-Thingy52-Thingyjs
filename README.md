# Nordic Thingy:52 for Web Bluetooth
**About Thingy:52**

The Nordic Thingy:52™ is a compact, power-optimized, multi-sensor development kit. It is an easy-to-use development platform, designed to help you build IoT prototypes and demos, without the need to build hardware or write firmware. Read more about it [here](https://www.nordicsemi.com/eng/Products/Nordic-Thingy-52).

**This repository**

This repository is an attempt to make it easier to start developing applications for Thingy:52 using Web Bluetooth. Web Bluetooth is a JavaScript API that makes it possible to communicate with Bluetooth Low Energy devices in web browsers. The implementation status for different browsers and platforms can be seen [here](https://github.com/WebBluetoothCG/web-bluetooth/blob/gh-pages/implementation-status.md). 

This is work in progress, and for now this repository will help you connect to a Thingy:52 and access all services and characteristics except for speaker, microphone, MTU (Maximum Transmission Unit), and DFU (Device Firmware Upgrade):

### Get started

- Clone or download this repository, or just copy `js/thingy.js` into your own project.
- If you've used this repository, you can open `index.html` in a supported browser and open the console (ctrl + shift + J or cmd + alt + J). 
- Turn on your Thingy:52. 
- Click the "Connect" button found in `index.html`.
- You can now choose your Thingy:52 and connect to it.
- In the console, you can see the browser connect to the device and discover its services. 
- When connected, the Thingy:52 will use the LED breathe feature and the LED will pulsate with RED light. 
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
| start/stop | Subscribes to a feature and relays any incoming data from that feature as an event to the device object |
| read | Reads data from the specified feature on Thingy |
| write | Writes data to the specified feature on Thingy |

# Supported operations

| Feature | Start/Stop | Read | Write |
| :----: | :----: | :----: | :----: |
| Absolute orientation | Yes | No | No |
| Button | Yes | No | No |
| Cloud token | No | Yes | Yes |
| Color | Yes | No | No |
| Connection parameters | No | Yes | Yes |
| DFU (in development) | - | - | - |
| Eddystone url | No | Yes | Yes |
| Environment configuration | No | Yes | Yes |
| Euler orientation  | Yes | No | No |
| Firmware | No | Yes | No |
| Gas | Yes | No | No |
| Gravity vector | Yes | No | No |
| Heading | Yes | No | No |
| Humidity | Yes | No | No |
| LED | No | Yes | Yes |
| Microphone (in development) | Yes | No | No |
| Motion configuration | No | Yes | Yes |
| MTU (in development) | - | - | - |
| Name | No | Yes | Yes |
| Pressure | Yes | No | No |
| Quaternion orientation | Yes | No | No |
| Raw data | Yes | No | No |
| Rotation matrix orientation | Yes | No | No |
| Speaker (in development) | - | - | - |
| Step counter | Yes | No | No |
| Tap | Yes | No | No |
| Temperature | Yes | No | No |





Below you can find extended information on each feature Thingy supports, as well as information about the parameters required to interact with them.

-   [Thingy](#thingy)
    -   [Absolute orientation](#absolute-orientation)
    -   [Button](#button)
    -   [Cloud token](#cloud-token)
    -   [Color](#color)
    -   [Connection parameters](#connection-parameters)
    -   [DFU](#dfu)
    -   [Eddystone url](#eddystone-url)
    -   [Environment configuration](#environment-configuration)
    -   [Euler orientation](#euler-orientation)
    -   [Firmware](#firmware)
    -   [Gas](#gas)
    -   [Gravity vector](#gravity-vector)
    -   [Heading](#heading)
    -   [Humidity](#humidity)
    -   [LED](#led)
    -   [Microphone](#microphone)
    -   [Motion configuration](#motion-configuration)
    -   [MTU](#mtu)
    -   [Name](#name)
    -   [Pressure](#pressure)
    -   [Quaternion orientation](#quaternion-orientation)
    -   [Raw data](#raw-data)
    -   [Rotation matrix orientation](#rotation-matrix-orientation)
    -   [Speaker](#speaker)
    -   [Step counter](#step-counter)
    -   [Tap](#tap)
    -   [Temperature](#temperature)


## Thingy

**Parameters**

-   `options`   (optional, default `{logEnabled:true}`)

### Absolute orientation
`thingy.absoluteorientation`

`event: absoluteorientation`

Allows interaction with the connected device's absolute orientation sensor

**Supported operations**

-   `start` - Starts sending absolute orientation data from the connected device
-   `stop`  - Terminates sending absolute orientation data from the connected device

### Button
`thingy.button`

`event: button`

Allows interaction with the connected device's button

**Supported operations**

-   `start` - Starts sending button data from the connected device
-   `stop`  - Terminates sending button data from the connected device

### Cloud token
`thingy.cloudtoken`

Allows interaction with the connected device's cloud token service

**Supported operations**

-   `read` - Reads the cloud token currently written to the connected device
-   `write` - Writes the cloud token of the connected device.
    - **Parameters**:
        - Cloud token - String shorter than or equal to 250 characters.

### Color
`thingy.color`

`event: color`

Allows interaction with the connected device's color sensor (not LED)

**Supported operations**

-   `start` - Starts sending color data from the connected device
-   `stop`  - Terminates sending color data from the connected device

### Connection parameters
`thingy.connectionparameters`

Allows interaction with the connected device's connection parameters

**Supported operations**

-   `read` - Reads the connected device's connection parameters
-   `write` - Writes the connection parameters of the connected device.
    - **Parameters**:
        - Object:
            - minInterval (Minimum connection interval, unit 1.25ms). Integer in the range 6 to 3200 (7.5ms to 4s)
            - maxInterval (Maximum connection interval (unit 1.25ms). Integer in the range 6 to 3200 (7.5ms to 4s)
            - slaveLatency (Slave latency - number of connection events). Integer in the range 0 to 499
            - supervisionTimeout (Supervision timeout, unit 10ms). Integer in the range 10 to 3200 (100ms to 32s)

### DFU
`thingy.dfu`

Allows interaction with the connected device's DFU service (Device Firmware Upgrade)

**Supported operations**

In development

### Eddystone Url
`thingy.eddystone`

Allows interaction with the connected device's eddystone url service

**Supported operations**

-   `read` - Reads the connected device's eddystone url
-   `write` - Writes the eddystone url of the connected device.
    - **Parameters**:
        - Eddystone url - String between 3 and 17 characters, according to **[this](https://github.com/google/eddystone/tree/master/eddystone-url)** format

### Environment Configuration
`thingy.environmentconfiguration`

Allows interaction with the connected device's environment configuration

**Supported operations**

-   `read` - Reads the connected device's current environment configuration
-   `write` - Writes the environment configuration of the connected device
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

### Euler orientation
`thingy.eulerorientation`

`event: eulerorientation`

Allows interaction with the connected device's euler orientation sensor

**Supported operations**

-   `start` - Starts sending euler orientation data from the connected device
-   `stop`  - Terminates sending euler orientation data from the connected device

### Firmware
`thingy.firmware`

Allows interaction with the connected device's firmware service

**Supported operations**

-   `read` - Reads the current firmware version deployed on the device


### Gas
`thingy.gas`

`event: gas`

Allows interaction with the connected device's gas sensor (co2 and tvoc)

**Supported operations**

-   `start` - Starts sending gas data from the connected device
-   `stop`  - Terminates sending gas data from the connected device

### Gravity vector
`thingy.gravityvector`

`event: gravityvector`

Allows interaction with the connected device's gravity vector sensor

**Supported operations**

-   `start` - Starts sending gravity vector data from the connected device
-   `stop`  - Terminates sending gravity vector data from the connected device

### Heading
`thingy.heading`

`event: heading`

Allows interaction with the connected device's heading sensor

**Supported operations**

-   `start` - Starts sending heading data from the connected device
-   `stop`  - Terminates sending heading data from the connected device

### Humidity
`thingy.humidity`

`event: humidity`

Allows interaction with the connected device's humidity sensor

**Supported operations**

-   `start` - Starts sending humidity data from the connected device
-   `stop`  - Terminates sending humidity data from the connected device

### LED
`thingy.led`

Allows interaction with the connected device's LED

**Supported operations**

-   `read` - reads the connected device's current LED configuration
-   `write` - Writes the LED configuration of the connected device
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

-   `start` - Starts sending microphone data from the connected device
-   `stop`  - Terminates sending microphone data from the connected device

### Motion Configuration
`thingy.motionconfiguration`

Allows interaction with the connected device's motion configuration

**Supported operations**

-   `read` - Reads the connected device's current motion configuration
-   `write` - Writes the motion configuration of the connected device
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

In development


### Name
`thingy.name`

Allows interaction with the connected device's name service

**Supported operations**

-   `read` - Reads the name of the connected device
-   `write` - Writes the name of the connected device.
    - **Parameters**:
        - Name - String shorter than or equal to 10 characters.

### Pressure
`thingy.pressure`

`event: pressure`

Allows interaction with the connected device's pressure sensor

**Supported operations**

-   `start` - Starts sending pressure data from the connected device
-   `stop`  - Terminates sending pressure data from the connected device

### Quaternion orientation
`thingy.quaternionorientation`

`event: quaternionorientation`

Allows interaction with the connected device's quaternion orientation sensor

**Supported operations**

-   `start` - Starts sending quaternion orientation data from the connected device
-   `stop`  - Terminates sending quaternion orientation data from the connected device

### Raw data
`thingy.rawdata`

`event: rawdata`

Allows interaction with the connected device's raw data sensor (includes accelerometer, gyroscope, and compass)

**Supported operations**

-   `start` - Starts sending raw data from the connected device
-   `stop`  - Terminates sending raw data from the connected device

### Rotation matrix orientation
`thingy.rotationmatrixorientation`

`event: rotationmatrixorientation`

Allows interaction with the connected device's rotation matrix orientation sensor

**Supported operations**

-   `start` - Starts sending rotation matrix orientation data from the connected device
-   `stop`  - Terminates sending rotation matrix orientation data from the connected device

### Speaker
`thingy.speaker`

Allows interaction with the connected device's speaker

**Supported operations**

In development


### Step counter
`thingy.stepcounter`

`event: stepcounter`

Allows interaction with the connected device's step counter sensor

**Supported operations**

-   `start` - Starts sending step counter data from the connected device
-   `stop`  - Terminates sending step counter data from the connected device

### Tap
`thingy.tap`

`event: tap`

Allows interaction with the connected device's tap sensor

**Supported operations**

-   `start` - Starts sending tap data from the connected device
-   `stop`  - Terminates sending tap data from the connected device

### Temperature
`thingy.temperature`

`event: temperature`

Allows interaction with the connected device's temperature sensor

**Supported operations**

-   `start` - Starts sending temperature data from the connected device
-   `stop`  - Terminates sending temperature data from the connected device