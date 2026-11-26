# References

Links and files consulted. One line each: what it is and what it was used for.

## Client

-

## Comparable products

-

## Earlier mockups reused

- `potential-template/templates/learning-module` (admin and learner components): adapted for the LMS module (catalogue, builder, quiz runner), server calls replaced by the starter store.
- `wep-mockup/src/features/learning` (CourseViewPage, CourseMenu, CoursePanels, QuizRunner): approved course view layout (top card + side menu).
- `sedra-mockup/src/features/unit` and `src/features/admin/CourseBuilderPage.tsx`: learning block steps and builder publish toggles.

## LMS screens and layout references

Reference images live in `potential-template` branch `mockup-references`, folder `mockup-references/platform/learning/` (export with `~/.claude/skills/mockup/scripts/export-references.sh <dir> platform/learning`). Branding never comes from them.

| Screen                               | Route                                      | Reference image(s)                                                                                                                                                        |
| ------------------------------------ | ------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Course catalogue                     | `/learner/courses`                         | `template-learning-module-learner-course-catalogue.png`, `live-learning-module-learner-course-catalogue.png`                                                              |
| Course catalogue, mobile             | `/learner/courses` at 390                  | `template-learning-module-learner-course-catalogue-mobile.png`, `live-learning-module-learner-course-catalogue-mobile.png`                                                |
| Course view (top card + menu + unit) | `/learner/courses/$courseId`               | `live-learning-module-course-detail.png` (layout), `template-learning-module-course-detail.png` (content)                                                                 |
| Unit block player                    | `/learner/courses/$courseId?unit=<lesson>` | `live-learning-module-unit-block-player.png`, `template-learning-module-unit-block-player.png`                                                                            |
| Quiz                                 | `/learner/courses/$courseId?unit=<quiz>`   | `live-learning-module-assessment-quiz.png`, `template-learning-module-assessment-quiz.png`                                                                                |
| Admin course list                    | `/admin/courses`                           | `template-learning-module-admin-course-list.png`, `live-learning-module-admin-course-list.png` (stat cards)                                                               |
| Course builder                       | `/admin/courses/$courseId`                 | `template-learning-module-admin-course-builder-modules.png`, `template-learning-module-admin-course-builder.png`, `live-learning-module-admin-course-builder-modules.png` |
