# Loop Duration and Transportation Calculation

## Problem

The loop detail page was displaying hardcoded values for:

- Duration: "~2h"
- Best way: "Walking"

These values were not based on any actual data or calculations.

## Solution

### 1. Created Calculation Utility (`src/lib/utils/loopCalculations.ts`)

The utility function `calculateLoopMetrics()` calculates realistic estimates based on:

**Duration Calculation:**

- Time per place based on category:
  - Museum: 90 minutes
  - Restaurant: 60 minutes
  - Cafe: 30 minutes
  - Park: 45 minutes
  - Shopping: 45 minutes
  - Attraction: 60 minutes
  - Landmark: 20 minutes
  - Gallery: 45 minutes
  - Market: 30 minutes
  - Viewpoint: 15 minutes
  - Default: 30 minutes
- Travel time between places (10 minutes walking per transition)

**Transportation Recommendations:**

- ≤3 places & ≤3h: "Walking"
- ≤6 places & ≤6h: "Walking / Public Transport"
- > 6 places or >6h: "Public Transport / Car"

**Difficulty Assessment:**

- Easy: ≤3 places & ≤2h
- Moderate: ≤6 places & ≤5h
- Challenging: >6 places or >5h

### 2. Updated Loop Detail Page

The page now:

- Imports and uses `calculateLoopMetrics()`
- Displays calculated duration instead of hardcoded "~2h"
- Shows appropriate transport recommendation
- Includes difficulty rating in sidebar stats
- Enhanced styling with better visual hierarchy

### 3. Enhanced Statistics Display

**Main Quick Stats:**

- Places count
- Calculated duration
- Transport recommendation

**Sidebar Stats Grid:**

- Places count with map icon
- Duration with clock icon
- Likes with heart icon
- Difficulty with star icon
- Comments with message icon
- Creation date with calendar icon

## Current Data Sources

- **Places array**: Used for counting and category analysis
- **Place categories**: Drive time estimates per location type
- **Place count**: Determines travel time between locations

## Future Enhancements

### Database Integration

Could add these fields to the `Loop` model:

```sql
estimatedDurationMinutes INTEGER
recommendedTransport TEXT
difficulty TEXT CHECK (difficulty IN ('Easy', 'Moderate', 'Challenging'))
```

### GPS Integration

For precise calculations, could integrate:

- Google Maps Distance Matrix API
- Real walking/driving times between coordinates
- Live traffic data
- Public transport schedules

### Manual Overrides

Allow loop creators to:

- Set custom duration estimates
- Override transport recommendations
- Specify difficulty level
- Add special notes (e.g., "steep hills", "accessible route")

## Example Output

**Before:**

- Duration: "~2h" (hardcoded)
- Best way: "Walking" (hardcoded)

**After (3 cafes + 2 parks):**

- Duration: "2h 40min" (calculated: 3×30min + 2×45min + 4×10min travel)
- Best way: "Walking" (appropriate for 5 places, 2h 40min)
- Difficulty: "Moderate"

The solution provides realistic, data-driven estimates that help users plan their time effectively.
