
namespace dt {

    // ********* Exposed blocks ************************

    /**
     * Set the time using 24-hour format. 
     * @param time from hour the hour (0-23), minute the minute (0-59), @param second the second (0-59)
     */
    //% blockid=datetime_set24hrtime
    //% block="set time from 24-hour time $times|| to datetime kind $kindn"
    //% times.shadow=datetime_timeshadow
    //% kindn.shadow=datetime_kind
    //% weight=90
    export function set24HourTime(times: times, kindn: number = null, uval: boolean = false) {
        let hour = times.hour, minute = times.minute, second = times.second
        hour = hour % 24
        minute = minute % 60
        second = second % 60
        const cpuTime = cpuTimeInSeconds()
        const t = timeFor(cpuTime, kindn, uval)
        cpuTimeAtSetpoint = cpuTime
        timeToSetpoint = secondsSoFarForYear(t.month, t.day, t.year, hour, minute, second)
    }

    /**
     * Set the date
     * @param date from month the month 1-12, day the day of the month 1-31, @param the year 2020-2050
     */
    //% blockid=datetime_setdate
    //% block="set date to $dates|| to datetime kind $kindn"
    //% kindn.shadow=datetime_kind
    //% dates.shadow=datetime_dateshadow
    //% weight=80
    export function setDate(dates: dates, kindn: number = null, uval: boolean = false) {
        let year = dates.year, month = dates.month, day = dates.day
        month = month % 13
        day = day % 32
        const cpuTime = cpuTimeInSeconds()
        const t = timeFor(cpuTime, kindn, uval)
        startYear = year
        cpuTimeAtSetpoint = cpuTime
        timeToSetpoint = secondsSoFarForYear(month, day, startYear, t.hour, t.minute, t.second)
    }

    /**
     * Set the time using am/pm format
     * @param time from hour the hour (1-12), minute the minute (0-59), second the second (0-59)
     * @param ampm morning or night
     */
    //% block=datetime_settime
    //% block="set time to $times $ampm|| to datetime kind $kindn"
    //% kindn.shadow=datetime_kind
    //% times.shadow=datetime_halftimeshadow
    //% inlineInputMode=inline
    //% weight=100
    export function set12HourTime(times: times, ampm: MornNight, kindn: number = null, uval: boolean = false) {
        let hour = times.hour, minute = times.minute, second = times.second
        hour = (hour - 1 % 12) + 1
        // Adjust to 24-hour time format
        if (ampm == MornNight.AM && hour == 12) {  // 12am -> 0 hundred hours
            hour = 0;
        } else if (ampm == MornNight.PM && hour != 12) {   // PMs other than 12 get shifted after 12:00 hours
            hour = hour + 12;
        }
        set24HourTime(time24value(hour, minute, second), kindn, uval);
    }

    /**
     * Advance the time by the given amount, which cause "carries" into other aspects of time/date.  Negative values will cause time to go back by the amount.
     * @param amount the amount of time to add (or subtract if negative).  To avoid "carries" use withTime blocks
     * @param unit the unit of time
     */
    //% blockid=datetime_advancesetdatetime
    //% block="advance time/date by $amount $unit" advanced=true
    //% weight=50
    export function advanceBy(amount: number, unit: TimeUnit) {
        const units = [0, 1, 60 * 1, 60 * 60 * 1, 24 * 60 * 60 * 1]
        // Don't let time go negative:
        if (amount < 0 && (-amount * units[unit]) > timeToSetpoint)
            timeToSetpoint = 0
        else
            timeToSetpoint += amount * units[unit]
    }

    /**
     * get day since from date
     * @param date of month day year
     */
    //% blockid=datetime_datetodaysince
    //% block="day since as $dates"
    //% dates.shadow=datetime_dateshadow
    //% weight=20
    export function dateToDaySince(dates: dates): SecondsCount {
        let uyear = dates.year, umonth = dates.month, uday = dates.day
        umonth = Math.constrain(umonth, 1, 12)
        let daySince = 0
        for (let yidx = 1; yidx < uyear; yidx++) daySince += (isLeapYear(yidx)) ? 366 : 365;
        daySince += dateToDayOfYear(datevalue(umonth, uday, uyear))
        return daySince
    }

