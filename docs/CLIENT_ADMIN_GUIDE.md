# HRFlow AI — Client Administrator Guide

Welcome to the HRFlow AI Operations Admin console! This guide outlines how to configure settings, invite users, manage approval rules, and control the document lifecycles for your organization.

## 1. Setting Up Your Organization Profile

When you first log in, you will be guided through the **Client Onboarding Wizard**. If you need to make changes later, navigate to **Settings** in the main sidebar.

### Localizations & Configurations
- **Country & Region**: Determines legal boundaries. Ensure you set this accurately as it dictates calendar defaults and regional settings.
- **Timezone**: All audit events and conversation logs display in UTC internally, but render to users in their configured organization timezone.
- **Working Week**: Define standard working days (e.g. Monday–Friday) to let the Analytics Agent track operational performance correctly.

---

## 2. Managing Users, Roles, and Permissions

To manage staff access, go to the **Employees** dashboard.
- **Roles**: Default roles include `HR_ADMIN`, `HR_MANAGER`, and `EMPLOYEE`.
- **Granular Rules**: An administrator can customize role assignments.
- **Safety Bound**: The conversational HR AI Manager inherits the permissions of the logged-in user. If a regular employee asks the agent for salary details, the agent refuses access due to missing permissions.

---

## 3. The Human Approval Center Settings

Operations of high consequence (like emailing candidates or altering profile information) require human validation. You can configure rules for action risk tiers under **Settings > Approvals**:

- **LOW Risk**: Summarizing text, looking up policies, reading data. No approval required.
- **MEDIUM Risk**: Drafting candidate emails, creating checklists. Drafts are sent to review and approved automatically.
- **HIGH Risk**: Sending emails, exporting CSV lists, changing profiles. Actions are placed in the **Approvals Center** and require explicit admin authorization.

---

## 4. Document Lifecycle & Knowledge Base

To manage policies, navigate to **Policies & Knowledge**.

### Adding Policies
1. Select **Upload Policy Document** (PDF, TXT, MD, HTML, DOCX are supported).
2. The file is uploaded as a **Draft** state.
3. HR administrators must review the draft, version it, and click **Publish**.
4. Once published, the document is processed into semantic search segments for the AI Agent to query.

### Updating Policies
- When a policy is updated, upload it as a new version.
- Publishing the new version automatically updates the policy reference and archives the previous version, preventing the AI from referencing outdated information.
- All versions and status changes are recorded in the audit logs.
