# Orderly

## Description

Tool to handle chaos - Collaborative task management app.

This application is designed to be similar to Trello or other task management tools. It offers both free and premium plans. The free plan includes essential features such as task creation, editing, and reminders. The premium plan provides additional functionalities like recurring tasks, team collaboration, and analytics.

**Unique Selling Proposition (USP):** The app includes an encrypted chat feature for team communication. This ensures secure and independent collaboration, which is particularly beneficial for freelancers.

--- 

**This repository will serve as a GitHub log for the project, which is currently under development.**

---

## Features
- Create Project
- Task Creation, Editing, and reminders (Free).
- Recurring tasks, team collaboration and analytics (Premium).

---

### User Stories
- As a user, I can create a project.
- As a user, I can create a task.
- As a user, I can edit a task.
- As a user, I can set reminders for a task.
- As a user, I can create recurring tasks.
- As a user, I can collaborate with my team.
- As a user, I can view analytics of my project.
- As a user, I can upgrade to premium plan.
- As a user, I can make payment for the premium plan.
- As a user, I can view my subscription details.
- As a user, I can view my payment history.
- As a user, I can view my activity log.
- As a user, I can view my notifications.
- As a user, I can chat with my team members.
- As a user, I can view my chat history.
- As a user, I can view my profile.
- As a user, I can edit my profile.
- As a user, I can delete my account.
- As a user, I can view my account details.
- As a user, I can view my account settings.
- As a user, I can invite people to collaborate on a project.

## Tech Stack
- Backend: Node.js, Express.js, MongoDB
- Frontend: React.js, Redux
- Database: MongoDB (Atlas)
- Deployment: Digital Ocean, Vercel
- Payment Gateway: Razorpay

---

## Project structure
- `client`: Frontend code
- `server`: Backend code

---

## Setup
- Clone the repository
- Install dependencies
- Run the server
- Run the client

---

## Modules
- [ ] User Authentication
- [ ] Project Creation
- [ ] Task Creation
- [ ] Task Editing
- [ ] Task Reminders
- [ ] Recurring Tasks
- [ ] Team Collaboration
- [ ] Analytics
- [ ] Payment Gateway Integration
- [ ] Deployment
- [ ] Testing

---

## Database Schema (MongoDB) - Initial Draft

### User
| Field       | Type | Description |
|-------------| --- | --- |
| id          | ObjectId | Unique identifier |
| name        | String | Name of the user |
| email       | String | Email of the user |
| password    | String | Password of the user |
| profile_pic | String | Profile picture of the user |
| jobTitle    | String | Job title of the user |
| createdAt   | Date | Date of creation |
| updatedAt   | Date | Date of last update |

### Project
| Field | Type | Description                | Extra              |
| --- | --- |----------------------------|--------------------|
| id | ObjectId | Unique identifier          |
| name | String | Name of the project        |
| description | String | Description of the project |
| collaborators | Array | List of collaborators      | reference to Users |
| owner | ObjectId | Owner of the project        | reference to User  |
| createdAt | Date | Date of creation           |
| updatedAt | Date | Date of last update        |


### Task
| Field | Type | Description                | Extra              |
| --- | --- |----------------------------|--------------------|
| id | ObjectId | Unique identifier          |
| name | String | Name of the task           |
| description | String | Description of the task  |
| project | ObjectId | Project of the task       | reference to Project |
| assignee | ObjectId | Assignee of the task       | reference to User  |
| creator | ObjectId | Creator of the task        | reference to User  |
| assignedBy | ObjectId | Assigned by               | reference to User  |
| assignedAt | Date | Date of assignment         |
| status | String | Status of the task         | enum: ['todo', 'in-progress', 'done'] |
| priority | String | Priority of the task       | enum: ['low', 'medium', 'high'] |
| tags | Array | Tags of the task            |
| links | Array | Links related to the task   |
| files | Array | Files related to the task   |
| dueDate | Date | Due date of the task        |
| createdAt | Date | Date of creation           |
| updatedAt | Date | Date of last update        |

