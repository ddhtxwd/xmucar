
/**
 * 使用此文件来定义自定义函数和图形块。
 * 想了解更详细的信息，请前往 https://makecode.microbit.org/blocks/custom
 */

/**
 * 自定义图形块
 */
 
enum UltrasonicsUnit {
    //% block="厘米"
    Centimeters,
    //% block="英寸"
    Inches
}

enum RgbColors {
    //% block="红"
    Red = 0xFF0000,
    //% block="橙"
    Orange = 0xFFA500,
    //% block="黄"
    Yellow = 0xFFFF00,
    //% block="绿"
    Green = 0x00FF00,
    //% block="蓝"
    Blue = 0x0000FF,
    //% block="靛"
    Indigo = 0x4b0082,
    //% block="紫罗兰"
    Violet = 0x8a2be2,
    //% block="紫"
    Purple = 0xFF00FF,
    //% block="白"
    White = 0xFFFFFF,
    //% block="黑"
    Black = 0x000000
}

enum RgbUltrasonics {
    //% block="左"
    Left = 0x00,
    //% block="右"
    Right = 0x01,
    //% block="全部"
    All = 0x02
}

enum ColorEffect {
    //% block="无"
    None = 0x00,
    //% block=breathing
    Breathing = 0x01,
    //% block=rotate
    Rotate = 0x02,
    //% block=flash
    Flash = 0x03
}

enum rgb_ColorEffect {
    //% block=none
    None = 0x00,
    //% block=breathing
    Breathing = 0x01,
    //% block=flash
    Flash = 0x03
}

enum DHT11Type {
    //% block="温度(℃)" 
    DHT11_temperature_C = 0,
    //% block="湿度(0~100)"
    DHT11_humidity = 1,
}


//% weight=100 color=#0fbc11 icon="\uf1eb"  block="XMU_CAR"
namespace XMU_CAR {
	
	let COMMAND_I2C_ADDRESS = 0x24
    let DISPLAY_I2C_ADDRESS = 0x34
    let _SEG = [0x3F, 0x06, 0x5B, 0x4F, 0x66, 0x6D, 0x7D, 0x07, 0x7F, 0x6F, 0x77, 0x7C, 0x39, 0x5E, 0x79, 0x71];

    let _intensity = 3
    let dbuf = [0, 0, 0, 0]

    /**
     * send command to display
     * @param is command, eg: 0
     */
    function cmd(c: number) {
        pins.i2cWriteNumber(COMMAND_I2C_ADDRESS, c, NumberFormat.Int8BE)
    }

    /**
     * send data to display
     * @param is data, eg: 0
     */
    function dat(bit: number, d: number) {
        pins.i2cWriteNumber(DISPLAY_I2C_ADDRESS + (bit % 4), d, NumberFormat.Int8BE)
    }

    /**
     * turn on display
     */
    //% blockId="TM650_ON" block="开启显示"  group="TM1650数码管"
    //% weight=50 blockGap=8
	//% subcategory="显示"
    export function on() {
        cmd(_intensity * 16 + 1)
    }

    /**
     * turn off display
     */
    //% blockId="TM650_OFF" block="关闭显示"  group="TM1650数码管"
    //% weight=50 blockGap=8
	//% subcategory="显示"
    export function off() {
        _intensity = 0
        cmd(0)
    }

    /**
     * clear display content
     */
    //% blockId="TM650_CLEAR" block="清空显示"  group="TM1650数码管"
    //% weight=40 blockGap=8
	//% subcategory="显示"
    export function clear() {
        dat(0, 0)
        dat(1, 0)
        dat(2, 0)
        dat(3, 0)
        dbuf = [0, 0, 0, 0]
    }

    /**
     * show a digital in given position
     * @param digit is number (0-15) will be shown, eg: 1
     * @param bit is position, eg: 0
     */
    //% blockId="TM650_DIGIT" block="显示数字 %num|在 %bit"  group="TM1650数码管"
    //% weight=80 blockGap=8
    //% num.max=15 num.min=0
	//% subcategory="显示"
    export function digit(num: number, bit: number) {
        dbuf[bit % 4] = _SEG[num % 16]
        dat(bit, _SEG[num % 16])
    }

    /**
     * show a number in display
     * @param num is number will be shown, eg: 100
     */
    //% blockId="TM650_SHOW_NUMBER" block="显示数字 %num"  group="TM1650数码管"
    //% weight=100 blockGap=8
	//% subcategory="显示"
    export function showNumber(num: number) {
        if (num < 0) {
            dat(0, 0x40) // '-'
            num = -num
        }
        else
            digit(Math.idiv(num, 1000) % 10, 0)
        digit(num % 10, 3)
        digit(Math.idiv(num, 10) % 10, 2)
        digit(Math.idiv(num, 100) % 10, 1)
    }

    /**
     * show a number in hex format
     * @param num is number will be shown, eg: 123
     */
    //% blockId="TM650_SHOW_HEX_NUMBER" block="显示16进制数字 %num"  group="TM1650数码管"
    //% weight=90 blockGap=8
	//% subcategory="显示"
    export function showHex(num: number) {
        if (num < 0) {
            dat(0, 0x40) // '-'
            num = -num
        }
        else
            digit((num >> 12) % 16, 0)
        digit(num % 16, 3)
        digit((num >> 4) % 16, 2)
        digit((num >> 8) % 16, 1)
    }

    /**
     * show Dot Point in given position
     * @param bit is positiion, eg: 0
     * @param show is true/false, eg: true
     */
    //% blockId="TM650_SHOW_DP" block="显示小数点在第 %bit|位，同时显示数字 %num"  group="TM1650数码管"
    //% weight=80 blockGap=8
	//% subcategory="显示"
    export function showDpAt(bit: number, show: boolean) {
        if (show) dat(bit, dbuf[bit % 4] | 0x80)
        else dat(bit, dbuf[bit % 4] & 0x7F)
    }

    /**
     * set display intensity
     * @param dat is intensity of the display, eg: 3
     */
    //% blockId="TM650_INTENSITY" block="显示小数点在第 %dat位"  group="TM1650数码管"
    //% weight=70 blockGap=8
	//% subcategory="显示"
    export function setIntensity(dat: number) {
        if ((dat < 0) || (dat > 8))
            return;
        if (dat == 0)
            off()
        else {
            _intensity = dat
            cmd((dat << 4) | 0x01)
        }
    }
    let _SDO = 0
    let _SCL = 0

    //% blockId=actuator_keyborad_pin block="设置矩阵键盘引脚SDO: %SDO SCL: %SCL"   group="矩阵键盘模块"
    //% weight=71
    //% subcategory="键盘"
    export function actuator_keyborad_pin(SDO: DigitalPin, SCL: DigitalPin): void {

        _SDO = SDO
        _SCL = SCL
    }

