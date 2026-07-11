# Changelog

## [ABH-17] Habit Tracker — 2026-07-11

### Added
- Full-stack Habit Tracker monorepo (Next.js frontend + Express backend)
- User auth (register, login, logout, JWT sessions)
- CRUD for habits (title, description, frequency, color)
- Daily check-ins with POST /api/habits/:id/checkins
- Calendar view for habit history
- Responsive dashboard and navigation
- Railway deployment config (railway.toml for both services)
- PostgreSQL schema (users, habits, checkins)

Co-Authored-By: Paperclip <noreply@paperclip.ing>