### Activity

| Field | Type | Description                | Extra                                            |
| --- | --- |----------------------------|--------------------------------------------------|
| id | ObjectId | Unique identifier          |
| user | ObjectId | User who performed the activity | reference to User                                |
| project | ObjectId | Project of the activity    | reference to Project                             |
| task | ObjectId | Task of the activity        | reference to Task                                |
| type | String | Type of the activity        | enum: ['create', 'update', 'delete', assignment] |
| assignmentTo | ObjectId | Assignment to           | reference to User                                |
| createdAt | Date | Date of creation           |
| updatedAt | Date | Date of last update        |


### Notification

| Field | Type | Description                | Extra                                            |
| --- | --- |----------------------------|--------------------------------------------------|
| id | ObjectId | Unique identifier          |
| user | ObjectId | User who received the notification | reference to User                                |
| project | ObjectId | Project of the notification | reference to Project                             |
| task | ObjectId | Task of the notification    | reference to Task                                |
| message | String | Message of the notification |
| read | Boolean | Read status of the notification |
| createdAt | Date | Date of creation           |
| updatedAt | Date | Date of last update        |


### Chat

| Field | Type | Description                     | Extra                                            |
| --- | --- |---------------------------------|--------------------------------------------------|
| id | ObjectId | Unique identifier               |
| user | ObjectId | User who sent the message       | reference to User                                |
| project | ObjectId | Project of the chat             | reference to Project                             |
| reciever | ObjectId | Reciever of the message         | reference to User                                |
| message | String | Message of the chat (Encrypted) |
| createdAt | Date | Date of creation                |
| updatedAt | Date | Date of last update             |

### Subscription

| Field | Type | Description                | Extra                                            |
| --- | --- |----------------------------|--------------------------------------------------|
| id | ObjectId | Unique identifier          |
| user | ObjectId | User who subscribed        | reference to User                                |
| plan | String | Plan of the subscription   | enum: ['free', 'premium']                        |
| status | String | Status of the subscription | enum: ['active', 'inactive']                    |
| startDate | Date | Start date of the subscription |
| endDate | Date | End date of the subscription |
| createdAt | Date | Date of creation           |
| updatedAt | Date | Date of last update        |


### Payment

| Field | Type | Description                | Extra                                            |
| --- | --- |----------------------------|--------------------------------------------------|
| id | ObjectId | Unique identifier          |
| user | ObjectId | User who made the payment  | reference to User                                |
| plan | String | Plan of the payment        | enum: ['free', 'premium']                        |
| amount | Number | Amount of the payment     |
| status | String | Status of the payment      | enum: ['success', 'failed']                      |
| createdAt | Date | Date of creation           |
| updatedAt | Date | Date of last update        |


### RefreshToken

| Field | Type | Description                  | Extra                                            |
| --- | --- |------------------------------|--------------------------------------------------|
| id | ObjectId | Unique identifier            |
| user | ObjectId | User who generated the token | reference to User                                |
| token | String | Refresh token (hashed)       |
| createdAt | Date | Date of creation             |
| updatedAt | Date | Date of last update          |



---

## Log

### Day 1 (7th December 2024)
- Created the repository
- Updated Readme with project details, features, and tech stack
- Created the initial project structure
- Setup the backend server
- Setup tests for the backend

### Day 2 (10th December 2024)
- Refactored the backend code
- Add Zod for input validation
- Create Routes for User Authentication
- Add schemaValidation middleware
- Unit tests for expressCatchAll and schemaValidation

### Day 3 (11th December 2024)
- Update AuthController.register
- Update testCases for AuthController.register

### Day 4 (12th December 2024)
- Update AuthController.login
- Update testCases for AuthController.login
- Add JWT for token generation
- Hash password before storing
- Login with email and password
---