    //% blockId=actuator_keyborad_read block="读取按键值"   group="矩阵键盘模块"
    //% weight=70
    //% subcategory="键盘"
    export function actuator_keyborad_read(): string {
        let DATA = 0
        pins.digitalWritePin(_SDO, 1)
        control.waitMicros(93)

        pins.digitalWritePin(_SDO, 0)
        control.waitMicros(10)

        for (let i = 0; i < 16; i++) {
            pins.digitalWritePin(_SCL, 1)
            pins.digitalWritePin(_SCL, 0)
            DATA |= pins.digitalReadPin(_SDO) << i
        }
        control.waitMicros(2 * 1000)
// 	serial.writeString('' + DATA + '\n');
        switch (DATA & 0xFFFF) {
            case 0xFFFE: return "1"
            case 0xFFFD: return "2"
            case 0xFFFB: return "3"
            case 0xFFEF: return "4"
            case 0xFFDF: return "5"
            case 0xFFBF: return "6"
            case 0xFEFF: return "7"
            case 0xFDFF: return "8"
            case 0xFBFF: return "9"
            case 0xDFFF: return "0"
            case 0xFFF7: return "A"
            case 0xFF7F: return "B"
            case 0xF7FF: return "C"
            case 0x7FFF: return "D"
            case 0xEFFF: return "*"
            case 0xBFFF: return "#"
            default: return " "
        }
    }

    function signal_dht11(pin: DigitalPin): void {
        pins.digitalWritePin(pin, 0);
        basic.pause(18);
        let i = pins.digitalReadPin(pin);
        pins.setPull(pin, PinPullMode.PullUp);
    }

    function dht11_read(pin: DigitalPin): number {
        signal_dht11(pin);
        let wait_time = 0;
        // Wait for response header to finish
        while (pins.digitalReadPin(pin) == 1);
        while (pins.digitalReadPin(pin) == 0);
        while (pins.digitalReadPin(pin) == 1);

        let value = 0;
        let counter = 0;

        for (let i = 0; i <= 32 - 1; i++) {
            while (pins.digitalReadPin(pin) == 0);
            counter = 0
            while (pins.digitalReadPin(pin) == 1) {
                counter += 1;
            }
            if (counter > 4) {
                value = value + (1 << (31 - i));
            }
        }
        return value;
    }

    export enum Dht11Result {
        //% block="摄氏度"
        Celsius,
        //% block="华氏度"
        Fahrenheit,
        //% block="湿度"
        humidity
    }

    //% blockId=get_DHT11_value block="DHT11 引脚 %pin_arg|获取 %dhtResult" blockExternalInputs=true
    //% pin_arg.fieldEditor="gridpicker" pin_arg.fieldOptions.columns=4
    //% pin_arg.fieldOptions.tooltips="false" pin_arg.fieldOptions.width="300"
    //% subcategory="传感器"
    export function get_DHT11_value(pin_arg: DigitalPin, dhtResult: Dht11Result): number {
        switch (dhtResult) {
            case Dht11Result.Celsius: return (dht11_read(pin_arg) & 0x0000ff00) >> 8;
            case Dht11Result.Fahrenheit: return ((dht11_read(pin_arg) & 0x0000ff00) >> 8) * 9 / 5 + 32;
            case Dht11Result.humidity: return dht11_read(pin_arg) >> 24;
            default: return 0;
        }
    }
	
	//% blockId=sensor_water block="水蒸气 引脚 %pines 读取值"  group="水蒸气传感器"
    //% weight=70
    //% inlineInputMode=inline
    //% subcategory="传感器"
    export function sensor_water(pines: AnalogPin): number{
         return pins.analogReadPin(pines);
         
    }


    //% blockId=sensor_temperature block="引脚%pin获取环境温度"  group="LM35温度传感器"
    //% weight=70
    //% inlineInputMode=inline
    //% subcategory="传感器"
    export function sensor_temperature(pin: AnalogPin): number {
        let temp = (pins.analogReadPin(pin) / 1023) * 3.3 * 100;
        return temp

    }

    //% blockId=sensor_flame block="引脚%pin检测到火焰？" group="火焰传感器"
    //% weight=70
    //% inlineInputMode=inline
    //% subcategory="传感器"
    export function sensor_flame(pin: DigitalPin): boolean {
       // pins.digitalWritePin(pin, 0)
        if (pins.digitalReadPin(pin) == 1) {
            return false;
        } else {
            return true;
        }
    }

    //% blockId=sensor_flame_analog block="引脚%pin读取火焰的模拟值" group="火焰传感器"
    //% weight=70
    //% inlineInputMode=inline
    //% subcategory="传感器"
    export function sensor_flame_analog(pin: AnalogPin): number {
        return pins.analogReadPin(pin)
    }

    //% blockId=sensor_infraredTracking block="引脚%pin检测到黑线？" group="红外寻迹传感器"
    //% weight=70
    //% inlineInputMode=inline
    //% subcategory="传感器"
    export function sensor_infraredTracking(pin: DigitalPin): boolean {
     //   pins.digitalWritePin(pin, 0)
        if (pins.digitalReadPin(pin) == 1) {
            return true;
        } else {
            return false;
        }
    }

    //% blockId=sensor_incline block="引脚%pin检测到倾斜？" group="倾斜传感器"
    //% weight=70
    //% inlineInputMode=inline
    //% subcategory="传感器"
    export function sensor_incline(pin: DigitalPin): boolean {
      //  pins.digitalWritePin(pin, 0)
        if (pins.digitalReadPin(pin) == 1) {
            return false;
        } else {
            return true;
        }
        // return pins.digitalReadPin(pin)

    }

    /**
     * 光敏传感器
     */

    //% blockId=sensor_illumination block="引脚%pin获取光照强度模拟值" group="光敏传感器"
    //% weight=70
    //% inlineInputMode=inline
    //% subcategory="传感器"
    export function sensor_illumination(pin: AnalogPin): number {
        return pins.analogReadPin(pin)
    }

    /**
     * 热敏传感器
     */

    //% blockId=sensor_thermosensitive block="引脚%pin获取热度模拟值" group="热敏传感器"
    //% weight=70
    //% inlineInputMode=inline
    //% subcategory="传感器"
    export function sensor_thermosensitive(pin: AnalogPin): number {
        return pins.analogReadPin(pin)
    }

    /**
     * 水位传感器
     */

    //% blockId=sensor_waterLevel block="引脚%pin获取水位模拟值" group="水位传感器"
    //% weight=70
    //% inlineInputMode=inline
    //% subcategory="传感器"
    export function sensor_waterLevel(pin: AnalogPin): number {
        return pins.analogReadPin(pin)
    }

