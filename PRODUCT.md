# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Students tracking course marks and semester GPA.

## Product Purpose

Project UNO's Academic Marks Calculator lets students organize semester courses, enter assessment marks, calculate course grades, and calculate semester GPA.

## Positioning

The app combines a syllabus-based course catalog, course-specific assessment calculations, grade results, and semester GPA tracking in one workflow. No stronger market-positioning claim is established by the repository.

## Operating Context

Students choose a semester, select a course, enter continuous-assessment and end-semester marks, review calculated grades, and calculate GPA when the semester's required courses are ready. Students can use a guest session or sign in to persist account data with Firebase.

## Capabilities and Constraints

- The course catalog and credit values are defined in `src/gpaCourses.ts`; course presets and semester elective slots are defined in `src/components/SubjectSelectionDialog.tsx`.
- Grade bands, assessment weights, and mark calculations are defined in `src/calculatorUtils.ts`. The data structures for subjects, assessment components, and calculation results are in `src/types.ts`.
- The main workspace, course navigation, calculator, grading-system view, GPA view, account flow, guest session, profile setup, and theme toggle are orchestrated in `src/App.tsx`. `src/components/AcademicSetupModal.tsx` collects the student profile and semester; `src/components/CourseBottomSheet.tsx` provides course selection; `src/components/GPACalculator.tsx` contains GPA readiness and calculation controls.
- `src/firebaseData.ts` reads and writes account-scoped Firestore data for signed-in users. The guest workspace is stored in browser `localStorage` and is separate from Firebase account data.
- Preserve all existing calculation, course selection, semester, guest, authentication, persistence, and migration behavior during visual work.
- Firebase web configuration is provided locally through `src/.env.local`, which is not committed.
- Avoid unnecessary interactions or visual decoration that slows mark entry, obscures semester progress or calculated results, reduces accessibility or mobile performance, or misrepresents guest data's device-local storage versus account data saved to Firebase.

## Brand Commitments

The README names the product **Project UNO** and describes the app as an academic marks and GPA calculator. The current login and profile setup screens use **CALCREDIT**; when brand copy is in scope, follow the README's product name rather than extending this conflicting label. Preserve the existing academic terminology and course names.

## Evidence on Hand

- `README.md` documents Firebase setup, legacy-data import choices, and account-isolation checks.
- `src/gpaCourses.ts`, `src/components/SubjectSelectionDialog.tsx`, `src/calculatorUtils.ts`, and `src/types.ts` contain the real course, assessment, grade, and GPA data.
- `src/App.tsx` and `src/components/` contain the running user interface and workflows; guest-workspace local storage is implemented in `src/firebaseData.ts`.
- No testimonials, adoption metrics, or independent academic-outcome claims are established in the repository; do not invent them.

## Product Principles

- Use the syllabus course names, credits, assessment rules, and grade terminology represented in the code.
- Keep mark entry, calculated grade review, and semester GPA tracking connected as one student workflow.
- Clearly distinguish guest data saved on this device from signed-in account data saved to Firebase.
- Keep signed-in records scoped to the authenticated user's account.
- Balance mark-entry clarity, semester progress, and result readability over decoration.

## Accessibility & Inclusion

Maintain readable text, accessible interactions, and mobile performance. Preserve clear distinctions between guest data and authenticated, saved account data.
