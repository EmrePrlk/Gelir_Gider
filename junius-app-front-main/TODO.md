- [x] User list store; Optimize usage
- [x] User list page, handle `loading, `error`, `empty` states.
- [x] Detect unused layout components, and remove them. `/src/layouts`
- [x] Apply react-query to the `/src/app/auth` pages.
- [x] Add user list table header backend connections

- [x] Backend pagination updated, refactor the frontend pagination.
- [x] Document user list page, via MDX
- [x] Backend connection, check.
- [x] Update the auth-store
- [x] Update file based requests

- [x] Implement CASL for authorization.
- [x] Check backend availablity for the `ideator` landing form upload types.
- [ ] Humanize the backend errors, make it more readable. `instance.ts#responseErrorHandler`
- [ ] Implement email verification for the users.
- [x] Clear branches
- [x] Create error guards: 404, 403

- [x] Wrap the ~~`project/:id`~~, and the ~~`idea/:id`~~ with `withErrorHandling`

- [ ] Update landing forms after the Career page => convert to multi-step form

- [x] Project Detail Page: The backend data structure is not aligned with the frontend, update frontend after the backend update.

## Pages

- [x] Project List
- [x] Project Details
- [x] Add Idea
- [x] Edit Idea
- [ ] Project Team Management => Then update the `project-detail` page
- [x] Permissions Management
- [ ] Dashboard
- [x] Edit project

## Noted TODO's

- [x] Use contact card for the ~~`idea-detail-view`~~ and ~~`project-detail-view`~~ from ~~`account-details-view`~~
- [x] Update `project` services after update `project-detail-view` in the ~~`account-details-view`~~
- [x] Definition store, backend connection
- [ ] Clear db
- [x] Redirects to `dashboard` after register, which is unwanted behavior.
- [x] Update loading wrapper with loading-screen component
- [x] Update `auth-guard` to use loading component
- [x] Add dashboard to the config layout
- [x] Hamburger menu icon not visible

## Next features

- [x] Add MD Editor for the big contents such as `project-detail` and `idea-detail`
- [ ] Add note management to the `project-detail` and `idea-detail`
- [ ] For the note management, its only implemented for the `account-detail`, but currently, we can't update or delete the notes.
- [ ] Linkedin Integration for the landing page
- [ ] Juniflow Integration

## Things to consider

- [ ] The one unique Metadata title across the app, such as `New Idea | Junius App`, `Edit Idea | Junius App`
- [ ] Each mutation button should have a loading state, or disable state.
- [ ] Each query page/element should have a loading/error/empty state.