    /**
     * 土壤湿度传感器
     */

    //% blockId=sensor_soilMoisture block="引脚%pin获取湿度模拟值"  group="土壤湿度传感器"
    //% weight=70
    //% inlineInputMode=inline
    //% subcategory="传感器"
    export function sensor_soilMoisture(pin: AnalogPin): number {
        return pins.analogReadPin(pin)
    }

    /**
     * 避障传感器
     */

    //% blockId=sensor_obstacleAvoid block="引脚%pin检测到前方有障碍物？" group="避障传感器"
    //% weight=70
    //% inlineInputMode=inline
    //% subcategory="传感器"
    export function sensor_obstacleAvoid(pin: DigitalPin): boolean {
       // pins.digitalWritePin(pin, 0)
        if (pins.digitalReadPin(pin) == 1) {
            return false;
        } else {
            return true;
        }
        // return pins.digitalReadPin(pin)   
    }

    /**
     * 磁簧开关传感器
     */

    //% blockId=sensor_reedSwitch block="引脚%pin检测到磁场？" group="磁簧开关传感器"
    //% weight=70
    //% inlineInputMode=inline
    //% subcategory="传感器"
    export function sensor_reedSwitch(pin: DigitalPin): boolean {
       // pins.digitalWritePin(pin, 0)
        if (pins.digitalReadPin(pin) == 1) {
            return false;
        } else {
            return true;
        }
    }

    /**
     * 人体热释电传感器
     */

    //% blockId=sensor_humanBody block="引脚%pin检测到人体热源？" group="人体热释电传感器"
    //% weight=70
    //% inlineInputMode=inline
    //% subcategory="传感器"
    export function sensor_humanBody(pin: DigitalPin): boolean {
     //   pins.digitalWritePin(pin, 0)
        if (pins.digitalReadPin(pin) == 1) {
            return true;
        } else {
            return false;
        }
    }

    /**
     * 震动传感器
     */

    //% blockId=sensor_quake block="引脚%pin检测到震动？" group="震动传感器"
    //% weight=70
    //% inlineInputMode=inline
    //% subcategory="传感器"
    export function sensor_quake(pin: DigitalPin): boolean {
     //   pins.digitalWritePin(pin, 0)
        if (pins.digitalReadPin(pin) == 1) {
            return false;
        } else {
            return true;
        }
    }

    /**
     * 震动传感器
     */

    //% blockId=sensor_quake_analog block="引脚%pin获取震动模拟值" group="震动传感器"
    //% weight=70
    //% inlineInputMode=inline
    //% subcategory="传感器"
    export function sensor_quake_analog(pin: AnalogPin): number {
        return pins.analogReadPin(pin)
    }

    /**
     * 灰度传感器
     */

    //% blockId=sensor_grayLevel block="引脚%pin获取颜色模拟值" group="灰度传感器"
    //% weight=70
    //% inlineInputMode=inline
    //% subcategory="传感器"
    export function sensor_grayLevel(pin: AnalogPin): number {
        return pins.analogReadPin(pin)
    }

    /**
     * 声音传感器
     */
    //% blockId=sensor_sound_analogread  block="引脚%AS获取声音的模拟值" group="声音传感器"
    //% weight=70
    //% inlineInputMode=inline
    //% subcategory="传感器"
    export function sensor_sound_analogread(_AS: AnalogPin): number {
        return pins.analogReadPin(_AS)

    }

    //% blockId=sensor_sound_digitalread  block="引脚%DS检测到声音？" group="声音传感器"
    //% weight=70
    //% inlineInputMode=inline
    //% subcategory="传感器"
    export function sensor_sound_digitalread(_DS: DigitalPin): boolean {
     //   pins.digitalWritePin(_DS, 0)
        if (pins.digitalReadPin(_DS) == 1) {
            return false;
        } else {
            return true;
        }
    }

    /**
     * 雨滴传感器
     */
    //% blockId=sensor_rain_analogread  block="引脚%AR获取雨滴的模拟值"  group="雨滴传感器"
    //% weight=70
    //% inlineInputMode=inline
    //% subcategory="传感器"
    export function sensor_rain_analogread(_DR: AnalogPin): number {
        return pins.analogReadPin(_DR)
    }

    //% blockId=sensor_rain_digitalread  block="引脚%DR雨滴传感器检测到雨滴?"   group="雨滴传感器"
    //% weight=70
    //% inlineInputMode=inline
    //% subcategory="传感器"
    export function sensor_rain_digitalread(_DR: DigitalPin): boolean {
      //  pins.digitalWritePin(_DR, 0)
        if (pins.digitalReadPin(_DR) == 1) {
            return false;
        } else {
            return true;
        }
    }

    /**
     * 气体传感器
     */
    //% blockId=sensor_gas_analogread  block="引脚%AG获取到气体的模拟值"  group="气体传感器"
    //% weight=70
    //% inlineInputMode=inline
    //% subcategory="传感器"
    export function sensor_gas_analogread(_AG: AnalogPin): number {
        return pins.analogReadPin(_AG)
    }

    //% blockId=sensor_gas_digitalread  block="引脚%DG检测到气体？"  group="气体传感器"
    //% weight=70
    //% inlineInputMode=inline
    //% subcategory="传感器"
    export function sensor_gas_digitalread(_DG: DigitalPin): boolean {
      //  pins.digitalWritePin(_DG, 0)
        if (pins.digitalReadPin(_DG) == 1) {
            return true;
        } else {
            return false;
        }
    }

    let initialized = false
    //let neoStrip: neopixel.Strip;
    let emRGBLight: EMRGBLight.EmakefunRGBLight;
    let board_emRGBLight: EMRGBLight.EmakefunRGBLight;
    let matBuf = pins.createBuffer(17);
    let distanceBuf = 0;

    /**
     * Get RUS04 distance
     * @param pin Microbit ultrasonic pin; eg: P2
    */
    //% blockId=Ultrasonic block="引脚%pin读取RGB超声波距离(cm)"  group="RGB超声波"
    //% weight=76
    //% inlineInputMode=inline
    //% subcategory="传感器"
    export function Ultrasonic(pin: DigitalPin): number {
        pins.setPull(pin, PinPullMode.PullNone);
        pins.digitalWritePin(pin, 0);
        control.waitMicros(2);
        pins.digitalWritePin(pin, 1);
        control.waitMicros(50);
        pins.digitalWritePin(pin, 0);
	    control.waitMicros(1000);
        while(!pins.digitalReadPin(pin));
        // read pulse
        let d = pins.pulseIn(pin, PulseValue.High, 25000);
        let ret = d;
        // filter timeout spikes
        if (ret == 0 && distanceBuf != 0) {
            ret = distanceBuf;
        }
        distanceBuf = d;
        //return d;
        return Math.floor(ret * 9 / 6 / 58);
        //return Math.floor(ret / 40 + (ret / 800));
        // Correction

    }

