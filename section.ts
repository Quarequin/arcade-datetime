
namespace dt {
    // ********* Enumerations for parameter types ************************

    export const monthName: string[][] = [
        ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"],
        ["January", "Febuary", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
    ]

    export const weekName: string[][] = [
        ["0", "1", "2", "3", "4", "5", "6"],
        ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]
    ]

    export enum YearFormat {
        //% block="national year"
        NY = 0,
        //% block="buddhist year"
        BHY = 543,
    }

    export enum DropDatetime {
        Month = 0,
        Day = 1,
        Year = 2,
        Hour = 3,
        Minute = 4,
        Second = 5
    }

    export enum OffsetWeek {
        //% block="sunday"
        SUN = 6,
        //% block="saturday"
        SAT = 5,
        //% block="monday"
        MON = 0
    }

    export enum MornNight {
        //% block="am"
        AM,
        //% block="pm"
        PM
    }

    export enum TimeUnit {
        //% block="ms"
        Milliseconds,
        //% block="seconds"
        Seconds,
        //% block="minutes"
        Minutes,
        //% block="hours"
        Hours,
        //% block="days"
        Days
    }

    export enum TimeFormat {
        //% block="h:mm.ss am / pm"
        HMMSSAMPM,
        //% block="hh:mm 24-hr"
        HHMM24hr,
        //% block="hh:mm.ss 24-hr"
        HHMMSS24hr,
        //% block="h:mm"
        HMM,
        //% block="h:mm am / pm"
        HMMAMPM,
    }

    export enum DateFormat {
        //% block=day/subweekname/submonthname"
        DWnsMns,
        //% block="day/weekname/monthname"
        DWnMn,
        //% block="month/day"
        MD,
        //% block="month/day/year"
        MDY,
        //% block="year-month-day"
        YYYY_MM_DD
    }

    export enum MonthNameFormat {
        //% block="Fullname"
        Fname,
        //% block="Subname"
        Sname,
    }

    export enum WeekNameFormat {
        //% block="Fullname"
        Fname,
        //% block="3Subname"
        S3name,
        //% block="2Subname"
        S2name,
    }

    export type Month = uint8   // 1-12 Month of year
    export type Day = uint8     // 1-31 / Day of month
    export type Year = uint16 // Assumed to be 0000-0099 or 2020-2099  
    export type Hour = uint8  // 0-23 / 24-hour format  
    export type Minute = uint8 // 0-59 
    export type Second = uint8 // 0-59
    export type DayOfYear = uint16 // 1-366

    export type SecondsCount = uint32 // Seconds since start of start year
    export type Weekday = uint8 // Weekday code. 0=Sunday, 1=Monday, etc.

    export interface DateTime {
        month: Month   // 1-12 Month of year
        day: Day   // 1-31 / Day of month
        year: Year  // Assumed to be 2020 or later
        hour: Hour   // 0-23 / 24-hour format  
        minute: Minute   // 0-59 
        second: Second   // 0-59
        dayOfYear: DayOfYear  // 1-366
    }

    export interface Date {
        month: Month   // 1-12 Month of year
        day: Day   // 1-31 / Day of month
        year: Year  // Assumed to be 2020 or later
        dayOfYear: DayOfYear  // 1-366
    }

    export interface MonthDay {
        month: Month   // 1-12 Month of year
        day: Day   // 1-31 / Day of month
    }

    // ********* State Variables ************************

    export const TIME_AND_DATE_EVENT = 94
    export const TIME_AND_DATE_NEWMINUTE = 1
    export const TIME_AND_DATE_NEWHOUR = 2
    export const TIME_AND_DATE_NEWDAY = 3

    // State variables to manage time 
    export let startYear: Year = 0
    export let timeToSetpoint: SecondsCount = 0
    export let cpuTimeAtSetpoint: SecondsCount = 0
    export let curKind = dtdb.mainDateTime

    // State for event handlers 
    export let lastUpdateMinute: Minute = 100   // Set to invalid values for first update
    export let lastUpdateHour: Hour = 100
    export let lastUpdateDay: Day = 100


    // Cummulative Days of Year (cdoy): Table of month (1-based indices) to cummulative completed days prior to month
    // Ex: By Feb 1st (2nd month / index 2), 31 days of Jan are completed. 
    export const cdoy: DayOfYear[] = [0, 0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334, 365]
}
