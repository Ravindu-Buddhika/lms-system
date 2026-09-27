# AGENTS.md

## Project Overview
A Learning Management System (LMS) built with **React** (frontend), **Node.js/Express** (backend), and **MySQL** (database). The system supports four roles — Super Admin, Admin, Teacher, and Student — with strict permission boundaries between them.

## Tech Stack
- Frontend: React
- Backend: Node.js + Express
- Database: MySQL (ORM: to be decided — e.g. Sequelize or Prisma)
- Auth: Google OAuth + manual email/password registration, JWT/session-based backend auth

## Commands
> Fill these in once the project is scaffolded.
- Install: `npm install` (run in both `/client` and `/server`)
- Run dev (backend): `npm run dev`
- Run dev (frontend): `npm run dev`
- Run tests: `npm test`
- Run migrations: `npm run migrate`

## Roles & Permissions

### Super Admin (singular, system-owned)
- Full access to everything in the system.
- Can create and delete Admin accounts.
- Cannot be edited, disabled, or deleted by anyone — including other Super Admins created later.
- Auto-created on first system startup if none exists:
  - Username: `Superadmin`
  - Password: `superadmin@1234`
  - This account **must** be forced to change its password on first login. The default password must never appear anywhere except the one-time seed script.

### Admin (multiple)
- Manages overall system content.
- Can block/unblock any content.
- Can manage Teachers and Students (create, edit, disable).
- **Cannot** create, edit, disable, or delete *any* Admin account — not even another Admin's, and not their own. Admin-to-Admin management does not exist. Only the Super Admin can create, edit, or delete Admin accounts. This must be enforced on the backend, not just hidden in the UI.

### Teacher
- Must apply for the role through a Teacher Application flow (see below); not self-assigned at registration.
- Can upload and manage their own courses only.
- Can view how many students are actively enrolled in each of their own courses.

### Student (default role)
- Default role for anyone who self-registers or signs in via Google with no prior account.
- Can browse and activate/enroll in courses.
- Dashboard shows all enrolled courses.
- Progress/status is tracked independently per course.

### Guest (unauthenticated)
- Can sign in via Google OAuth → creates a Student account on first login.
- Can register manually → creates a Student account.
- Can apply to become a Teacher after registering (reviewed by an Admin or Super Admin before the role is granted).

## Authentication & Validation Rules (non-negotiable)
1. Every protected route must check authentication and role authorization **on the backend**, regardless of what the frontend already checked. Frontend checks are for UX only, never for security.
2. All incoming request data must be validated for shape and type on the backend (e.g. with Joi/Zod/express-validator) before it touches business logic or the database.
3. Malformed or unexpected data types must be rejected outright — never silently coerced and passed through.
4. Passwords must always be hashed (bcrypt or equivalent). Never store, return, or log plaintext passwords.
5. Never trust a role or user ID sent from the frontend — always derive it from the verified session/token on the backend.

## Development Workflow Rules
1. **Plan before building.** Before writing code for any new feature or task, state a short plan of what will be built and wait for explicit approval before proceeding.
2. **Surface problems immediately.** If a blocker, ambiguity, or design problem is found mid-task, stop and report it — do not silently work around it or guess.
3. **Test after building.** Every new feature must have a test (or at least a manual verification step) written and run before it's considered done.
4. **No commit without status + permission.** Before every git commit, give a short status update on what changed and explicitly ask for permission before committing and moving to the next task.
5. **Commit per unit of work.** One feature or fix per commit — not large batched commits.
6. **`.gitignore` is a hard blocker.** A `.gitignore` file must exist and be committed before any other code is pushed. If it's missing, stop all other work until it's created and pushed. It must exclude things that don't belong in version control: `node_modules/`, `.env`/`.env.*`, build output (`dist/`, `build/`), log files, and editor/IDE folders (`.idea/`, `.vscode/`, `.DS_Store`). Nothing in these categories should ever be pushed.
7. Never commit secrets, `.env` files, or credentials of any kind.

## Do
- Validate all input on both frontend and backend.
- Track enrollment/progress status per student, per course, independently.
- Enforce every permission boundary (see Roles) in backend logic, not just the UI.
- Write a test for each new feature before marking it done.

## Don't
- Don't let Admins create, edit, or delete any Admin account — including their own or another Admin's. Only Super Admin manages Admins.
- Don't trust any data arriving from the frontend without backend-side validation.
- Don't skip tests for a "quick" feature.
- Don't push code before `.gitignore` exists.
- Don't commit without first giving a status update and getting approval.