    function RgbDisplay(indexstart: number, indexend: number, rgb: RgbColors): void {
        for (let i = indexstart; i <= indexend; i++) {
            emRGBLight.setPixelColor(i, rgb);
        }
        emRGBLight.show();
    }
    
    function board_RgbDisplay(indexstart: number, indexend: number, rgb: RgbColors): void {
        for (let i = indexstart; i <= indexend; i++) {
            board_emRGBLight.setPixelColor(i, rgb);
        }
        board_emRGBLight.show();
    }

    export function rus04_rgb(pin: DigitalPin, offset: number, index: number, rgb: number, effect: number): void {
        let start = 0, end = 0;
        if (!emRGBLight) {
            emRGBLight = EMRGBLight.create(pin, 10, EMRGBPixelMode.RGB)
        }
        //if(offset >= 4 || offset == 0){
            if (index == RgbUltrasonics.Left) {
                start = 0;
                end = 2;
            } else if (index == RgbUltrasonics.Right) {
                start = 3;
                end = 5;
            } else if (index == RgbUltrasonics.All) {
                start = 0;
                end = 5;
            }
       // }
        start += offset;
        end += offset;
        switch (effect) {
            case ColorEffect.None:
                emRGBLight.setBrightness(255);
                RgbDisplay(start, end, rgb);
                break;
            case ColorEffect.Breathing:
                for (let i = 0; i < 255; i += 2) {
                    emRGBLight.setBrightness(i);
                    RgbDisplay(start, end, rgb);
                    //basic.pause((255 - i)/2);
                    basic.pause((i < 50) ? 10 : (255 / i));
                }
                for (let i = 255; i > 0; i -= 2) {
                    emRGBLight.setBrightness(i);
                    RgbDisplay(start, end, rgb);
                    basic.pause((i < 50) ? 10 : (255 / i));
                }
                break;
            case ColorEffect.Rotate:
                emRGBLight.setBrightness(255);
                for (let i = 0; i < 4; i++) {
                    emRGBLight.setPixelColor(start, rgb);
                    emRGBLight.setPixelColor(start + 1, 0);
                    emRGBLight.setPixelColor(start + 2, 0);
                    if (index == RgbUltrasonics.All) {
                        emRGBLight.setPixelColor(end - 2, rgb);
                        emRGBLight.setPixelColor(end - 1, 0);
                        emRGBLight.setPixelColor(end, 0);
                    }
                    emRGBLight.show();
                    basic.pause(150);
                    emRGBLight.setPixelColor(start, 0);
                    emRGBLight.setPixelColor(start + 1, rgb);
                    emRGBLight.setPixelColor(start + 2, 0);
                    if (index == RgbUltrasonics.All) {
                        emRGBLight.setPixelColor(end - 2, 0);
                        emRGBLight.setPixelColor(end - 1, rgb);
                        emRGBLight.setPixelColor(end, 0);
                    }
                    emRGBLight.show();
                    basic.pause(150);
                    emRGBLight.setPixelColor(start, 0);
                    emRGBLight.setPixelColor(start + 1, 0);
                    emRGBLight.setPixelColor(start + 2, rgb);
                    if (index == RgbUltrasonics.All) {
                        emRGBLight.setPixelColor(end - 2, 0);
                        emRGBLight.setPixelColor(end - 1, 0);
                        emRGBLight.setPixelColor(end, rgb);
                    }
                    emRGBLight.show();
                    basic.pause(150);
                    emRGBLight.setBrightness(0);
                }
                RgbDisplay(4, 9, 0);
                break;
            case ColorEffect.Flash:
                for (let i = 0; i < 3; i++) {
                    emRGBLight.setBrightness(255);
                    RgbDisplay(start, end, rgb);
                    basic.pause(100);
                    RgbDisplay(start, end, 0);
                    basic.pause(50);
                }
                break;
        }
    }
	
    export function board_rus04_rgb(pin: DigitalPin, offset: number, index: number, rgb: number, effect: number): void {
        let start = 0, end = 0;
        if (!board_emRGBLight) {
            board_emRGBLight = EMRGBLight.create(pin, 10, EMRGBPixelMode.RGB)
        }
        if(offset >= 4){
            if (index == RgbUltrasonics.Left) {
                start = 0;
                end = 2;
            } else if (index == RgbUltrasonics.Right) {
                start = 3;
                end = 5;
            } else if (index == RgbUltrasonics.All) {
                start = 0;
                end = 5;
            }
        }
        start += offset;
        end += offset;
        switch (effect) {
            case ColorEffect.None:
                board_emRGBLight.setBrightness(255);
                board_RgbDisplay(start, end, rgb);
                break;
            case ColorEffect.Breathing:
                for (let i = 0; i < 255; i += 2) {
                    board_emRGBLight.setBrightness(i);
                    board_RgbDisplay(start, end, rgb);
                    //basic.pause((255 - i)/2);
                    basic.pause((i < 50) ? 10 : (255 / i));
                }
                for (let i = 255; i > 0; i -= 2) {
                    board_emRGBLight.setBrightness(i);
                    board_RgbDisplay(start, end, rgb);
                    basic.pause((i < 50) ? 10 : (255 / i));
                }
                break;
            case ColorEffect.Rotate:
                board_emRGBLight.setBrightness(255);
                for (let i = 0; i < 4; i++) {
                    board_emRGBLight.setPixelColor(start, rgb);
                    board_emRGBLight.setPixelColor(start + 1, 0);
                    board_emRGBLight.setPixelColor(start + 2, 0);
                    if (index == RgbUltrasonics.All) {
                        board_emRGBLight.setPixelColor(end - 2, rgb);
                        board_emRGBLight.setPixelColor(end - 1, 0);
                        board_emRGBLight.setPixelColor(end, 0);
                    }
                    board_emRGBLight.show();
                    basic.pause(150);
                    board_emRGBLight.setPixelColor(start, 0);
                    board_emRGBLight.setPixelColor(start + 1, rgb);
                    board_emRGBLight.setPixelColor(start + 2, 0);
                    if (index == RgbUltrasonics.All) {
                        board_emRGBLight.setPixelColor(end - 2, 0);
                        board_emRGBLight.setPixelColor(end - 1, rgb);
                        board_emRGBLight.setPixelColor(end, 0);
                    }
                    board_emRGBLight.show();
                    basic.pause(150);
                    board_emRGBLight.setPixelColor(start, 0);
                    board_emRGBLight.setPixelColor(start + 1, 0);
                    board_emRGBLight.setPixelColor(start + 2, rgb);
                    if (index == RgbUltrasonics.All) {
                        board_emRGBLight.setPixelColor(end - 2, 0);
                        board_emRGBLight.setPixelColor(end - 1, 0);
                        board_emRGBLight.setPixelColor(end, rgb);
                    }
                    board_emRGBLight.show();
                    basic.pause(150);
                    board_emRGBLight.setBrightness(0);
                }
                board_RgbDisplay(4, 9, 0);
                break;
            case ColorEffect.Flash:
                for (let i = 0; i < 3; i++) {
                    board_emRGBLight.setBrightness(255);
                    board_RgbDisplay(start, end, rgb);
                    basic.pause(100);
                    board_RgbDisplay(start, end, 0);
                    basic.pause(50);
                }
                break;
        }
}

