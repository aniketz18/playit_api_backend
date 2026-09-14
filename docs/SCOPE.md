# PlayIt — V1 MVP Scope

## 1. Goal

Build a minimal video-sharing platform where users can
create an account, upload videos, watch videos, and interact
with videos.

## 2. Users

### Viewer
- Register / Login
- Browse videos
- Search videos
- Watch videos
- Like videos
- Comment on videos

### Creator
- Upload a video
- Add title, description, and thumbnail
- View own uploaded videos
- Edit/delete own videos

> A user can be both a Viewer and Creator.

## 3. MVP Features

### Authentication
- Register
- Login
- Logout
- JWT authentication
- Protected routes

### Videos
- Upload video
- Upload thumbnail
- Video title
- Description
- Video listing
- Video details
- Video playback
- Edit/delete own video

### Interaction
- Like / unlike
- Add comment
- View comments
- Delete own comment

### Search
- Search videos by title

## 4. Basic User Flow

Register/Login
    ↓
Home
    ↓
Browse/Search
    ↓
Select Video
    ↓
Watch
    ├── Like
    └── Comment

Creator:

Login
    ↓
Upload Video
    ↓
Add Details
    ↓
Publish
    ↓
Video appears on Home

## 5. Out of Scope for MVP

- Subscriptions
- Playlists
- Watch history
- Notifications
- Recommendations
- AI features
- Live streaming
- Shorts
- Monetization
- Ads
- Advanced analytics
- Mobile application

These can be considered for V2.

## 6. MVP Success Criteria

The MVP is complete when:

- A user can register and login.
- An authenticated user can upload a video.
- Other users can find and watch the video.
- Users can search videos.
- Users can like and comment.
- A creator can manage their own videos.
- The complete core flow works in production.

## 7. Scope Rule

If a new feature is not required for the core flow:

> Move it to V2 instead of expanding the MVP.

The priority is:

**Small → Complete → Working → Deployed.**