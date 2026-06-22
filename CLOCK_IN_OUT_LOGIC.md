# Clock In/Out Logic Verification

## Database Schema ✅
- **Model**: Staff.clock is an array of daily records
- **Structure**: Each day has:
  - `date`: Date of the record
  - `sessions`: Array of clock in/out sessions
  - `totalHours`: Total hours calculated from all completed sessions

## Button Display Logic ✅

### Clock In Button Display Rules:
```javascript
const canClockIn = !lastSession || lastSession.clockOut;
```
- **Show** (enabled) when:
  - No sessions exist today (first clock in)
  - Last session is already completed (has clockOut)
  
- **Hide** (disabled) when:
  - Last session is active (has clockIn but no clockOut)

### Clock Out Button Display Rules:
```javascript
const canClockOut = lastSession && lastSession.clockIn && !lastSession.clockOut;
```
- **Show** (enabled) when:
  - Last session has clockIn
  - Last session does NOT have clockOut yet
  
- **Hide** (disabled) when:
  - No sessions exist
  - Last session is already completed

## Test Scenarios ✅

### Scenario 1: New Employee (First Day)
```
Database: No todayClock record for today
Frontend: todayClock = null
Display: 
  - Clock In: ENABLED ✅
  - Clock Out: DISABLED (greyed out) ✅
```

### Scenario 2: Employee Clocks In
```
API Call: POST /api/staff/{id}/clock-in
Database Update:
  - Creates: clock[0] with date=today
  - Creates: sessions[0] with {clockIn: "9:00 AM", clockOut: null, duration: "-"}
  - Sets: totalHours = "-"

Frontend: 
  - lastSession.clockOut = null
  - canClockOut = true
  - canClockIn = false
Display:
  - Clock In: DISABLED (greyed out) ✅
  - Clock Out: ENABLED ✅
  - Shows: "Clock In: 9:00 AM"
```

### Scenario 3: Employee Clocks Out
```
API Call: PATCH /api/staff/{id}/clock-out
Database Update:
  - Updates: sessions[0].clockOut = "5:00 PM"
  - Updates: sessions[0].duration = "8h 0m"
  - Updates: totalHours = "8h 0m"

Frontend:
  - lastSession.clockOut = "5:00 PM"
  - canClockOut = false
  - canClockIn = true
Display:
  - Clock In: ENABLED ✅ (for second session)
  - Clock Out: DISABLED (greyed out) ✅
  - Shows: "Clock Out: 5:00 PM"
  - Shows: "Total: 8h 0m"
```

### Scenario 4: Employee Clocks In Again (Lunch Break)
```
API Call: PATCH /api/staff/{id}/clock-in
Database Update:
  - Pushes new session: sessions[1] = {clockIn: "6:00 PM", clockOut: null, duration: "-"}
  - totalHours remains "8h 0m" (not counting incomplete session)

Frontend:
  - lastSession = sessions[1]
  - lastSession.clockOut = null
  - canClockOut = true
  - canClockIn = false
Display:
  - Clock In: DISABLED ✅
  - Clock Out: ENABLED ✅
  - Shows: "Clock In: 6:00 PM"
  - Sessions list shows both sessions
```

### Scenario 5: Complete Second Session
```
API Call: PATCH /api/staff/{id}/clock-out
Database Update:
  - Updates: sessions[1].clockOut = "7:00 PM"
  - Updates: sessions[1].duration = "1h 0m"
  - Updates: totalHours = "9h 0m" (8h + 1h)

Frontend:
  - canClockOut = false
  - canClockIn = true
Display:
  - Clock In: ENABLED ✅ (for third session if needed)
  - Clock Out: DISABLED ✅
  - Shows: "Total: 9h 0m"
```

## Edge Cases Handled ✅

### 1. Multiple Clock In Attempts
```
Status: Already clocked in
Error: "You already clocked in. Please clock out before clocking in again."
```

### 2. Clock Out Without Clock In
```
Status: No today's clock record
Error: "You must clock in first before clocking out."
```

### 3. Clock Out Twice
```
Status: Last session has clockOut
Error: "You already clocked out. Please clock in to start a new session."
```

## Time Calculation ✅

### Helper Functions:
- `timeToMinutes()`: Converts "9:00 AM" → 540 minutes
- `calculateDuration()`: Calculates difference between two times
- `calculateTotalHours()`: Sums all completed sessions

### Example:
```
Session 1: 9:00 AM - 1:00 PM = 4 hours
Session 2: 2:00 PM - 5:30 PM = 3.5 hours
Total: 7h 30m ✅
```

## Frontend State Management ✅

```javascript
attendanceStatus = {
  canClockIn: boolean,      // Controls Clock In button disabled state
  canClockOut: boolean,     // Controls Clock Out button disabled state
  sessions: [],             // Array of all sessions for the day
  totalHours: string        // "8h 0m" or "-"
}
```

## Key Fixes Applied ✅

1. ✅ Fixed null check when todayClock doesn't exist
2. ✅ Fixed totalHours calculation in clockOut (was using old sessions)
3. ✅ Fixed button logic to correctly show/hide based on session state
4. ✅ Fixed display to show session times from new structure
5. ✅ Added session history display to show all clock in/out times

## Testing Checklist
- [ ] Test fresh login (no clock record) - should show Clock In enabled
- [ ] Test after first clock in - should show Clock Out enabled
- [ ] Test after first clock out - should show Clock In enabled again
- [ ] Test second clock in/out cycle - verify totalHours calculation
- [ ] Test API error messages - verify they prevent invalid transitions
- [ ] Test page refresh - verify state persists from localStorage
