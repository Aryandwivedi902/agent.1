-- HRFlow AI — PostgreSQL Database Schema
-- Multi-Tenant Security & Agent Workflows System
-- Target Database: PostgreSQL 14+
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

--------------------------------------------------------------------------------
-- 1. ORGANIZATIONS & TENANCY
--------------------------------------------------------------------------------

CREATE TABLE organizations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    domain VARCHAR(255) UNIQUE,
    status VARCHAR(50) NOT NULL DEFAULT 'active', -- active, suspended, deleted
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP WITH TIME ZONE
);

CREATE TABLE organization_settings (
    organization_id UUID PRIMARY KEY REFERENCES organizations(id) ON DELETE CASCADE,
    country VARCHAR(100) NOT NULL DEFAULT 'US',
    region VARCHAR(100),
    timezone VARCHAR(100) NOT NULL DEFAULT 'UTC',
    locale VARCHAR(20) NOT NULL DEFAULT 'en-US',
    language VARCHAR(10) NOT NULL DEFAULT 'en',
    currency VARCHAR(10) NOT NULL DEFAULT 'USD',
    date_format VARCHAR(50) NOT NULL DEFAULT 'YYYY-MM-DD',
    time_format VARCHAR(50) NOT NULL DEFAULT 'HH:mm:ss',
    working_week JSONB NOT NULL DEFAULT '{"mon": true, "tue": true, "wed": true, "thu": true, "fri": true, "sat": false, "sun": false}',
    holiday_calendar JSONB NOT NULL DEFAULT '[]',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

--------------------------------------------------------------------------------
-- 2. USER AUTHENTICATION & granular RBAC
--------------------------------------------------------------------------------

CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    email VARCHAR(255) NOT NULL,
    password_hash VARCHAR(255) NOT NULL, -- Stored as bcrypt/argon2, never plaintext
    mfa_secret VARCHAR(255),             -- Encrypted
    mfa_enabled BOOLEAN DEFAULT FALSE,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    status VARCHAR(50) NOT NULL DEFAULT 'active', -- active, inactive, pending_onboarding
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP WITH TIME ZONE,
    CONSTRAINT uniq_org_user_email UNIQUE (organization_id, email)
);

CREATE TABLE roles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE, -- NULL means system-wide global role
    name VARCHAR(100) NOT NULL,
    description TEXT,
    is_custom BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uniq_org_role_name UNIQUE (organization_id, name)
);

CREATE TABLE permissions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) UNIQUE NOT NULL, -- e.g. view_employee_sensitive, send_email
    description TEXT,
    category VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE role_permissions (
    role_id UUID NOT NULL REFERENCES roles(id) ON DELETE CASCADE,
    permission_id UUID NOT NULL REFERENCES permissions(id) ON DELETE CASCADE,
    PRIMARY KEY (role_id, permission_id)
);

CREATE TABLE user_roles (
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    role_id UUID NOT NULL REFERENCES roles(id) ON DELETE CASCADE,
    PRIMARY KEY (user_id, role_id)
);

--------------------------------------------------------------------------------
-- 3. EMPLOYEES & PROFILES
--------------------------------------------------------------------------------

CREATE TABLE departments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    parent_department_id UUID REFERENCES departments(id),
    manager_id UUID, -- References employees(id) (added foreign key constraint later)
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP WITH TIME ZONE
);

CREATE TABLE employees (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    employee_id_number VARCHAR(100),
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    personal_email VARCHAR(255),
    work_email VARCHAR(255) NOT NULL,
    phone VARCHAR(50),
    department_id UUID REFERENCES departments(id),
    job_title VARCHAR(255),
    employment_status VARCHAR(50) NOT NULL DEFAULT 'active', -- active, suspended, terminated, leave
    start_date DATE NOT NULL,
    end_date DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP WITH TIME ZONE
);

-- Complete circular foreign key for department manager
ALTER TABLE departments ADD CONSTRAINT fk_dept_manager FOREIGN KEY (manager_id) REFERENCES employees(id) ON DELETE SET NULL;

