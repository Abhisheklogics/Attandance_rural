
import { getUnsyncedAttendance, markAttendanceSynced } from './indexedDB.js';

export async function syncAttendanceWhenOnline() {
  if (!navigator.onLine) return;

  const unsynced = await getUnsyncedAttendance();

  for (const record of unsynced) {
    try {
      await fetch('/api/mark', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(record),
      });
      await markAttendanceSynced(record.id);
      console.log('✅ Attendance synced:', record);
    } catch (err) {
      console.error('❌ Sync failed for record', record, err);
    }
  }
}
