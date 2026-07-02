# Member 3 - SE/2022/021 (Event-Driven Notifications & System Documentation)

As the Event-Driven Notifications and Documentation developer for the DevCanvas project, I was responsible for implementing the event-driven notification infrastructure and preparing the project's technical documentation. My work focused on designing an asynchronous notification architecture using Node.js events and producing the required software design documentation, including system diagrams, API specifications, and deployment documentation.

## 1. Event Bus Infrastructure
* **Singleton Event Bus:** Developed `eventBus.js` using Node.js `EventEmitter` as a singleton to provide a centralized event communication mechanism across the backend.
* **Loose Coupling:** Designed the event bus to decouple business logic from notification generation, improving maintainability and scalability.

## 2. Event Listener Implementation
* **Listeners Module:** Created `listeners.js` to subscribe to application events.
* **Project Creation Listener:** Implemented the `project:created` listener to trigger notification generation for users following the project creator.
* **Project Like Listener:** Implemented the `project:liked` listener to trigger notifications for project owners whenever their projects receive new likes.
* **Service Integration:** Connected event listeners with the notification service while keeping controllers independent of notification logic.

## 3. Event Coordination with Backend Modules
* **Project Creation Event:** Coordinated with the Project module to emit the `project:created` event after successful project persistence.
* **Project Like Event:** Coordinated with the Like module to emit the `project:liked` event after successful like/unlike operations.
* **Execution Flow:** Ensured events are emitted only after successful database transactions to maintain data consistency.

## 4. Event-Driven Architecture Design
* **Asynchronous Processing:** Implemented an event-driven workflow that allows notification processing without blocking user requests.
* **Scalable Design:** Structured the notification pipeline so additional event listeners can be added without modifying existing controller logic.
* **Separation of Concerns:** Isolated notification handling from business operations using publish-subscribe architecture.

## 5. System Documentation
* **ER Diagram:** Designed the MongoDB Entity Relationship Diagram illustrating relationships between:
  * `User` → `Project`
  * `User` → `Like`
  * `Project` → `Like`
  * `Follower` relationships between users
  * `User` → `Notification`
* **Sequence Diagrams:** Created UML sequence diagrams for:
  * OAuth Login Flow
  * Project Creation Workflow
  * Project Like Workflow
* **Architecture Documentation:** Documented the event-driven notification workflow and component interactions.

## 6. REST API Documentation
* **Endpoint Specifications:** Prepared documentation for backend REST APIs including:
  * Request payloads
  * URL parameters
  * Query parameters
  * Response formats
  * Error responses
* **Developer Guide:** Documented API usage to support frontend integration and future maintenance.

## 7. Deployment & Project Documentation
* **Environment Variables:** Documented required backend and frontend environment variables for deployment.
* **Deployment Guide:** Prepared deployment instructions covering project configuration, environment setup, and application startup.
* **Technical Documentation:** Organized project documentation to improve onboarding and simplify future development.

## 8. Version Control & Verification
* **Branching Strategy:** Conducted all implementation on the `feat/member3-event-notifications` feature branch.
* **Integration Testing:** Verified successful event emission, listener execution, and notification workflow after backend integration.
* **Documentation Review:** Ensured all diagrams and technical documentation accurately reflected the implemented system architecture.