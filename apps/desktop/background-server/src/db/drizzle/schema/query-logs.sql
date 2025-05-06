-- SQLite

SELECT * FROM logs;


SELECT
  lower(
    substr(hex(id), 1, 8) || '-' ||
    substr(hex(id), 9, 4) || '-' ||
    substr(hex(id), 13, 4) || '-' ||
    substr(hex(id), 17, 4) || '-' ||
    substr(hex(id), 21)
  ) AS id,
  name,
  CASE level
    WHEN 1 THEN 'DEBUG'
    WHEN 2 THEN 'INFO'
    WHEN 3 THEN 'WARNING'
    WHEN 4 THEN 'ERROR'
    WHEN 5 THEN 'FATAL'
    ELSE 'UNKNOWN'
  END AS level,
  message,
  datetime(logged_at / 1000, 'unixepoch') AS logged_at
FROM logs;


SELECT
  lower(
    substr(hex(id), 1, 8) || '-' ||
    substr(hex(id), 9, 4) || '-' ||
    substr(hex(id), 13, 4) || '-' ||
    substr(hex(id), 17, 4) || '-' ||
    substr(hex(id), 21)
  ) AS id,
  name,
  CASE level
    WHEN 1 THEN 'INFO'
    WHEN 2 THEN 'WARNING'
    WHEN 3 THEN 'ERROR'
    WHEN 4 THEN 'DEBUG'
    ELSE 'UNKNOWN'
  END AS level,
  message,
  -- https://til.simonwillison.net/sqlite/unix-timestamp-milliseconds-sqlite?utm_source=chatgpt.com
  strftime('%Y-%m-%d %H:%M:%f',
           julianday(logged_at / 86400000.0 + 2440587.5)) AS logged_at
FROM logs;