    //% blockId="sensorbit_rus04" block="引脚%pin 探头 %index 颜色 %rgb 效果 %effect"  group="RGB超声波"
    //% weight=75
    //% inlineInputMode=inline
    //% subcategory="传感器"
    export function sensorbit_rus04(pin: DigitalPin, index: RgbUltrasonics, rgb: RgbColors, effect: ColorEffect): void {
        rus04_rgb(pin, 0, index, rgb, effect);
    }

    /**
     * Send a ping and get the echo time (in microseconds) as a result
     * @param trig tigger pin
     * @param echo echo pin
     * @param unit desired conversion unit
     * @param maxCmDistance maximum distance in centimeters (default is 500)
     */
    //% blockId="sensor_ping" block="普通超声波trig %trig |echo %echo 获取距离|单位 %unit" group="普通超声波"
    //% weight=75
    //% inlineInputMode=inline
    //% subcategory="传感器"
    export function ping(trig: DigitalPin, echo: DigitalPin, unit: UltrasonicsUnit, maxCmDistance = 500): number {
        // send pulse
        pins.setPull(trig, PinPullMode.PullNone);
        pins.digitalWritePin(trig, 0);
        control.waitMicros(2);
        pins.digitalWritePin(trig, 1);
        control.waitMicros(10);
        pins.digitalWritePin(trig, 0);

        // read pulse
        const d = pins.pulseIn(echo, PulseValue.High, maxCmDistance * 58);

        switch (unit) {
            case UltrasonicsUnit.Centimeters: return Math.idiv(d, 58);
            case UltrasonicsUnit.Inches: return Math.idiv(d, 148);
            default: return d;
        }
    }

    //% blockId="readdht11" block="引脚 %dht11pin 获取温湿度传感器的 %dht11type"  group="温湿度传感器"
    //% subcategory="传感器"
    //% inlineInputMode=inline
    export function dht11value(dht11pin: DigitalPin, dht11type: DHT11Type): number {
        pins.digitalWritePin(dht11pin, 0)
        basic.pause(18)
        let i = pins.digitalReadPin(dht11pin)
        pins.setPull(dht11pin, PinPullMode.PullUp);
        switch (dht11type) {
            case 0:
                let dhtvalue1 = 0;
                let dhtcounter1 = 0;
                while (pins.digitalReadPin(dht11pin) == 1);
                while (pins.digitalReadPin(dht11pin) == 0);
                while (pins.digitalReadPin(dht11pin) == 1);
                for (let i = 0; i <= 32 - 1; i++) {
                    while (pins.digitalReadPin(dht11pin) == 0);
                    dhtcounter1 = 0
                    while (pins.digitalReadPin(dht11pin) == 1) {
                        dhtcounter1 += 1;
                    }
                    if (i > 15) {
                        if (dhtcounter1 > 2) {
                            dhtvalue1 = dhtvalue1 + (1 << (31 - i));
                        }
                    }
                }
                return ((dhtvalue1 & 0x0000ff00) >> 8);
                break;

            case 1:
                while (pins.digitalReadPin(dht11pin) == 1);
                while (pins.digitalReadPin(dht11pin) == 0);
                while (pins.digitalReadPin(dht11pin) == 1);

                let value = 0;
                let counter = 0;

                for (let i = 0; i <= 8 - 1; i++) {
                    while (pins.digitalReadPin(dht11pin) == 0);
                    counter = 0
                    while (pins.digitalReadPin(dht11pin) == 1) {
                        counter += 1;
                    }
                    if (counter > 3) {
                        value = value + (1 << (7 - i));
                    }
                }
                return value;
            default:
                return 0;
        }
    }


/**
     * 循迹传感器
     */
    //% blockId=sensor_tracking block="引脚 %pin 检测到黑线？"  group="循迹传感器"
    //% weight=74
    //% subcategory="传感器"
    //% inlineInputMode=inline
    export function sensor_tracking(pin: DigitalPin): boolean {
        //pins.digitalWritePin(pin, 0)
           if (pins.digitalReadPin(pin) == 1) {
              return false;
          }else {
              return true;
          }
      }
      
      let outPin1 = 0;
      let outPin2 = 0;
      let outPin3 = 0;
      let outPin4 = 0;
      /**
       * 四路循迹传感器初始化
       */
      //% blockId=four_sensor_tracking block="四路循迹初始化引脚OUT0|%pin1|引脚OUT1|%pin2|引脚OUT2|%pin3|引脚OUT3|%pin4"  group="循迹传感器"
      //% inlineInputMode=inline
      //% weight=73
      //% subcategory="传感器"
      export function four_sensor_tracking(pin1: DigitalPin, pin2: DigitalPin, pin3: DigitalPin, pin4: DigitalPin): void {
        outPin1 = pin1;
        outPin2 = pin2;
        outPin3 = pin3;
        outPin4 = pin4;
      }
      
      //% blockId=four_sensor_trackingValue block="四路循迹传感器获取的值"  group="循迹传感器"
      //% inlineInputMode=inline
      //% weight=72
      //% subcategory="传感器"
      export function four_sensor_trackingValue(): number {
        let result = 0;
//         pins.digitalWritePin(outPin1, 0)
//         pins.digitalWritePin(outPin2, 0)
//         pins.digitalWritePin(outPin3, 0)
//         pins.digitalWritePin(outPin4, 0)
        if (pins.digitalReadPin(outPin1) == 1) {
          result = 1 | result;
        }else {
          result = 0 | result;
        }
        if (pins.digitalReadPin(outPin2) == 1) {
          result = 2 | result;
        }else {
          result = 0 | result;
        }
        if (pins.digitalReadPin(outPin3) == 1) {
          result = 4 | result;
        }else {
          result = 0 | result;
        }
         if (pins.digitalReadPin(outPin4) == 1) {
          result = 8 | result;
        }else {
          result = 0 | result;
        }
        return result;
      }

