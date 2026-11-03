
namespace dt {

    export class dates { constructor(public month: number, public day: number, public year: number) { } }

    export class times { constructor(public hour: number, public minute: number, public second: number) { } }

    //% shim=KIND_GET
    //% blockHidden=true
    //% kindMemberName=dt
    //% blockId=datetime_kind
    //% block="$arg"
    //% kindNamespace=dtdb
    //% kindPromptHint="enter your datetime here"
    export function _datetimekindshadow(arg: number) { return arg }

    //% blockHidden=true
    //% blockId=datetime_dateshadow
    //% block="month $month / day $day / year $year"
    //% month.min=1 month.max=12 month.defl=1
    //% day.min=1 day.max=31 day.defl=20
    //% year.min=2020 year.max=2050 year.defl=2022
    export function datevalue(month: number, day: number, year: number) { return new dates(month, day, year) }

    //% blockHidden=true
    //% blockId=datetime_timeshadow
    //% block="$hour : $min . $sec"
    //% hour.min=0 hour.max=23 hour.defl=13
    //% min.min=0 min.max=59 min.defl=30
    //% sec.min=0 sec.max=59 sec.defl=0
    export function time24value(hour: number, min: number, sec: number) { return new times(hour, min, sec) }

    //% blockHidden=true
    //% blockId=datetime_halftimeshadow
    //% block="$hour : $min . $sec"
    //% hour.min=1 hour.max=12 hour.defl=11
    //% min.min=0 min.max=59 min.defl=30
    //% sec.min=0 sec.max=59 sec.defl=0
    export function time12value(hour: number, min: number, sec: number) { return new times(hour, min, sec) }
}
