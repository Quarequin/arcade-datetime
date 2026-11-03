
namespace DateTimeData {

    let kindid: number;

    export function create() {
        if (!(kindid)) kindid = 0
        return kindid++
    }

    //%isKind
    export const mainDateTime = create()

}

namespace DateTime {
    let dtdata: DateTime[] = [], dtformatdata: number[][] = [], dtid: number[] = [], curarg = 0

    function checkid(arg: number): number {
        if (dtid.indexOf(arg) < 0) {
            dtid.push(curarg++)
            dtformatdata.push([0, 0, 0])
            dtdata.push({ month: 0, year: 0, day: 0, hour: 0, minute: 0, second: 0, dayOfYear: 0 })
            return dtid.length - 1
        }
        return arg
    }
}
