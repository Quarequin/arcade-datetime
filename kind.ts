
namespace dtdb {

    let kindid: number;

    export function create() {
        if (!(kindid)) kindid = 0
        return kindid++
    }

    //%isKind
    export const mainDateTime = create()

}

namespace dt {
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

    /**
     * Set the default kind to process
     * @param datetime kind to get
     */
    //% block=datetime_setdefaultkind
    //% block="set default kind to $kindn"
    //% kindn.shadow=datetime_kind
    //% inlineInputMode=inline
    //% weight=135
    export function setCurKind(kindn: number) {
        if (curKind == kindn) return;
        curKind = kindn
        const uid = checkid(curKind)
        startYear = dtformatdata[uid][0]
        timeToSetpoint = dtformatdata[uid][1]
        cpuTimeAtSetpoint = cpuTimeInSeconds()
    }

    /**
     * get the datetime value from kind data
     * @param dropdown of datetime list
     * @param datetime kind to get
     */
    //% block=datetime_getvaluefromkinddata
    //% block="get $dt from datetime kind $kindn"
    //% kindn.shadow=datetime_kind
    //% inlineInputMode=inline
    //% weight=133
    export function getDataOfKind(dt: DropDatetime, kindn: number) {
        const uid = checkid(kindn)
        const udatetime = dtdata[uid]
        switch (dt) {
            case 0:
                return udatetime.month
                break

            case 1:
                return udatetime.day
                break

            case 2:
                return udatetime.year
                break

            case 3:
                return udatetime.hour
                break

            case 4:
                return udatetime.minute
                break

            case 5:
                return udatetime.second
                break

        }
        return -1
    }

}