CREATE TABLE employee_profiles (
    employee_id UUID PRIMARY KEY REFERENCES employees(id) ON DELETE CASCADE,
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    date_of_birth DATE,
    gender VARCHAR(50),
    nationality VARCHAR(100),
    address_street VARCHAR(255),
    address_city VARCHAR(100),
    address_state VARCHAR(100),
    address_zip VARCHAR(50),
    address_country VARCHAR(100),
    emergency_contact_name VARCHAR(255),
    emergency_contact_phone VARCHAR(50),
    emergency_contact_relation VARCHAR(100),
    bank_account_encrypted BYTEA, -- Encrypted at application layer
    national_id_encrypted BYTEA,  -- Encrypted at application layer
    salary_encrypted BYTEA,       -- Encrypted at application layer
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

--------------------------------------------------------------------------------
-- 4. KNOWLEDGE BASE & DOCUMENTS (RAG)
--------------------------------------------------------------------------------

CREATE TABLE documents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    category VARCHAR(100) NOT NULL, -- policy, training, contract, template
    current_version INTEGER NOT NULL DEFAULT 1,
    status VARCHAR(50) NOT NULL DEFAULT 'draft', -- draft, review, published, superseded, archived
    is_confidential BOOLEAN DEFAULT FALSE,
    owner_id UUID NOT NULL REFERENCES users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP WITH TIME ZONE
);

