-- CreateTable
CREATE TABLE "Barbell" (
    "_id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "weight" REAL NOT NULL,
    "unit" INTEGER NOT NULL DEFAULT 0,
    "exercise_id" INTEGER NOT NULL DEFAULT 0
);

-- CreateTable
CREATE TABLE "BodyWeight" (
    "_id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "date" TEXT NOT NULL,
    "body_weight_metric" REAL NOT NULL,
    "body_fat" REAL NOT NULL,
    "comments" TEXT
);

-- CreateTable
CREATE TABLE "Category" (
    "_id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "colour" INTEGER NOT NULL DEFAULT 0,
    "sort_order" INTEGER NOT NULL DEFAULT 0
);

-- CreateTable
CREATE TABLE "Comment" (
    "_id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "date" DATETIME NOT NULL,
    "owner_type_id" INTEGER NOT NULL,
    "owner_id" INTEGER NOT NULL,
    "comment" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "ExerciseGraphFavourite" (
    "_id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "group_id" INTEGER NOT NULL,
    "exercise_id" INTEGER NOT NULL,
    "graph_type_id" INTEGER NOT NULL DEFAULT 0,
    "time_period" INTEGER NOT NULL DEFAULT 0,
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "is_default" INTEGER NOT NULL DEFAULT 0
);

-- CreateTable
CREATE TABLE "Goal" (
    "_id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "type_id" INTEGER NOT NULL,
    "exercise_id" INTEGER NOT NULL,
    "metric_weight" INTEGER NOT NULL,
    "reps" INTEGER NOT NULL,
    "unit" INTEGER NOT NULL,
    "title" TEXT,
    "target_date" TEXT,
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "distance" INTEGER NOT NULL DEFAULT 0,
    "duration_seconds" INTEGER NOT NULL DEFAULT 0,
    "start_date" TEXT
);

-- CreateTable
CREATE TABLE "Measurement" (
    "_id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "unit_id" INTEGER NOT NULL DEFAULT 0,
    "goal_type" INTEGER NOT NULL DEFAULT 0,
    "goal_value" REAL NOT NULL DEFAULT 0,
    "custom" INTEGER NOT NULL DEFAULT 0,
    "enabled" INTEGER NOT NULL DEFAULT 0,
    "sort_order" INTEGER NOT NULL DEFAULT 0
);

-- CreateTable
CREATE TABLE "MeasurementRecord" (
    "_id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "measurement_id" INTEGER NOT NULL,
    "date" TEXT NOT NULL,
    "time" TEXT NOT NULL,
    "value" REAL NOT NULL,
    "comment" TEXT
);

-- CreateTable
CREATE TABLE "MeasurementUnit" (
    "_id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "type" INTEGER NOT NULL DEFAULT 0,
    "long_name" TEXT NOT NULL,
    "short_name" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Plate" (
    "_id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "weight" REAL NOT NULL,
    "unit" INTEGER NOT NULL DEFAULT 0,
    "count" INTEGER NOT NULL DEFAULT 0,
    "enabled" INTEGER NOT NULL DEFAULT 0,
    "colour" INTEGER NOT NULL DEFAULT 0,
    "width_ratio" REAL NOT NULL DEFAULT 1,
    "height_ratio" REAL NOT NULL DEFAULT 1
);

-- CreateTable
CREATE TABLE "RepMaxGridFavourite" (
    "_id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "exercise_ids" TEXT NOT NULL,
    "rep_counts" TEXT NOT NULL,
    "is_default" INTEGER NOT NULL DEFAULT 0,
    "sort_order" INTEGER NOT NULL DEFAULT 0
);

-- CreateTable
CREATE TABLE "Routine" (
    "_id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "notes" TEXT
);

-- CreateTable
CREATE TABLE "RoutineSection" (
    "_id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "routine_id" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "sort_order" INTEGER NOT NULL DEFAULT 0
);

-- CreateTable
CREATE TABLE "RoutineSectionExercise" (
    "_id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "routine_section_id" INTEGER NOT NULL,
    "exercise_id" INTEGER NOT NULL,
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "populate_sets_type" INTEGER NOT NULL DEFAULT 0
);

-- CreateTable
CREATE TABLE "RoutineSectionExerciseSet" (
    "_id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "routine_section_exercise_id" INTEGER NOT NULL,
    "metric_weight" INTEGER NOT NULL,
    "reps" INTEGER NOT NULL,
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "distance" INTEGER NOT NULL DEFAULT 0,
    "duration_seconds" INTEGER NOT NULL DEFAULT 0,
    "unit" INTEGER NOT NULL DEFAULT 0
);

-- CreateTable
CREATE TABLE "WorkoutComment" (
    "_id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "date" TEXT NOT NULL,
    "comment" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "WorkoutGroup" (
    "_id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "date" TEXT NOT NULL,
    "colour" INTEGER NOT NULL,
    "routine_section_id" INTEGER,
    "auto_jump_enabled" INTEGER NOT NULL DEFAULT 1,
    "rest_timer_auto_start_enabled" INTEGER NOT NULL DEFAULT 0
);

-- CreateTable
CREATE TABLE "WorkoutGroupExercise" (
    "_id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "exercise_id" INTEGER NOT NULL,
    "date" TEXT NOT NULL,
    "routine_section_id" INTEGER NOT NULL,
    "workout_group_id" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "WorkoutTime" (
    "_id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "workout_date" TEXT NOT NULL,
    "start_date_time" TEXT NOT NULL,
    "end_date_time" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "android_metadata" (
    "locale" TEXT
);

-- CreateTable
CREATE TABLE "exercise" (
    "_id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "category_id" INTEGER NOT NULL,
    "exercise_type_id" INTEGER NOT NULL DEFAULT 0,
    "notes" TEXT,
    "weight_increment" INTEGER,
    "default_graph_id" INTEGER,
    "default_rest_time" INTEGER,
    "weight_unit_id" INTEGER NOT NULL DEFAULT 0,
    "is_favourite" INTEGER NOT NULL DEFAULT 0
);

-- CreateTable
CREATE TABLE "settings" (
    "_id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "metric" INTEGER NOT NULL DEFAULT 0,
    "first_day_of_week" INTEGER NOT NULL DEFAULT 0,
    "selected_navigation_item_id" INTEGER NOT NULL DEFAULT 0,
    "weight_increment" INTEGER NOT NULL DEFAULT 0,
    "body_weight_increment" INTEGER,
    "body_weight_goal" INTEGER,
    "body_weight_goal_weight" INTEGER,
    "body_weight_show_in_workout_log" INTEGER,
    "estimated_1rm_max_reps_to_include" INTEGER,
    "estimated_1rm_max_apply_to_graph" INTEGER,
    "track_personal_records" INTEGER,
    "mark_sets_complete" INTEGER,
    "auto_select_next_set" INTEGER,
    "keep_screen_on" INTEGER,
    "graph_show_points" INTEGER,
    "graph_show_trend_line" INTEGER,
    "graph_start_at_zero" INTEGER,
    "rest_timer_seconds" INTEGER,
    "rest_timer_vibrate" INTEGER,
    "rest_timer_sound" INTEGER,
    "rest_timer_volume" INTEGER,
    "rest_timer_auto_start" INTEGER,
    "calendar_detail_visible" INTEGER,
    "calendar_category_dots_visible" INTEGER,
    "calendar_navigation_bar_visible" INTEGER,
    "calendar_history_category_dots_visible" INTEGER,
    "calendar_history_category_names_visible" INTEGER,
    "calendar_history_sets_visible" INTEGER,
    "category_sort_order" INTEGER,
    "category_show_colours" INTEGER,
    "measurement_tracker_initial_load" INTEGER,
    "measurement_show_in_workout_log" INTEGER,
    "workout_graph_default_graph_type" INTEGER,
    "workout_graph_default_time_period" INTEGER,
    "analysis_breakdown_breakdown_type" INTEGER,
    "analysis_breakdown_time_period" INTEGER,
    "exercise_list_detail_type_id" INTEGER,
    "workout_timer_auto_start_enabled" INTEGER,
    "workout_timer_auto_stop_enabled" INTEGER,
    "home_screen_limit_type_id" INTEGER,
    "home_screen_limit_value" INTEGER,
    "home_screen_category_visibility_id" INTEGER,
    "home_screen_skip_empty_dates" INTEGER,
    "app_theme_id" INTEGER
);

-- CreateTable
CREATE TABLE "training_log" (
    "_id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "exercise_id" INTEGER NOT NULL,
    "date" DATETIME NOT NULL,
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

