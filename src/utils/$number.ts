import { $require } from './$require';

export namespace $number {

    export function div (a: number, b: number, digits: number = 5) {
        let r = 10 ** digits;
        return Math.round(a * r / b) / r;
    }

    /**
     * [min, max)
     * @param min: includes
     * @param max: excludes
     */
     export function random(min: number, max: number) {
        $require.True(min < max, `Random Int expects max to be greater then min: ${min}..${max}`);
        return Math.random() * (max - min) + min;
    }
    /**
     * [min, max)
     * @param min: includes
     * @param max: excludes
     */
    export function randomInt(min: number, max: number) {
        $require.True(min < max, `Random Int expects max to be greater then min: ${min}..${max}`);
        return Math.floor(Math.random() * (max - min)) + min;
    }
    /**
     * [min, max)
     * @param min: includes
     * @param max: excludes
     */
    export function randomFloat(min: number, max: number, decimals: number = 0) {
        let decimalsFromNumber = 0;
        while (min * 10 ** decimalsFromNumber % 1 > 0 || max * 10 ** decimalsFromNumber % 1 > 0) {
            decimalsFromNumber++;
        }
        let val = 10 ** Math.max(decimals, decimalsFromNumber);
        return randomInt(min * val, max * val) / val;
    }
    export function parse (mix: string | number) {
        if (!mix) return 0;
        if (typeof mix === 'number') {
            return mix;
        }
        let factor: number = null;
        // string
        let c = mix[mix.length - 1];
        if (c === 'k' || c === 'K') {
            factor = 1000;
            mix = mix.substring(0, mix.length - 1);
        }
        if (c === 'm' || c === 'M') {
            factor = 1000000;
            mix = mix.substring(0, mix.length - 1);
        }
        if (c === 'b' || c === 'B') {
            factor = 1000000000;
            mix = mix.substring(0, mix.length - 1);
        }

        let value = parseFloat(mix.replace(/,+/g, '.'));
        if (isNaN(value)) {
            throw new Error(`Invalid number to parse: ${mix}`);
        }
        if (factor != null) {
            value *= factor;
        }
        return value;
    }
    export function round (mix: string | number, digits: number = 0, round: 'ceil' | 'round' | 'floor' = 'round') {
        let number = typeof mix === 'string' ? Number(mix) : mix;
        if (isNaN(number)) {
            return number;
        }
        let factor = Math.pow(10, digits);
        let val = number * factor;
        let e = val - (val | 0);
        if (e < 0) {
            e *= -1;
        }
        if (e < .0001) {
            val = val | 0;
        }
        return Math[round](val) / factor;
    }
    export function parseOptional (mix, default_ = null) {
        if (mix == null) {
            return default_;
        }
        if (typeof mix === 'number') {
            return mix;
        }
        if (typeof mix === 'string') {

            let num = parseFloat(mix.replace(/,+/g, '.'));
            if (Number.isFinite(num) === false) {
                return default_;
            }
            return num;
        }
        throw new Error('Unsupported type to convert to number ' + typeof mix);
    }

    export function toHex (num: string | number) {
        return `0x` + Number(num).toString(16);
    }
}