    //% blockId="dht11value_v2" block="引脚 %dht11pin 获取温湿度传感器的 %dht11type"  group="温湿度传感器"
    //% subcategory="micro:bit(V2)"
    //% inlineInputMode=inline
    export function dht11value_v2(dht11pin: DigitalPin, dht11type: DHT11Type): number {
        pins.digitalWritePin(dht11pin, 0)
        basic.pause(18)
        let i = pins.digitalReadPin(dht11pin)
        pins.setPull(dht11pin, PinPullMode.PullUp);
        switch (dht11type) {
            case 0:
                let dhtvalue1 = 0;
                let dhtcounter1 = 0;
                while (pins.digitalReadPin(dht11pin) == 1);
                while (pins.digitalReadPin(dht11pin) == 0);
                while (pins.digitalReadPin(dht11pin) == 1);
                for (let i = 0; i <= 32 - 1; i++) {
                    while (pins.digitalReadPin(dht11pin) == 0);
                    dhtcounter1 = 0
                    while (pins.digitalReadPin(dht11pin) == 1) {
                        dhtcounter1 += 1;
                    }
                    if (i > 15) {
                        if (dhtcounter1 > 10) {
                            dhtvalue1 = dhtvalue1 + (1 << (31 - i));
                        }
                    }
                }
                return ((dhtvalue1 & 0x0000ffff)>> 8);
                break;

            case 1:
                while (pins.digitalReadPin(dht11pin) == 1);
                while (pins.digitalReadPin(dht11pin) == 0);
                while (pins.digitalReadPin(dht11pin) == 1);

                let value = 0;
                let counter = 0;

                for (let i = 0; i <= 8 - 1; i++) {
                    while (pins.digitalReadPin(dht11pin) == 0);
                    counter = 0
                    while (pins.digitalReadPin(dht11pin) == 1) {
                        counter += 1;
                    }
                    if (counter > 10) {
                        value = value + (1 << (7 - i));
                    }
                }
                return value;
            default:
                return 0;
        }
    }
	const PCA9685_ADDRESS = 0x40
    const MODE1 = 0x00
    const MODE2 = 0x01
    const SUBADR1 = 0x02
    const SUBADR2 = 0x03
    const SUBADR3 = 0x04
    const PRESCALE = 0xFE
    const LED0_ON_L = 0x06
    const LED0_ON_H = 0x07
    const LED0_OFF_L = 0x08
    const LED0_OFF_H = 0x09
    const ALL_LED_ON_L = 0xFA
    const ALL_LED_ON_H = 0xFB
    const ALL_LED_OFF_L = 0xFC
    const ALL_LED_OFF_H = 0xFD

    const STP_CHA_L = 2047
    const STP_CHA_H = 4095

    const STP_CHB_L = 1
    const STP_CHB_H = 2047

    const STP_CHC_L = 1023
    const STP_CHC_H = 3071

    const STP_CHD_L = 3071
    const STP_CHD_H = 1023


    const BYG_CHA_L = 3071
    const BYG_CHA_H = 1023

    const BYG_CHB_L = 1023
    const BYG_CHB_H = 3071

    const BYG_CHC_L = 4095
    const BYG_CHC_H = 2047

    const BYG_CHD_L = 2047
    const BYG_CHD_H = 4095

    /**
     * The user can choose the step motor model.
     */
    export enum Stepper {
        //% block="42"
        Ste1 = 1,
        //% block="28"
        Ste2 = 2
    }

    /**
     * The user can select the 8 steering gear controller.
     */
    export enum Servos {
        S1 = 0x08,
        S2 = 0x07,
        S3 = 0x06,
        S4 = 0x05,
        S5 = 0x04,
        S6 = 0x03,
        S7 = 0x02,
        S8 = 0x01
    }

    /**
     * The user selects the 4-way dc motor.
     */
    export enum Motors {
        M1 = 0x1,
        M2 = 0x2,
        M3 = 0x3,
        M4 = 0x4
    }

    /**
     * The user defines the motor rotation direction.
     */
    export enum Dir {
        //% blockId="CW" block="CW"
        CW = 1,
        //% blockId="CCW" block="CCW"
        CCW = -1,
    }

    /**
     * The user can select a two-path stepper motor controller.
     */
    export enum Steppers {
        M1_M2 = 0x1,
        M3_M4 = 0x2
    }



    let initialized = false

    function i2cWrite(addr: number, reg: number, value: number) {
        let buf = pins.createBuffer(2)
        buf[0] = reg
        buf[1] = value
        pins.i2cWriteBuffer(addr, buf)
    }

    function i2cCmd(addr: number, value: number) {
        let buf = pins.createBuffer(1)
        buf[0] = value
        pins.i2cWriteBuffer(addr, buf)
    }

    function i2cRead(addr: number, reg: number) {
        pins.i2cWriteNumber(addr, reg, NumberFormat.UInt8BE);
        let val = pins.i2cReadNumber(addr, NumberFormat.UInt8BE);
        return val;
    }

    function initPCA9685(): void {
        i2cWrite(PCA9685_ADDRESS, MODE1, 0x00)
        setFreq(50);
        initialized = true
    }

    function setFreq(freq: number): void {
        // Constrain the frequency
        let prescaleval = 25000000;
        prescaleval /= 4096;
        prescaleval /= freq;
        prescaleval -= 1;
        let prescale = prescaleval;//Math.floor(prescaleval + 0.5);
        let oldmode = i2cRead(PCA9685_ADDRESS, MODE1);
        let newmode = (oldmode & 0x7F) | 0x10; // sleep
        i2cWrite(PCA9685_ADDRESS, MODE1, newmode); // go to sleep
        i2cWrite(PCA9685_ADDRESS, PRESCALE, prescale); // set the prescaler
        i2cWrite(PCA9685_ADDRESS, MODE1, oldmode);
        control.waitMicros(5000);
        i2cWrite(PCA9685_ADDRESS, MODE1, oldmode | 0xa1);
    }

    function setPwm(channel: number, on: number, off: number): void {
        if (channel < 0 || channel > 15)
            return;

        let buf = pins.createBuffer(5);
        buf[0] = LED0_ON_L + 4 * channel;
        buf[1] = on & 0xff;
        buf[2] = (on >> 8) & 0xff;
        buf[3] = off & 0xff;
        buf[4] = (off >> 8) & 0xff;
        pins.i2cWriteBuffer(PCA9685_ADDRESS, buf);
    }


