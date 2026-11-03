
namespace DateTime {

    // ********* Misc. Utility Functions for formatting ************************
    export function leftZeroPadTo(inp: number, digits: number) {
        let value = inp + ""
        while (value.length < digits) {
            value = "0" + value
        }
        return value
    }


    // 24-hour time:  hh:mm.ss
    export function fullTime(t: DateTime): string {
        return leftZeroPadTo(t.hour, 2) + ":" + leftZeroPadTo(t.minute, 2) + "." + leftZeroPadTo(t.second, 2)
    }

    // Full year: yyyy-mm-dd
    export function fullYear(t: DateTime, y: YearFormat = 0): string {
        return leftZeroPadTo(t.year + y, 4) + "-" + leftZeroPadTo(t.month, 2) + "-" + leftZeroPadTo(t.day, 2)
    }

}
