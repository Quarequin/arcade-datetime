
namespace dt {

    /**
     * create calendar table from date
     * @param idate the date to create raw calendar
     */
    //% blockid=datetime_datetable
    //% block="calendar table as $idate"
    //% idate.shadow=datetime_dateshadow
    //% weight=15
    export function dateAsTableList(idate: dates): number[] {
        let dateJ = new dates(idate.month, idate.day, idate.year)
        let dateCountI = dateToDaySince(datevalue(dateJ.month, dateJ.day, dateJ.year))
        let dateI = dateSinceFor(dateCountI)
        let dateWeek = dateToDayOfWeek(datevalue(dateI.month, dateI.day, dateI.year))
        while (dateI.month == dateJ.month || dateWeek != 0) {
            dateCountI--
            dateI = dateSinceFor(dateCountI)
            dateWeek = dateToDayOfWeek(datevalue(dateI.month, dateI.day, dateI.year))
        }
        let tableDate: number[] = []
        let tableCol = 7, tableRow = 6
        for (let iin = 0; iin < tableCol * tableRow; iin++) {
            dateI = dateSinceFor(dateCountI + iin)
            tableDate.push((dateJ.month == dateI.month || (dateI.dayOfYear == 1)) ? dateI.dayOfYear - cdoy[dateI.month] + ((dateI.month > 2 && isLeapYear(dateI.year)) ? 1 : 0) : -1)
        }
        return tableDate
    }

    /**
     * Get all values of time as numbers.  
     */
    //% blockid=datetime_alldatetimetogetinstatement
    //% block="date and time from kind $kindn as numbers $hour:$minute.$second on $month/$day/$year" advanced=true
    //% kindn.shadow=datetime_kind
    //% handlerStatement
    //% draggableParameters="reporter"
    //% weight=100
    export function numericTime(kindn: number, handler: (hour: Hour, minute: Minute, second: Second, month: Month, day: Day, year: Year) => void) {
        const cpuTime = cpuTimeInSeconds()
        const t = timeFor(cpuTime, kindn)
        handler(t.hour, t.minute, t.second, t.month, t.day, t.year)
    }

    /**
     * Current time as a string in the format
     * @param format the format to use
     */
    //% blockid=datetime_time2format
    //% block="time as $format|| from datetime kind $kindn"
    //% kindn.shadow=datetime_kind
    //% weight=70
    export function time(format: TimeFormat, kindn: number = null, uval: boolean = false): string {
        const cpuTime = cpuTimeInSeconds()
        const t = timeFor(cpuTime, kindn, uval)

        // Handle 24-hour format with helper
        if (format == TimeFormat.HHMMSS24hr)
            return fullTime(t)

        // Format minutes for all remaining formats
        let minute = leftZeroPadTo(t.minute, 2)

        // Simpler military format
        if (format == TimeFormat.HHMM24hr)
            return leftZeroPadTo(t.hour, 2) + ":" + minute

        // Data for all other formats
        // Compute strings for other formats
        let hour = null
        let ap = t.hour < 12 ? "am" : "pm"
        if (t.hour == 0) {
            hour = "12:"  // am
        } else if (t.hour > 12) {
            hour = (t.hour - 12) + ":"
        } else {
            hour = (t.hour) + ":"
        }

        // Compose them appropriately
        switch (format) {
            case TimeFormat.HMMSSAMPM:
                return hour + minute + "." + leftZeroPadTo(t.second, 2) + ap

            case TimeFormat.HMMAMPM:
                return hour + minute + ap

            case TimeFormat.HMM:
                return hour + minute
        }
        return ""
    }

    /**
     * Current date month name as a string in the format name
     * @param format the format to use
     */
    //% blockid=datetime_datemonth2format 
    //% block="month name as $format|| from datetime kind $kindn"
    //% kindn.shadow=datetime_kind
    //% weight=20
    export function nameMonth(format: MonthNameFormat, kindn: number = null, uval: boolean = false): string {
        const cpuTime = cpuTimeInSeconds()
        const t = timeFor(cpuTime, kindn, uval)
        const dtIdx = monthName[0].indexOf(t.month.toString())
        const dtName = monthName[1][dtIdx]
        switch (format) {
            case MonthNameFormat.Fname:
                return dtName
                break
            case MonthNameFormat.Sname:
                return dtName.substr(0, 3)
                break
        }
        return ""
    }