    function setStepper_28(index: number, dir: boolean): void {
        if (index == 1) {
            if (dir) {
                setPwm(4, STP_CHA_L, STP_CHA_H);
                setPwm(6, STP_CHB_L, STP_CHB_H);
                setPwm(5, STP_CHC_L, STP_CHC_H);
                setPwm(7, STP_CHD_L, STP_CHD_H);
            } else {
                setPwm(7, STP_CHA_L, STP_CHA_H);
                setPwm(5, STP_CHB_L, STP_CHB_H);
                setPwm(6, STP_CHC_L, STP_CHC_H);
                setPwm(4, STP_CHD_L, STP_CHD_H);
            }
        } else {
            if (dir) {
                setPwm(0, STP_CHA_L, STP_CHA_H);
                setPwm(2, STP_CHB_L, STP_CHB_H);
                setPwm(1, STP_CHC_L, STP_CHC_H);
                setPwm(3, STP_CHD_L, STP_CHD_H);
            } else {
                setPwm(3, STP_CHA_L, STP_CHA_H);
                setPwm(1, STP_CHB_L, STP_CHB_H);
                setPwm(2, STP_CHC_L, STP_CHC_H);
                setPwm(0, STP_CHD_L, STP_CHD_H);
            }
        }
    }


    function setStepper_42(index: number, dir: boolean): void {
        if (index == 1) {
            if (dir) {
                setPwm(7, BYG_CHA_L, BYG_CHA_H);
                setPwm(6, BYG_CHB_L, BYG_CHB_H);
                setPwm(5, BYG_CHC_L, BYG_CHC_H);
                setPwm(4, BYG_CHD_L, BYG_CHD_H);
            } else {
                setPwm(7, BYG_CHC_L, BYG_CHC_H);
                setPwm(6, BYG_CHD_L, BYG_CHD_H);
                setPwm(5, BYG_CHA_L, BYG_CHA_H);
                setPwm(4, BYG_CHB_L, BYG_CHB_H);
            }
        } else {
            if (dir) {
                setPwm(3, BYG_CHA_L, BYG_CHA_H);
                setPwm(2, BYG_CHB_L, BYG_CHB_H);
                setPwm(1, BYG_CHC_L, BYG_CHC_H);
                setPwm(0, BYG_CHD_L, BYG_CHD_H);
            } else {
                setPwm(3, BYG_CHC_L, BYG_CHC_H);
                setPwm(2, BYG_CHD_L, BYG_CHD_H);
                setPwm(1, BYG_CHA_L, BYG_CHA_H);
                setPwm(0, BYG_CHB_L, BYG_CHB_H);
            }
        }
    }


    /**
	 * Steering gear control function.
     * S1~S8.
     * 0°~180°.
	*/
    //% blockId=motor_servo block="Servo|%index|degree|%degree"
    //% weight=100
    //% degree.min=0 degree.max=180
    //% index.fieldEditor="gridpicker" index.fieldOptions.columns=4
    export function servo(index: Servos, degree: number): void {
        if (!initialized) {
            initPCA9685()
        }
        // 50hz
        let v_us = (degree * 1800 / 180 + 600) // 0.6ms ~ 2.4ms
        let value = v_us * 4096 / 20000
        setPwm(index + 7, 0, value)
    }

    /**
	 * Execute a motor
     * M1~M4.
     * speed(0~255).
    */
    //% weight=90
    //% blockId=motor_MotorRun block="Motor|%index|dir|%Dir|speed|%speed"
    //% speed.min=0 speed.max=255
    //% index.fieldEditor="gridpicker" index.fieldOptions.columns=2
    //% direction.fieldEditor="gridpicker" direction.fieldOptions.columns=2
    export function MotorRun(index: Motors, direction: Dir, speed: number): void {
        if (!initialized) {
            initPCA9685()
        }
        speed = speed * 16 * direction; // map 255 to 4096
        if (speed >= 4096) {
            speed = 4095
        }
        if (speed <= -4096) {
            speed = -4095
        }
        if (index > 4 || index <= 0)
            return
        let pn = (4 - index) * 2
        let pp = (4 - index) * 2 + 1
        if (speed >= 0) {
            setPwm(pp, 0, speed)
            setPwm(pn, 0, 0)
        } else {
            setPwm(pp, 0, 0)
            setPwm(pn, 0, -speed)
        }
    }

    /**
	 * Execute a 42BYGH1861A-C step motor(Degree).
     * M1_M2/M3_M4.
    */
    //% weight=80
    //% blockId=motor_stepperDegree_42 block="Stepper 42|%index|dir|%direction|degree|%degree"
    //% index.fieldEditor="gridpicker" index.fieldOptions.columns=2
    //% direction.fieldEditor="gridpicker" direction.fieldOptions.columns=2
    export function stepperDegree_42(index: Steppers, direction: Dir, degree: number): void {
        if (!initialized) {
            initPCA9685()
        }
        // let Degree = Math.abs(degree);
        // Degree = Degree * direction;
        //setFreq(100);
        setStepper_42(index, direction > 0);
        if (degree == 0) {
            return;
        }
        let Degree = Math.abs(degree);
        basic.pause((50000 * Degree) / (360 * 100));  //100hz
        if (index == 1) {
            motorStop(1)
            motorStop(2)
        } else {
            motorStop(3)
            motorStop(4)
        }
        //setFreq(50);
    }

    /**
	 * Execute a 42BYGH1861A-C step motor(Turn).
     * M1_M2/M3_M4.
    */
    //% weight=70
    //% blockId=motor_stepperTurn_42 block="Stepper 42|%index|dir|%direction|turn|%turn"
    //% index.fieldEditor="gridpicker" index.fieldOptions.columns=2
    //% direction.fieldEditor="gridpicker" direction.fieldOptions.columns=2
    export function stepperTurn_42(index: Steppers, direction: Dir, turn: number): void {
        if (turn == 0) {
            return;
        }
        let degree = turn * 360;
        stepperDegree_42(index, direction, degree);
    }

    /**
	 * Execute a 28BYJ-48 step motor(Degree).
     * M1_M2/M3_M4.
    */
    //% weight=60
    //% blockId=motor_stepperDegree_28 block="Stepper 28|%index|dir|%direction|degree|%degree"
    //% index.fieldEditor="gridpicker" index.fieldOptions.columns=2
    //% direction.fieldEditor="gridpicker" direction.fieldOptions.columns=2
    export function stepperDegree_28(index: Steppers, direction: Dir, degree: number): void {
        if (!initialized) {
            initPCA9685()
        }
        if (degree == 0) {
            return;
        }
        let Degree = Math.abs(degree);
        Degree = Degree * direction;
        //setFreq(100);
        setStepper_28(index, Degree > 0);
        Degree = Math.abs(Degree);
        basic.pause((1000 * Degree) / 360);
        if (index == 1) {
            motorStop(1)
            motorStop(2)
        } else {
            motorStop(3)
            motorStop(4)
        }
        //setFreq(50);
    }

