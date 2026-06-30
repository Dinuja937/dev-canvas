# Requirements Clarifications

This document outlines the official clarifications provided by the lecturer regarding specific assignment requirements. These clarifications have been actively integrated into the system's architecture and features.

## 1. Student Verification
**Question:** For the Google OAuth login, should we restrict access strictly to our university email domain (e.g., matching student/staff emails), or should we allow any public Gmail account to sign up so external recruiters can onboard easily?
**Answer:** There should be a way to check whether the person is registered student. You can come up with any solution for that.
**Implementation:** Implemented a Role Selection mechanism. Upon Google login, new users are redirected to select a role (Student vs. Recruiter), allowing public onboarding while distinguishing student accounts.

## 2. File Size Limits
**Question:** Is there a specific maximum file size restriction you expect for the project thumbnails that students upload (e.g., under 5MB) to optimize database storage?
**Answer:** 5MB per file is fine (you can decide).
**Implementation:** Implemented a 5MB maximum file size limit using `multer` for project image uploads in the backend.

## 3. Sorting & Filtering
**Question:** For the main project feed display, should the projects be displayed in a simple chronological order (most recently uploaded first), or do you expect a specific default sorting/filtering system?
**Answer:** By default sort by time, but ideal if we have more criterias to sort.
**Implementation:** Projects are fetched and sorted chronologically by default.

## 4. Multiple Images & Cover Images
**Question:** Are students allowed to upload a gallery of multiple images for a single project, or is it strictly limited to one primary thumbnail per project post?
**Answer:** Allow multiple images. Ideal if there is a way to upload a cover image as well so our project preview is more eye catching.
**Implementation:** Implemented a dedicated "Cover Image" upload along with a separate "Project Gallery" upload allowing multiple extra images, both during project creation and editing.

## 5. Admin Account Creation
**Question:** For the Admin role, do we need a dedicated registration/signup flow, or can we just manually assign the Admin role to specific user records directly inside the database for this evaluation?
**Answer:** Just creating an admin user by sql query is fine. (Note: using MongoDB, so modified directly in the database).
**Implementation:** No dedicated UI for admin signup. Admin roles are manually updated directly in the database.

## 6. Search Functionality
**Question:** Do you expect a global search bar on the home feed where recruiters can search for specific project titles or student names, or is a standard list view sufficient?
**Answer:** Need a search option.
**Implementation:** A dynamic search bar is present directly on the Home feed (above the project grid), allowing users to filter projects in real-time by title, description, student name, or technologies.