    /**
     * Current date week name as a string in the format name
     * @param format the format to use
     */
    //% blockid=datetime_dateweek2format
    //% block="week name as $format|| from datetime kind $kindn"
    //% kindn.shadow=datetime_kind
    //% weight=20
    export function nameWeek(format: WeekNameFormat, kindn: number = null, uval: boolean = false): string {
        const cpuTime = cpuTimeInSeconds()
        const t = timeFor(cpuTime, kindn, uval)
        const w = dateToDayOfWeek(datevalue(t.month, t.day, t.year))
        const dtIdx = weekName[0].indexOf(w.toString())
        const dtName = weekName[1][dtIdx]
        switch (format) {
            case WeekNameFormat.Fname:
                return dtName
                break
            case WeekNameFormat.S3name:
                return dtName.substr(0, 3)
                break
            case WeekNameFormat.S2name:
                return dtName.substr(0, 2)
                break
        }
        return ""
    }

    /**
     * Current date as a string in the format
     * @param format the format to use
     */
    //% blockid=datetime_date2format
    //% block="date as $format for year in $y|| from datetime kind $kindn"
    //% kindn.shadow=datetime_kind
    //% weight=60
    export function date(format: DateFormat, y: YearFormat = 0, kindn: number = null, uval: boolean = false): string {
        const cpuTime = cpuTimeInSeconds()
        const t = timeFor(cpuTime, kindn, uval)
        const w = dateToDayOfWeek(datevalue(t.month, t.day, t.year))
        const dtIdx = [monthName[0].indexOf(t.month.toString()), weekName[0].indexOf(w.toString())]
        const dtName = [monthName[1][dtIdx[0]], weekName[1][dtIdx[1]]]
        switch (format) {
            case DateFormat.DWnsMns:
                return t.day + "/" + dtName[1].substr(0, 3).toUpperCase() + "/" + dtName[0].substr(0, 3).toUpperCase()
                break
            case DateFormat.DWnMn:
                return t.day + "/" + dtName[1] + "/" + dtName[0]
                break
            case DateFormat.MD:
                return t.month + "/" + t.day
                break
            case DateFormat.MDY:
                t.year += y
                return t.month + "/" + t.day + "/" + t.year
                break
            case DateFormat.YYYY_MM_DD:
                return fullYear(t, y)
                break

        }
        return ""
    }

    /**
     * Current date and time in a timestamp format (YYYY-MM-DD HH:MM.SS).  
     */
    //% blockid=datetime_dateandtime 
    //% block="date and time stamp for year in $y|| from datetime kind $kindn"
    //% kindn.shadow=datetime_kind
    //% weight=50
    export function dateTime(y: YearFormat = 0, kindn: number = null, uval: boolean = false): string {
        const cpuTime = cpuTimeInSeconds()
        const t = timeFor(cpuTime, kindn, uval)
        return fullYear(t, y) + " " + fullTime(t)
    }

    /**
     * Seconds since start of arcade 
     */
    //% blockid=datetime_secsincestart
    //% block="seconds since arcade start" advanced=true
    //% weight=40
    export function secondsSinceReset(): number {
        return cpuTimeInSeconds()
    }


    /**
     * Called when minutes change
     */
    //% blockid=datetime_minuteupdate
    //% block="minute changed" advanced=true
    //% weight=85
    export function onMinuteChanged(handler: () => void) {
        control.onEvent(TIME_AND_DATE_EVENT, TIME_AND_DATE_NEWMINUTE, handler)
    }

    /**
     * Called when hours change
     */
    //% blockid=datetime_hourupdate
    //% block="hour changed" advanced=true
    //% weight=80
    export function onHourChanged(handler: () => void) {
        control.onEvent(TIME_AND_DATE_EVENT, TIME_AND_DATE_NEWHOUR, handler)
    }

    /**
     * Called when days change
     */
    //% blockid=datetime_dayupdate
    //% block="day changed" advanced=true
    //% weight=75
    export function onDayChanged(handler: () => void) {
        control.onEvent(TIME_AND_DATE_EVENT, TIME_AND_DATE_NEWDAY, handler)
    }

    // ***************** This was just for debugging / evaluate problems in API
    // Helpful for debugging / testing
    // /**
    //  * Seconds since start of year  
    //  */
    // //% block="seconds since year" advanced=true
    // export function secondsSinceYear(): number {
    //     const cpuTime = cpuTimeInSeconds()
    //     const t = timeFor(cpuTime)
    //     const deltaTime = cpuTime - cpuTimeAtSetpoint
    //     let sSinceStartOfYear = timeToSetpoint + deltaTime
    //     return sSinceStartOfYear
    // }

    // ********************************************************
}
