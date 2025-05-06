CREATE TABLE `logs` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`level` integer NOT NULL,
	`message` text NOT NULL,
	`logged_at` TEXT DEFAULT (datetime('subsec')) NOT NULL
);
--> statement-breakpoint
CREATE VIEW `logs_view` AS 
  SELECT
  id,
  name,
  CASE level
    WHEN 1 THEN 'INFO'
    WHEN 2 THEN 'WARNING'
    WHEN 3 THEN 'ERROR'
    WHEN 4 THEN 'DEBUG'
    ELSE 'UNKNOWN'
  END AS level,
  message,
  logged_at
FROM logs;
;