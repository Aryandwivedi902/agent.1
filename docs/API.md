# HRFlow AI — API Reference Documentation

This document describes the primary REST API endpoints available in the HRFlow AI platform. All endpoints enforce JSON payloads, tenancy checks, and RBAC authorization.

## 1. Authentication Endpoints

### User Login
- **Endpoint**: `POST /api/auth/login`
- **Auth Required**: No
- **Payload**:
  ```json
  {
    "email": "alice.vance@acme.com",
    "password": "secure_password_here"
  }
  ```
- **Response**: `200 OK`
  ```json
  {
    "token": "eyJhbGciOi...",
    "user": {
      "id": "u0000000-0000-0000-0000-000000000101",
      "firstName": "Alice",
      "lastName": "Vance",
      "role": "HR_ADMIN",
      "organizationId": "a0000000-0000-0000-0000-000000000001"
    }
  }
  ```

---

## 2. Organization Onboarding

### Create Tenant & Profile
- **Endpoint**: `POST /api/onboarding/register`
- **Auth Required**: No (first-user registration)
- **Payload**:
  ```json
  {
    "companyName": "Acme Corporation",
    "domain": "acme.com",
    "country": "US",
    "timezone": "America/Los_Angeles",
    "locale": "en-US",
    "adminUser": {
      "email": "admin@acme.com",
      "password": "securepassword123",
      "firstName": "System",
      "lastName": "Administrator"
    }
  }
  ```
- **Response**: `201 Created`

---

## 3. Conversational Workspace (AI Manager)

### Send Message
- **Endpoint**: `POST /api/ai-manager/chat`
- **Headers**: `Authorization: Bearer <token>`
- **Payload**:
  ```json
  {
    "conversationId": "c0000000-0000-0000-0000-000000000001",
    "message": "Find our company leave policy and tell me if I carry over unused days."
  }
  ```
- **Response**: `200 OK`
  ```json
  {
    "messageId": "m0000000-0000-0000-0000-000000000002",
    "sender": "assistant",
    "content": "According to the Acme Paid Time Off (PTO) Policy, unused PTO carryover is permitted. You can carry over up to a maximum of 5 days into the next calendar year.",
    "citations": [
      {
        "documentName": "Acme Employee Handbook",
        "section": "Section 2.4 - Time Off",
        "page": 4
      }
    ],
    "agentRunId": "r0000000-0000-0000-0000-000000000010"
  }
  ```

---

## 4. Human Approval Center

### List Pending Approvals
- **Endpoint**: `GET /api/approvals/pending`
- **Headers**: `Authorization: Bearer <token>`
- **Response**: `200 OK`
  ```json
  [
    {
      "id": "v0000000-0000-0000-0000-000000000101",
      "actionType": "send_email",
      "riskLevel": "HIGH",
      "requestedBy": "Bob Miller",
      "payload": {
        "to": "candidate@gmail.com",
        "subject": "Interview Scheduled",
        "body": "Dear candidate..."
      },
      "evidence": {
        "reason": "Recruitment coordination scheduled slot"
      },
      "created_at": "2026-08-30T17:05:00Z"
    }
  ]
  ```

### Execute Approval Action
- **Endpoint**: `POST /api/approvals/:id/action`
- **Headers**: `Authorization: Bearer <token>`
- **Payload**:
  ```json
  {
    "action": "approve", -- approve, reject, edit_approve
    "modifiedPayload": null, -- Used if editing before approving
    "comment": "Verified calendar availability, schedule looks good."
  }
  ```
- **Response**: `200 OK`
  ```json
  {
    "id": "v0000000-0000-0000-0000-000000000101",
    "status": "executed"
  }
  ```

---

## 5. Audit Log Viewer

### Query Audit Logs
- **Endpoint**: `GET /api/audit-logs`
- **Headers**: `Authorization: Bearer <token>` (Enforced `view_audit_log` permission check)
- **Params**: `actor_user_id`, `action`, `resource`, `start_date`, `end_date`, `page`, `limit`
- **Response**: `200 OK`
  ```json
  {
    "data": [
      {
        "id": "l0000000-0000-0000-0000-000000000101",
        "actorEmail": "alice.vance@acme.com",
        "actorType": "user",
        "action": "DOCUMENT_ACCESS",
        "resource": "documents",
        "result": "success",
        "timestamp": "2026-08-30T17:05:00Z"
      }
    ],
    "total": 1,
    "page": 1,
    "totalPages": 1
  }
  ```
