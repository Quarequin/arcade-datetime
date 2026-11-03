/**
 * Provides a software based running clock for the time and date for the arcade. 
 * The makecode arcade doesn't have a true real-time clock. The arcade uses a timer derived from the
 * 16MHz clock, which is crystal based and should have an accuracy near 10 part per million, 
 * or about 0.864 seconds/day.
 *
 * @cradit Bill Siever
 * 
 * original extension:
 * - phatisena/arcade-datetime-ref
 * - quarequin/arcade-datetime-ref
 */
//% block="Time and Date"
//% color="#AA278D"  icon="\uf017"
namespace dt {
    /*    
    Time is all relative to the "start year" that is set by setDate() (or 0 by default) as follows:

      Start year          Time Date/Time set        CurrentCPUTime
      |                   | (in s)                  | (in s)
      V                   V                         V
      |-------------------+-------------------------|
                          ^
                          |
                          Known dd/mm/yy hh:mm,.s
                          AND cpuTimeAtSetpoint (in s)
       |------------------|-------------------------|
          timeToSetpoint          deltaTime
          (in s)                  ( in s)
    
        setDate sets the startYear and updates timeToSetpoint and cpuTimeAtSetpoint 
        setTime methods update just timeToSetpoint and cpuTimeAtSetpoint
     */

}
