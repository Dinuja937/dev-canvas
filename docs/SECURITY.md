# 🛡️ DevCanvas — Security Documentation

> **Assessment 2 Documentation**  
> This document summarizes the security controls implemented in DevCanvas for Assessment 2, including authentication, authorization, input validation, secure file handling, server security, logging, and OWASP Top 10 assessment.

---

## 1. Implemented Security Controls

### 🔑 Authentication & Identity
* Integrated **Asgardeo OIDC** using the authorization-code flow.
* Implemented **OAuth State** and **PKCE (S256)** protection.
* Used **HttpOnly cookies** for OAuth state and PKCE values.
* Verified Asgardeo ID tokens using **RS256** and **JWKS** with `kid` matching.
* Validated `iss`, `aud`, and `exp` claims with clock-skew tolerance.
* Rejected missing, malformed, invalid, and forged bearer tokens.
* Mapped authenticated Asgardeo users to application accounts.
* Backend application authentication uses signed **HS256 JWTs**.

### 🛡️ Authorization & Access Control
* Implemented backend **RBAC** for `ADMIN`, `STUDENT`, and `RECRUITER` roles.
* Protected administrative operations using server-side role checks.
* Restricted project mutations according to the authenticated user's role.
* Implemented server-side project ownership verification for update/delete operations.
* Implemented `owner=me` project retrieval using the authenticated server identity.
* Validated MongoDB ObjectIds before protected database operations.

### 💉 Input & Injection Protection
* Validated route and query parameters.
* Applied allowlisted and type-checked project/profile inputs.
* Explicitly converted expected string parameters.
* Rejected malformed MongoDB ObjectIds with `400 Bad Request`.
* Applied targeted validation to reduce NoSQL injection risks.

### 📁 Secure File Uploads
* Used **Multer memory storage** for project uploads.
* Restricted uploads to:
  * `image/jpeg`
  * `image/png`
  * `image/webp`
* Enforced a **5 MB** file-size limit.
* Rejected unsupported MIME types.
* Uploaded accepted image buffers directly to Cloudinary.
* The project upload flow does not fetch arbitrary user-supplied URLs.

### 🖥️ Server & Configuration Security
* Enabled **Helmet** security headers.
* Restricted **CORS** to the configured client origin.
* Applied JSON request-size limits.
* Added production error handling with generic central `500` responses.
* Stored service secrets/configuration in environment variables.
* `.env` files are excluded from Git.
* Local HTTPS certificate/private-key files are excluded from Git.

### 📊 Logging & Monitoring
* Configured **Morgan** HTTP request logging.
* Uses a query-free URL format to avoid logging query-string data.
* Added **JSON security audit logging** for:
  * Administrative user suspension.
  * Administrative project deletion.
  * OIDC authentication rejection/failure events.

---

## 2. OWASP Top 10 Assessment

| OWASP Category | Severity | Finding / Risk | Implemented Security Control | Verification |
| :--- | :--- | :--- | :--- | :--- |
| **A01: Broken Access Control** | `High` | IDOR risk on project modification and unauthorized resource access. | RBAC, server-side project ownership verification, ObjectId validation, and authenticated `owner=me` resolution. | Code review and authorization testing. |
| **A02: Cryptographic Failures** | `High` | Risk of weak token verification or exposed secrets. | Asgardeo RS256/JWKS verification and environment-based secret configuration. | Authentication/configuration review. |
| **A03: Injection** | `High` | Potential NoSQL injection through unvalidated parameters and filters. | ObjectId validation, type validation, explicit conversion, and allowlisted inputs. | Malformed input/ObjectId testing. |
| **A04: Insecure Design** | `Medium` | Authentication flow required protection against OAuth manipulation and token trust issues. | OIDC authorization-code flow, State, PKCE, and cryptographic ID-token verification. | Authentication flow review. |
| **A05: Security Misconfiguration** | `Medium` | Missing security headers and potential internal error exposure. | Helmet, restricted CORS, JSON limits, environment protection, and production error handling. | Configuration/error-handling review. |
| **A06: Vulnerable Components** | `Medium` | React Router dependencies contained known vulnerabilities. | Updated `react-router` and `react-router-dom` from `7.18.0` → `7.18.2`. Backend and frontend npm audit report 0 vulnerabilities. | Dependency audit. |
| **A07: Identification & Authentication Failures** | `High` | Invalid or forged authentication tokens could be accepted. | RS256/JWKS ID-token verification with `iss`, `aud`, and `exp` validation; invalid bearer tokens rejected. | Authentication and token validation testing. |
| **A08: Software & Data Integrity Failures** | `High` | Upload endpoints could accept unsupported file types. | Multer MIME filtering and 5 MB size restriction with controlled Cloudinary buffer uploads. | File-upload validation testing. |
| **A09: Security Logging & Monitoring Failures** | `Low` | Insufficient request and security event logging. | Morgan HTTP logging and JSON security audit events. | Log inspection. |
| **A10: Server-Side Request Forgery (SSRF)** | `Low` | Risk of server fetching arbitrary user-supplied URLs. | Project uploads use file buffers; no project-upload server-side fetching of user-supplied URLs. | Upload-service code inspection. |

---

## 3. Dependency Security Verification

Production dependencies were audited using:

```bash
npm audit --omit=dev --audit-level=low
```

### Backend
* **0 vulnerabilities**

### Frontend
The identified React Router vulnerabilities were resolved:
* `react-router`: `7.18.0` → `7.18.2`
* `react-router-dom`: `7.18.0` → `7.18.2`

**Final result:**
```text
found 0 vulnerabilities
```
The frontend production build also completed successfully after the dependency update.

> **Status:** `A06 Status: RESOLVED`

---

## 4. Security Verification

The repository includes:
```text
backend/scripts/verify-security.js
```

Additional backend security-related unit tests completed with:
* **3 passed**
* **0 failed**

The recorded `verify-security.js` run could not connect to the expected local server for its HTTP checks. Therefore, those failed connection checks are not presented as successful endpoint-security evidence.

Security controls were also verified through source-code/configuration review and dependency auditing.

---

## 📝 Security Summary

DevCanvas implements security controls covering:
* OIDC authentication and PKCE.
* RS256/JWKS token verification.
* RBAC and server-side ownership checks.
* Input and ObjectId validation.
* Secure file-upload restrictions.
* Helmet and CORS configuration.
* Environment-based secrets.
* Security and request logging.
* Dependency vulnerability management.
* OWASP Top 10 security assessment.

**Final dependency audit:** `0 production vulnerabilities`.