    /**
	 * Execute a 28BYJ-48 step motor(Turn).
     * M1_M2/M3_M4.
    */
    //% weight=50
    //% blockId=motor_stepperTurn_28 block="Stepper 28|%index|dir|%direction|turn|%turn"
    //% index.fieldEditor="gridpicker" index.fieldOptions.columns=2
    //% direction.fieldEditor="gridpicker" direction.fieldOptions.columns=2
    export function stepperTurn_28(index: Steppers, direction: Dir, turn: number): void {
        if (turn == 0) {
            return;
        }
        let degree = turn * 360;
        stepperDegree_28(index, direction, degree);
    }

    /**
	 * Two parallel stepper motors are executed simultaneously(DegreeDual).
    */
    //% weight=40
    //% blockId=motor_stepperDegreeDual_42 block="Dual Stepper %stepper|M1_M2 dir %direction1|degree %degree1|M3_M4 dir %direction2|degree %degree2"
    //% stepper.fieldEditor="gridpicker" stepper.fieldOptions.columns=2
    //% direction1.fieldEditor="gridpicker" direction1.fieldOptions.columns=2
    //% direction2.fieldEditor="gridpicker" direction2.fieldOptions.columns=2
    export function stepperDegreeDual_42(stepper: Stepper, direction1: Dir, degree1: number, direction2: Dir, degree2: number): void {
        if (!initialized) {
            initPCA9685()
        }
        let timeout1 = 0;
        let timeout2 = 0;
        let Degree1 = Math.abs(degree1);
        let Degree2 = Math.abs(degree2);

        if (stepper == 1) {  // 42 stepper
            if (Degree1 == 0 && Degree2 == 0) {
                setStepper_42(0x01, direction1 > 0);
                setStepper_42(0x02, direction2 > 0);
            } else if ((Degree1 == 0) && (Degree2 > 0)) {
                timeout1 = (50000 * Degree2) / (360 * 100)
                setStepper_42(0x01, direction1 > 0);
                setStepper_42(0x02, direction2 > 0);
                basic.pause(timeout1);
                motorStop(3); motorStop(4);
            } else if ((Degree2 == 0) && (Degree1 > 0)) {
                timeout1 = (50000 * Degree1) / (360 * 100)
                setStepper_42(0x01, direction1 > 0);
                setStepper_42(0x02, direction2 > 0);
                basic.pause(timeout1);
                motorStop(1); motorStop(2);
            } else if ((Degree2 > Degree1)) {
                timeout1 = (50000 * Degree1) / (360 * 100)
                timeout2 = (50000 * (Degree2 - Degree1)) / (360 * 100)
                setStepper_42(0x01, direction1 > 0);
                setStepper_42(0x02, direction2 > 0);
                basic.pause(timeout1);
                motorStop(1); motorStop(2);
                basic.pause(timeout2);
                motorStop(3); motorStop(4);
            } else if ((Degree2 < Degree1)) {
                timeout1 = (50000 * Degree2) / (360 * 100)
                timeout2 = (50000 * (Degree1 - Degree2)) / (360 * 100)
                setStepper_42(0x01, direction1 > 0);
                setStepper_42(0x02, direction2 > 0);
                basic.pause(timeout1);
                motorStop(3); motorStop(4);
                basic.pause(timeout2);
                motorStop(1); motorStop(2);
            }
        } else if (stepper == 2) {
            if (Degree1 == 0 && Degree2 == 0) {
                setStepper_28(0x01, direction1 > 0);
                setStepper_28(0x02, direction2 > 0);
            } else if ((Degree1 == 0) && (Degree2 > 0)) {
                timeout1 = (50000 * Degree2) / (360 * 100)
                setStepper_28(0x01, direction1 > 0);
                setStepper_28(0x02, direction2 > 0);
                basic.pause(timeout1);
                motorStop(3); motorStop(4);
            } else if ((Degree2 == 0) && (Degree1 > 0)) {
                timeout1 = (50000 * Degree1) / (360 * 100)
                setStepper_28(0x01, direction1 > 0);
                setStepper_28(0x02, direction2 > 0);
                basic.pause(timeout1);
                motorStop(1); motorStop(2);
            } else if ((Degree2 > Degree1)) {
                timeout1 = (50000 * Degree1) / (360 * 100)
                timeout2 = (50000 * (Degree2 - Degree1)) / (360 * 100)
                setStepper_28(0x01, direction1 > 0);
                setStepper_28(0x02, direction2 > 0);
                basic.pause(timeout1);
                motorStop(1); motorStop(2);
                basic.pause(timeout2);
                motorStop(3); motorStop(4);
            } else if ((Degree2 < Degree1)) {
                timeout1 = (50000 * Degree2) / (360 * 100)
                timeout2 = (50000 * (Degree1 - Degree2)) / (360 * 100)
                setStepper_28(0x01, direction1 > 0);
                setStepper_28(0x02, direction2 > 0);
                basic.pause(timeout1);
                motorStop(3); motorStop(4);
                basic.pause(timeout2);
                motorStop(1); motorStop(2);
            }
        } else {
            //
        }
    }

    /**
	 * Two parallel stepper motors are executed simultaneously(Turn).
    */
    //% weight=30
    //% blockId=motor_stepperTurnDual_42 block="Dual Stepper %stepper|M1_M2 dir %direction1|trun %trun1|M3_M4 dir %direction2|trun %trun2"
    //% stepper.fieldEditor="gridpicker" stepper.fieldOptions.columns=2
    //% direction1.fieldEditor="gridpicker" direction1.fieldOptions.columns=2
    //% direction2.fieldEditor="gridpicker" direction2.fieldOptions.columns=2
    export function stepperTurnDual_42(stepper: Stepper, direction1: Dir, trun1: number, direction2: Dir, trun2: number): void {
        if ((trun1 == 0) && (trun2 == 0)) {
            return;
        }
        let degree1 = trun1 * 360;
        let degree2 = trun2 * 360;

        if (stepper == 1) {
            stepperDegreeDual_42(stepper, direction1, degree1, direction2, degree2);
        } else if (stepper == 2) {
            stepperDegreeDual_42(stepper, direction1, degree1, direction2, degree2);
        } else {

        }

    }

    /**
	 * Stop the dc motor.
    */
    //% weight=20
    //% blockId=motor_motorStop block="Motor stop|%index"
    //% index.fieldEditor="gridpicker" index.fieldOptions.columns=2 
    export function motorStop(index: Motors) {
        setPwm((4 - index) * 2, 0, 0);
        setPwm((4 - index) * 2 + 1, 0, 0);
    }

    /**
	 * Stop all motors
    */
    //% weight=10
    //% blockId=motor_motorStopAll block="Motor Stop All"
    export function motorStopAll(): void {
        for (let idx = 1; idx <= 4; idx++) {
            motorStop(idx);
        }
    }
}