    /**
     * get time since from date and time
     * @param date of month day year
     * @param time of hour minute second
     */
    //% blockid=datetime_datetodaysince
    //% block="time since as $dates and $times"
    //% dates.shadow=datetime_dateshadow
    //% times.shadow=datetime_timeshadow
    //% weight=20
    export function dateAndTimeToTimeSince(dates: dates, times: times): SecondsCount {
        let uyear = dates.year, umonth = dates.month, uday = dates.day
        let uhour = times.hour, uminute = times.minute, usecond = times.second
        umonth = Math.constrain(umonth, 1, 12)
        let timeSince = 0
        for (let yidx = 1; yidx < uyear; yidx++) timeSince += ((isLeapYear(yidx)) ? 366 : 365) * (24 * 60 * 60);
        timeSince += dateToDayOfYear(datevalue(umonth, uday, uyear)) * (24 * 60 * 60)
        timeSince += (uhour % 24) * (60 * 60), timeSince += (uminute % 60) * (60), timeSince += (usecond % 60)
        return timeSince
    }

    /**
     * Get the Day of the week  
     * @param 0=>Monday, 1=>Tuesday, etc.
     */
    //% blockid=datetime_date2dayweek
    //% block="day of week for $dates" advanced=true
    //% dates.shadow=datetime_dateshadow
    //% weight=40
    export function dateToDayOfWeek(dates: dates): Weekday {
        let month = dates.month, day = dates.day, year = dates.year
        let doy = dateToDayOfYear(datevalue(month, day, year))
        // Gauss's Algorithm for Jan 1: https://en.wikipedia.org/wiki/Determination_of_the_day_of_the_week
        // R(1+5R(A-1,4)+4R(A-1,100)+6R(A-1,400),7)    
        let jan1 = ((1 + 5 * ((year - 1) % 4) + 4 * ((year - 1) % 100) + 6 * ((year - 1) % 400)) % 7)
        jan1 += 6  // Shift range:  Gauss used 0=Sunday, we'll use 0=Monday
        return ((doy - 1) + jan1) % 7
    }

    /**
     * Get the Day of the year  
     * @param Jan 1 = 1, Jan 2=2, Dec 31 is 365 or 366
     */
    //% blockid=datetime_date2dayyear
    //% block="day of year for $dates" advanced=true
    //% dates.shadow=datetime_dateshadow
    //% weight=30
    export function dateToDayOfYear(dates: dates): DayOfYear {
        let year = dates.year, month = dates.month, day = dates.day
        month = Math.constrain(month, 1, 12)
        // Assumes a valid date
        let dayOfYear = cdoy[month] + day
        // Handle after Feb in leap years:
        if (month > 2 && isLeapYear(year)) {
            dayOfYear += 1
        }
        return dayOfYear
    }

    /**
     * calculate my age from my birthdate in current date
     * @param idate the birthdate value
     * @param odate the currentdate value
     */
    //% blockId=datetime_mydatetoage
    //% block="get age from birthdate by $idate in current date by $odate"
    //% idate.shadow=datetime_dateshadow
    //% odate.shadow=datetime_dateshadow
    //% kindn.shadow=datetime_kind
    //% weight=14
    export function myDateToAge(idate: dates, odate: dates) {
        let dateii = new dates(idate.month, idate.day, idate.year), DsinceMin = dateToDaySince(datevalue(dateii.month, dateii.day, dateii.year)), DateMin = dateSinceFor(DsinceMin), LeapMin = isLeapYear(DateMin.year)
        let dateoo = new dates(odate.month, odate.day, odate.year), DsinceMax = dateToDaySince(datevalue(dateoo.month, dateoo.day, dateoo.year)), DateMax = dateSinceFor(DsinceMax), LeapMax = isLeapYear(DateMax.year)
        let curY = DateMin.year, curDsince = dateToDaySince(datevalue(dateoo.month, dateoo.day, dateii.year))
        let curDate = dateSinceFor(curDsince), curLeap = isLeapYear(curDate.year)
        let uDayYear = 0, ageCount = 0
        while (curY <= DateMax.year) {
            if (curDate.year >= DateMax.year) {
                uDayYear = dateToDayOfYear(datevalue(curDate.month, curDate.day, curDate.year))
                if (LeapMin) {
                    if (curDate.month > 2 && !curLeap) uDayYear++
                    if (uDayYear > DateMin.dayOfYear) ageCount++
                } else {
                    if (curDate.month > 2 && curLeap) uDayYear--
                    if (uDayYear > DateMin.dayOfYear) ageCount++
                }
            } else if (curDate.year < DateMax.year) {
                ageCount++
            }
            curY++, curLeap = isLeapYear(curY)
            curDsince += (curLeap) ? 366 : 365, curDate = dateSinceFor(curDsince, DsinceMin, DateMin.year)
        }
        ageCount = Math.max(ageCount - 2, 0)
        return ageCount
    }

 }
