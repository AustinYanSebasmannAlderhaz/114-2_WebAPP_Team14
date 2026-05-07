# Week 11 Practice report

## In-class Practice

### Session-Based Login and Logout Flow

> - **Purpose**: Use Django's session framework to remember whether a visitor has logged in, so private features can be tied to a real user account instead of temporary frontend state.
> - **Usage in this project**: We added `/login/`, `/logout/`, and `/api/auth/status/`. After a successful login, Django stores the authenticated user in the session cookie. The navbar now reads the session state and displays either `未登入` or the current user's name.

### Member Registration Flow

> - **Purpose**: Let new users create accounts through a server-side form workflow, then immediately use member-only features after registration.
> - **Usage in this project**: We added `/register/` with Django's `UserCreationForm`. When registration succeeds, the new user is logged in automatically and redirected to the original target page when a `next` value exists.

### Authenticated User Navigation

> - **Purpose**: Make the UI react to session state in a consistent way across pages.
> - **Usage in this project**: The login link in the navbar was upgraded into a user menu. When logged in, hovering or focusing the username opens links for `個人檔案` and `登出`; when logged out, the same area shows `未登入` and links to the login page.

## Additional Content

### Character Favorite System

> - **User-specific data model**
>   - **Purpose**: Store each user's favorite ninja characters in the database.
>   - **Usage in this project**: We added `CharacterFavorite` with a unique constraint on `user + character`, so the same user cannot favorite the same character more than once.
>
> - **Frontend favorite button**
>   - **Purpose**: Let users save favorite characters directly from the character browsing page.
>   - **Usage in this project**: Each character card in `characters.html` now has a `⭐ 收藏 / 已收藏` button. The frontend calls `POST /characters/<id>/favorite/`; unauthenticated users are redirected to login.
>
> - **Profile dashboard integration**
>   - **Purpose**: Give users a place to review their saved content.
>   - **Usage in this project**: `profile.html` now includes a `我的收藏角色` section that lists the characters saved by the current user.

### Timeline Sidebar and Personal Bookmark

> - **Timeline sidebar navigation**
>   - **Purpose**: Improve navigation through the long timeline page.
>   - **Usage in this project**: The timeline page has a left-side `timeline-bookmark` rail that lists timeline sections and entries, allowing users to jump to specific events.
>
> - **Single personal timeline bookmark**
>   - **Purpose**: Help a logged-in user remember where they currently are in the timeline.
>   - **Usage in this project**: We added `TimelineProgress` and `/api/timeline/progress/`. Each user can keep one active timeline bookmark; adding a new bookmark replaces the old one, and `清除` removes it.
>
> - **Visual bookmark marker**
>   - **Purpose**: Make the saved timeline position visible while browsing.
>   - **Usage in this project**: The bookmarked timeline entry is highlighted, and the matching item in the left `timeline-bookmark` sidebar is marked with `★` and a yellow style.

## Contribution

| Member | Percentage | Contribution |
| :--: | :--: | :-- |
| 顏伯亨 | 50% | Development of login/logout/registration system, bookmark system, and character collection system., Bug Fix, and Report Writing |
| 呂羿樺 | 50% | Create feedback system, Home page optimization, Bug Fix, and Report Writing |