-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_training_log" (
    "_id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "exercise_id" INTEGER NOT NULL,
    "date" TEXT NOT NULL,
    "metric_weight" INTEGER NOT NULL,
    "reps" INTEGER NOT NULL,
    "unit" INTEGER NOT NULL DEFAULT 0,
    "routine_section_exercise_set_id" INTEGER NOT NULL DEFAULT 0,
    "timer_auto_start" INTEGER NOT NULL DEFAULT 0,
    "is_personal_record" INTEGER NOT NULL DEFAULT 0,
    "is_personal_record_first" INTEGER NOT NULL DEFAULT 0,
    "is_complete" INTEGER NOT NULL DEFAULT 0,
    "is_pending_update" INTEGER NOT NULL DEFAULT 0,
    "distance" INTEGER NOT NULL DEFAULT 0,
    "duration_seconds" INTEGER NOT NULL DEFAULT 0
);
INSERT INTO "new_training_log" ("_id", "date", "distance", "duration_seconds", "exercise_id", "is_complete", "is_pending_update", "is_personal_record", "is_personal_record_first", "metric_weight", "reps", "routine_section_exercise_set_id", "timer_auto_start", "unit") SELECT "_id", "date", "distance", "duration_seconds", "exercise_id", "is_complete", "is_pending_update", "is_personal_record", "is_personal_record_first", "metric_weight", "reps", "routine_section_exercise_set_id", "timer_auto_start", "unit" FROM "training_log";
DROP TABLE "training_log";
ALTER TABLE "new_training_log" RENAME TO "training_log";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
