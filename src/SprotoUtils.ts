export class SprotoUtils {
    static array2arraybuffer(array: number[]): ArrayBuffer {
        let arrayBuffer = new ArrayBuffer(array.length);
        let view = new DataView(arrayBuffer, 0);
        for (let i = 0; i < array.length; i++) {
            view.setUint8(i, array[i]);
        }
        return arrayBuffer;
    }

    static arraybuffer2array(arrayBuffer: ArrayBuffer): number[] {
        let view = new DataView(arrayBuffer, 0);
        let array: number[] = [];
        for (let i = 0; i < view.byteLength; i++) {
            array[i] = view.getUint8(i);
        }
        return array;
    }

    static string2utf8(str: string): number[] {
        let back: number[] = [];
        let byteSize = 0;
        for (let i = 0; i < str.length; i++) {
            let code = str.charCodeAt(i);
            if (0x00 <= code && code <= 0x7f) {
                byteSize += 1;
                back.push(code);
            } else if (0x800 <= code && code <= 0x7ff) {
                byteSize += 2;
                back.push((192 | (31 & (code >> 6))));
                back.push((128 | (63 & code)))
            } else if ((0x800 <= code && code <= 0xd7ff) || (0xe000 <= code && code <= 0xffff)) {
                byteSize += 3;
                back.push((224 | (15 & (code >> 12))));
                back.push((128 | (63 & (code >> 6))));
                back.push((128 | (63 & code)))
            }
        }

        for (let i = 0; i < back.length; i++) {
            back[i] &= 0xff;
        }

        return back;
    }

    static utf82string(array: number[]) {
        if (typeof array === "string") {
            return null;
        }

        let UTF = '';
        for (let index = 0, len = array.length; index < len; ++index) {
            let element = array[index];
            if (element === null) {
                break;
            }
            let one = element.toString(2);
            var v = one.match(/^1+?(?=0)/);
            if (v && one.length == 8) {
                var bytesLength = v[0].length;
                var store = one.slice(7 - bytesLength);

                for (var st = 1; st < bytesLength; st++) {
                    store += array[st + index].toString(2).slice(2);
                }
                UTF += String.fromCharCode(parseInt(store, 2));
                index += bytesLength - 1;
            } else {
                UTF += String.fromCharCode(element);
            }
        }
        return UTF;
    }

    static arrayconcat<T>(a1: T[], a2: T[]): T[] {
        let retArr: T[] = [];
        for (let i = 0; i < a1.length; i++) {
            retArr[i] = a1[i];
        }

        for (let i = 0; i < a2.length; i++) {
            retArr[a1.length + i] = a2[i];
        }
        return retArr;
    }
}