CREATE TABLE document_versions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    document_id UUID NOT NULL REFERENCES documents(id) ON DELETE CASCADE,
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    version INTEGER NOT NULL,
    file_path VARCHAR(512) NOT NULL, -- Object storage path
    file_name VARCHAR(255) NOT NULL,
    file_size INTEGER NOT NULL,
    mime_type VARCHAR(100) NOT NULL,
    approved_by UUID REFERENCES users(id),
    approved_at TIMESTAMP WITH TIME ZONE,
    change_log TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE knowledge_sources (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    source_type VARCHAR(50) NOT NULL, -- file, sharepoint, wiki, slack, website
    config JSONB NOT NULL DEFAULT '{}',
    status VARCHAR(50) NOT NULL DEFAULT 'active',
    last_synced_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE knowledge_chunks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    knowledge_source_id UUID REFERENCES knowledge_sources(id) ON DELETE CASCADE,
    document_version_id UUID REFERENCES document_versions(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    embedding_vector_id UUID, -- If using pgvector: embedding vector(1536) / vector(768)
    metadata JSONB NOT NULL DEFAULT '{}', -- Contains page_number, access_permissions, etc.
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE policies (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    document_id UUID REFERENCES documents(id) ON DELETE SET NULL,
    title VARCHAR(255) NOT NULL,
    summary TEXT,
    jurisdiction_country VARCHAR(10) NOT NULL DEFAULT 'GLOBAL',
    jurisdiction_region VARCHAR(100),
    effective_date DATE,
    expiration_date DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE policy_versions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    policy_id UUID NOT NULL REFERENCES policies(id) ON DELETE CASCADE,
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    version INTEGER NOT NULL,
    document_version_id UUID REFERENCES document_versions(id),
    status VARCHAR(50) NOT NULL DEFAULT 'draft', -- draft, active, superseded
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

--------------------------------------------------------------------------------
-- 5. AGENT OPERATIONS & CONVERSATIONS
--------------------------------------------------------------------------------

CREATE TABLE conversations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'active', -- active, archived
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE conversation_messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    conversation_id UUID NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    sender_role VARCHAR(50) NOT NULL, -- user, assistant, system
    sender_user_id UUID REFERENCES users(id),
    content TEXT NOT NULL,
    citations JSONB DEFAULT '[]', -- References to document_versions / policies
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE agent_runs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    conversation_id UUID REFERENCES conversations(id) ON DELETE SET NULL,
    initiated_by_user_id UUID NOT NULL REFERENCES users(id),
    agent_name VARCHAR(100) NOT NULL, -- HR AI Manager, Email Agent, etc.
    status VARCHAR(50) NOT NULL DEFAULT 'running', -- running, completed, failed, waiting_approval
    task_plan JSONB NOT NULL DEFAULT '[]',
    tokens_used INTEGER DEFAULT 0,
    cost DECIMAL(10, 6) DEFAULT 0.00,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE agent_messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    agent_run_id UUID NOT NULL REFERENCES agent_runs(id) ON DELETE CASCADE,
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    sender VARCHAR(100) NOT NULL, -- HR AI Manager, Policy Agent, etc.
    recipient VARCHAR(100) NOT NULL,
    message_type VARCHAR(50) NOT NULL, -- request, response, thought, log
    content TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE agent_tools (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) UNIQUE NOT NULL, -- search_company_knowledge, send_email, etc.
    description TEXT,
    input_schema JSONB NOT NULL DEFAULT '{}',
    output_schema JSONB NOT NULL DEFAULT '{}',
    risk_level VARCHAR(20) NOT NULL DEFAULT 'low', -- low, medium, high
    approval_required BOOLEAN DEFAULT FALSE,
    timeout_seconds INTEGER DEFAULT 30,
    retry_limit INTEGER DEFAULT 3,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE tool_permissions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    role_id UUID NOT NULL REFERENCES roles(id) ON DELETE CASCADE,
    tool_id UUID NOT NULL REFERENCES agent_tools(id) ON DELETE CASCADE,
    approval_override_required BOOLEAN DEFAULT FALSE, -- Override standard tool settings for this role
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uniq_org_role_tool UNIQUE (organization_id, role_id, tool_id)
);

--------------------------------------------------------------------------------
-- 6. REQUESTS & WORKFLOWS
--------------------------------------------------------------------------------

CREATE TABLE employee_requests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    employee_id UUID NOT NULL REFERENCES employees(id) ON DELETE CASCADE,
    request_type VARCHAR(100) NOT NULL, -- leave, payroll_query, benefit_claim, hardware
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    priority VARCHAR(20) NOT NULL DEFAULT 'medium', -- low, medium, high, urgent
    status VARCHAR(50) NOT NULL DEFAULT 'open', -- open, in_progress, pending_info, resolved, closed
    assigned_to_user_id UUID REFERENCES users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP WITH TIME ZONE
);

CREATE TABLE request_comments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    employee_request_id UUID NOT NULL REFERENCES employee_requests(id) ON DELETE CASCADE,
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id),
    comment_text TEXT NOT NULL,
    is_private_hr_note BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE tasks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    status VARCHAR(50) NOT NULL DEFAULT 'pending', -- pending, in_progress, completed, cancelled
    due_date DATE,
    assigned_to_employee_id UUID REFERENCES employees(id) ON DELETE SET NULL,
    created_by_agent_run_id UUID REFERENCES agent_runs(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

--------------------------------------------------------------------------------
-- 7. APPROVALS & AUDIT LOGS
--------------------------------------------------------------------------------

CREATE TABLE approvals (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    agent_run_id UUID REFERENCES agent_runs(id) ON DELETE SET NULL,
    requested_by_user_id UUID REFERENCES users(id),
    action_type VARCHAR(100) NOT NULL, -- send_email, update_employee_record, export_data
    risk_level VARCHAR(20) NOT NULL DEFAULT 'medium', -- low, medium, high
    status VARCHAR(50) NOT NULL DEFAULT 'pending', -- pending, approved, rejected, executed, failed
    payload JSONB NOT NULL, -- Target action data (e.g. email details, update script)
    evidence JSONB DEFAULT '{}', -- Document citations or audit checks supporting this action
    warnings JSONB DEFAULT '[]', -- AI generated risk warnings
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE approval_actions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    approval_id UUID NOT NULL REFERENCES approvals(id) ON DELETE CASCADE,
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    actor_user_id UUID NOT NULL REFERENCES users(id),
    action VARCHAR(50) NOT NULL, -- approve, reject, edit_approve
    modified_payload JSONB,
    comment TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    actor_user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    actor_type VARCHAR(50) NOT NULL DEFAULT 'user', -- user, agent, system
    correlation_id UUID, -- Map UI requests to backend processes
    action VARCHAR(255) NOT NULL, -- e.g., USER_LOGIN, DOCUMENT_ACCESS, TOOL_CALL
    resource VARCHAR(100) NOT NULL, -- e.g., employees, document_versions
    resource_id UUID,
    result VARCHAR(50) NOT NULL, -- success, failure, denied
    details JSONB NOT NULL DEFAULT '{}',
    approval_ref_id UUID REFERENCES approvals(id),
    ip_address VARCHAR(45),
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE security_events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE, -- NULL for system-wide events
    event_type VARCHAR(100) NOT NULL, -- PROMPT_INJECTION_ATTEMPT, BRUTE_FORCE, TENANT_VIOLATION
    severity VARCHAR(20) NOT NULL DEFAULT 'high', -- low, medium, high, critical
    details JSONB NOT NULL DEFAULT '{}',
    ip_address VARCHAR(45),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

--------------------------------------------------------------------------------
-- 8. RECRUITMENT & ONBOARDING SYSTEM
--------------------------------------------------------------------------------

CREATE TABLE recruitment_jobs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    requirements JSONB NOT NULL DEFAULT '[]', -- Standardized screening criteria list
    status VARCHAR(50) NOT NULL DEFAULT 'draft', -- draft, open, closed
    created_by_user_id UUID NOT NULL REFERENCES users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP WITH TIME ZONE
);

CREATE TABLE candidates (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    recruitment_job_id UUID NOT NULL REFERENCES recruitment_jobs(id) ON DELETE CASCADE,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(50),
    resume_document_id UUID REFERENCES documents(id) ON DELETE SET NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'applied', -- applied, screening, interview, offer, hired, rejected
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE candidate_events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    candidate_id UUID NOT NULL REFERENCES candidates(id) ON DELETE CASCADE,
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    event_type VARCHAR(100) NOT NULL, -- resume_parsing, criteria_match, interview_scheduled, email_sent
    agent_run_id UUID REFERENCES agent_runs(id),
    actor_user_id UUID REFERENCES users(id),
    summary TEXT,
    details JSONB NOT NULL DEFAULT '{}', -- E.g. parsed criteria values, match percentages
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE onboarding_workflows (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    employee_id UUID NOT NULL REFERENCES employees(id) ON DELETE CASCADE,
    status VARCHAR(50) NOT NULL DEFAULT 'pending', -- pending, in_progress, completed, stalled
    progress_percentage INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE onboarding_tasks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    onboarding_workflow_id UUID NOT NULL REFERENCES onboarding_workflows(id) ON DELETE CASCADE,
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    status VARCHAR(50) NOT NULL DEFAULT 'pending', -- pending, in_progress, completed, bypassed
    required_document_category VARCHAR(100), -- If completing requires uploading a passport, contract, etc.
    uploaded_document_id UUID REFERENCES documents(id) ON DELETE SET NULL,
    assigned_role VARCHAR(100) DEFAULT 'employee', -- employee, hr, manager
    due_date DATE,
    completed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

--------------------------------------------------------------------------------
-- 9. INTEGRATIONS, REPORTS, DATA POLICY
--------------------------------------------------------------------------------

CREATE TABLE integration_accounts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    provider_name VARCHAR(100) NOT NULL, -- google_workspace, microsoft_365, workday, slack
    status VARCHAR(50) NOT NULL DEFAULT 'disconnected', -- active, disconnected, expired
    auth_credentials_encrypted BYTEA, -- Encrypted at application layer
    scopes JSONB NOT NULL DEFAULT '[]',
    last_connected_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE integration_events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    integration_account_id UUID NOT NULL REFERENCES integration_accounts(id) ON DELETE CASCADE,
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    direction VARCHAR(10) NOT NULL, -- inbound, outbound
    event_type VARCHAR(100) NOT NULL, -- webhook_received, api_sent
    status VARCHAR(50) NOT NULL, -- success, failure
    payload JSONB,
    error_message TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE analytics_metrics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    metric_name VARCHAR(100) NOT NULL, -- e.g. head_count, employee_turnover, request_resolution_time
    metric_value DECIMAL(12, 4) NOT NULL,
    dimensions JSONB NOT NULL DEFAULT '{}', -- E.g. department_id, period_month
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE reports (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    report_type VARCHAR(100) NOT NULL, -- operations, recruitment, onboarding, email_workload
    status VARCHAR(50) NOT NULL DEFAULT 'draft', -- draft, ready
    compiled_by_user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    compiled_by_agent_run_id UUID REFERENCES agent_runs(id) ON DELETE SET NULL,
    source_data_summary JSONB NOT NULL DEFAULT '{}',
    ai_interpretation TEXT,
    recommendations TEXT,
    file_path VARCHAR(512),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE data_retention_rules (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    data_category VARCHAR(100) NOT NULL, -- audit_logs, employee_sensitive, document_drafts, candidates
    retention_period_days INTEGER NOT NULL,
    action_on_expiry VARCHAR(50) NOT NULL DEFAULT 'archive', -- delete, archive, anonymize
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uniq_org_category UNIQUE (organization_id, data_category)
);

CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'unread', -- unread, read, archived
    action_url VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

--------------------------------------------------------------------------------
-- 10. INDEXES FOR PERFORMANCE & SAFETY
--------------------------------------------------------------------------------

-- Tenant Index Optimization (Critical to prevent cross-tenant leak during lookups)
CREATE INDEX idx_users_org ON users(organization_id);
CREATE INDEX idx_employees_org ON employees(organization_id);
CREATE INDEX idx_employee_profiles_org ON employee_profiles(organization_id);
CREATE INDEX idx_documents_org ON documents(organization_id);
CREATE INDEX idx_document_versions_doc ON document_versions(document_id);
CREATE INDEX idx_knowledge_chunks_org ON knowledge_chunks(organization_id);
CREATE INDEX idx_knowledge_chunks_doc ON knowledge_chunks(document_version_id);
CREATE INDEX idx_policies_org ON policies(organization_id);
CREATE INDEX idx_conversations_org ON conversations(organization_id);
CREATE INDEX idx_conversation_messages_conv ON conversation_messages(conversation_id);
CREATE INDEX idx_agent_runs_org ON agent_runs(organization_id);
CREATE INDEX idx_agent_messages_run ON agent_messages(agent_run_id);
CREATE INDEX idx_employee_requests_org ON employee_requests(organization_id);
CREATE INDEX idx_tasks_org ON tasks(organization_id);
CREATE INDEX idx_approvals_org ON approvals(organization_id);
CREATE INDEX idx_audit_logs_org ON audit_logs(organization_id);
CREATE INDEX idx_candidates_org ON candidates(organization_id);
CREATE INDEX idx_candidates_job ON candidates(recruitment_job_id);
CREATE INDEX idx_onboarding_tasks_workflow ON onboarding_tasks(onboarding_workflow_id);
CREATE INDEX idx_analytics_metrics_org_name ON analytics_metrics(organization_id, metric_name);
CREATE INDEX idx_reports_org ON reports(organization_id);

--------------------------------------------------------------------------------
-- 11. SECURITY STRATEGY (ROW-LEVEL SECURITY)
--------------------------------------------------------------------------------
-- RLS triggers secure isolation where no query can execute without organization context.
-- In a typical PostgreSQL configuration, we would enable RLS on all tenant-scoped tables:
--
-- ALTER TABLE users ENABLE ROW LEVEL SECURITY;
-- CREATE POLICY tenant_isolation_policy ON users
--     USING (organization_id = current_setting('app.current_organization_id')::uuid);
--
-- This configuration will be documented in the SECURITY.md and implemented in the database initialization.
