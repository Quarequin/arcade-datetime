
namespace DateTimeData {

    let kindid: number;

    export function create() {
        if (!(kindid)) kindid = 0
        return kindid++
    }

    //%isKind
    export const mainDateTime = create()

}
