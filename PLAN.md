# PLAN.md

Living task/phase tracker for the LMS project. Update this file as work progresses — check items off, add notes, and keep "Current Phase" accurate. Unlike `AGENTS.md` (stable rules), this file is expected to change constantly.

## Current Phase: Phase 0 — Project Setup (In Progress)

---

## Phase 0 — Project Setup
- [x] Initialize git repo
- [x] Create and commit `.gitignore` **(blocking — complete)**
- [x] Commit `AGENTS.md` and initial `PLAN.md` to the repo root
- [x] Step 2: Server Scaffolding (`/server`) — Express, helmet, morgan, zod validation, health check, 7 passing tests
- [ ] Step 3: Frontend Scaffolding (`/client` with React/Vite) **(NEXT PENDING TASK)**
- [ ] Step 4: Set up MySQL connection + ORM (Prisma with `lms_user` / `lms_db`)

## Phase 1 — Auth & Roles Foundation
- [ ] Design DB schema: `users`, `roles`, `teacher_applications`
- [ ] Implement Super Admin auto-seed on first startup (`Superadmin` / `superadmin@1234`, forced password reset on first login)
- [ ] Manual registration flow (defaults to Student role)
- [ ] Google OAuth integration
- [ ] Backend input validation middleware on all routes
- [ ] JWT/session-based auth + role-based access guards
- [ ] Tests: registration, login, Google auth, role-guard rejection cases

## Phase 2 — Teacher Application Flow
- [ ] "Apply to become a Teacher" form for existing (Student) users
- [ ] Admin/Super Admin review queue: approve/reject applications
- [ ] On approval, upgrade user's role to Teacher
- [ ] Tests: submission, approval, rejection, role upgrade

## Phase 3 — Course Management (Teacher)
- [ ] Course CRUD (create/edit/delete/upload), scoped to the owning teacher only
- [ ] Teacher dashboard: list own courses + active-student count per course
- [ ] Tests: ownership checks — a teacher cannot edit another teacher's course

## Phase 4 — Student Experience
- [ ] Course catalog / browse page
- [ ] Enroll / activate a course
- [ ] Student dashboard: list of enrolled courses
- [ ] Per-course progress/status tracking, isolated per course
- [ ] Tests: enroll flow, dashboard accuracy, status isolation between courses

## Phase 5 — Admin Controls
- [ ] Admin dashboard: manage Teachers and Students (view/edit/disable)
- [ ] Block/unblock content (e.g. courses)
- [ ] Backend-enforced block: Admin cannot act on Admin or Super Admin accounts
- [ ] Tests: permission-boundary tests confirming Admin is rejected from admin-management routes

## Phase 6 — Super Admin Controls
- [ ] Super Admin dashboard: create/delete Admin accounts
- [ ] Full read access across all roles and content
- [ ] Tests: routes exclusive to Super Admin reject all other roles

## Phase 7 — Integration, Polish & Deployment
- [ ] End-to-end walkthroughs for all four roles (Guest, Student, Teacher, Admin, Super Admin)
- [ ] Centralized error handling & logging
- [ ] Deployment plan for client, server, and database

---

## Working Agreement Reminder (see `AGENTS.md` for full rules)
- Plan each task and get approval before coding.
- Test after building — no feature is "done" without a passing test.
- One commit per unit of work; give a status update and get permission before every commit.
- No push without `.gitignore` in place.
