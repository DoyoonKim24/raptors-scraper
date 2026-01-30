// Utility functions for ticket searching and filtering

/**
 * Compare if a row falls within a range
 * Handles both alphabetic (A-Z) and numeric (1-99) row naming
 */
export function compareRows(fromRow: string, row: string, toRow: string): boolean {
  const getRowValue = (row: string) => {
    if (/^[A-Za-z]$/.test(row)) {
      return row.toUpperCase().charCodeAt(0) - 64;
    } else if (/^\d+$/.test(row)) {
      return parseInt(row) + 100;
    } else {
      return 1000 + row.charCodeAt(0);
    }
  };
  
  const from = getRowValue(fromRow);
  const val = getRowValue(row);
  const to = getRowValue(toRow);
  
  return (from <= val && val <= to);
}

/**
 * Format event date for display
 */
export function formatEventDate(dateTime: string): { monthName: string; dayName: string; day: string; time: string } {
  const date = new Date(dateTime);
  const monthName = date.toLocaleString("en-US", { month: "short", timeZone: "America/Toronto" });
  const dayName = date.toLocaleString("en-US", { weekday: "short", timeZone: "America/Toronto" });
  const day = date.toLocaleString("en-US", { day: "numeric", timeZone: "America/Toronto" });
  const time = date.toLocaleString("en-US", { 
    hour: "numeric", 
    minute: "2-digit", 
    hour12: true, 
    timeZone: "America/Toronto" 
  });

  return { monthName, dayName, day, time };
}
