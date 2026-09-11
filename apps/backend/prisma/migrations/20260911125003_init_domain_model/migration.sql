-- CreateEnum
CREATE TYPE "RoleName" AS ENUM ('ADMIN', 'ENGINEER', 'REVIEWER', 'VIEWER');

-- CreateEnum
CREATE TYPE "ProductRevisionStatus" AS ENUM ('DRAFT', 'PROTOTYPING', 'IN_REVIEW', 'APPROVED', 'RELEASED', 'DEPRECATED');

-- CreateEnum
CREATE TYPE "RequirementPriority" AS ENUM ('LOW', 'MEDIUM', 'HIGH', 'CRITICAL');

-- CreateEnum
CREATE TYPE "RequirementRevisionStatus" AS ENUM ('DRAFT', 'IN_REVIEW', 'APPROVED', 'RELEASED', 'DEPRECATED');

-- CreateEnum
CREATE TYPE "DependencyRelationshipType" AS ENUM ('DEPENDS_ON', 'PART_OF', 'IMPLEMENTS', 'TESTS', 'DOCUMENTS');

-- CreateEnum
CREATE TYPE "ChangePriority" AS ENUM ('LOW', 'MEDIUM', 'HIGH', 'CRITICAL');

-- CreateEnum
CREATE TYPE "ChangeRequestStatus" AS ENUM ('DRAFT', 'SUBMITTED', 'IMPACT_ANALYSIS', 'UNDER_REVIEW', 'APPROVED', 'REJECTED', 'IMPLEMENTED', 'VERIFIED', 'RELEASED');

-- CreateEnum
CREATE TYPE "ImpactAnalysisStatus" AS ENUM ('PENDING', 'RUNNING', 'COMPLETED', 'FAILED');

-- CreateEnum
CREATE TYPE "ImpactType" AS ENUM ('DIRECT', 'INDIRECT', 'TRACEABILITY');

-- CreateEnum
CREATE TYPE "RiskLevel" AS ENUM ('LOW', 'MEDIUM', 'HIGH', 'CRITICAL');

-- CreateEnum
CREATE TYPE "WorkflowStateType" AS ENUM ('INITIAL', 'INTERMEDIATE', 'TERMINAL');

-- CreateEnum
CREATE TYPE "WorkflowTaskStatus" AS ENUM ('PENDING', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "DocumentRevisionStatus" AS ENUM ('DRAFT', 'IN_REVIEW', 'APPROVED', 'RELEASED', 'DEPRECATED');

-- CreateTable
CREATE TABLE "users" (
    "id" UUID NOT NULL,
    "email" VARCHAR NOT NULL,
    "password_hash" VARCHAR NOT NULL,
    "first_name" VARCHAR NOT NULL,
    "last_name" VARCHAR NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "roles" (
    "id" UUID NOT NULL,
    "name" "RoleName" NOT NULL,
    "description" VARCHAR,
    "permissions" TEXT[],
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "roles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_roles" (
    "user_id" UUID NOT NULL,
    "role_id" UUID NOT NULL,
    "assigned_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "user_roles_pkey" PRIMARY KEY ("user_id","role_id")
);

-- CreateTable
CREATE TABLE "products" (
    "id" UUID NOT NULL,
    "product_number" VARCHAR NOT NULL,
    "name" VARCHAR NOT NULL,
    "description" TEXT,
    "created_by" UUID,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "products_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "product_revisions" (
    "id" UUID NOT NULL,
    "product_id" UUID NOT NULL,
    "revision_number" INTEGER NOT NULL,
    "display_code" VARCHAR NOT NULL,
    "status" "ProductRevisionStatus" NOT NULL DEFAULT 'DRAFT',
    "description" TEXT,
    "created_by" UUID,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "product_revisions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "components" (
    "id" UUID NOT NULL,
    "component_number" VARCHAR NOT NULL,
    "name" VARCHAR NOT NULL,
    "type" VARCHAR,
    "description" TEXT,
    "created_by" UUID,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "components_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "component_revisions" (
    "id" UUID NOT NULL,
    "component_id" UUID NOT NULL,
    "revision_number" INTEGER NOT NULL,
    "display_code" VARCHAR NOT NULL,
    "status" "ProductRevisionStatus" NOT NULL DEFAULT 'DRAFT',
    "description" TEXT,
    "created_by" UUID,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "component_revisions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "boms" (
    "id" UUID NOT NULL,
    "product_revision_id" UUID NOT NULL,
    "created_by" UUID,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "boms_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "bom_items" (
    "id" UUID NOT NULL,
    "bom_id" UUID NOT NULL,
    "component_revision_id" UUID NOT NULL,
    "parent_bom_item_id" UUID,
    "quantity" INTEGER NOT NULL,
    "position" INTEGER,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "bom_items_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "chk_bom_items_quantity" CHECK ("quantity" > 0)
);

-- CreateTable
CREATE TABLE "requirements" (
    "id" UUID NOT NULL,
    "requirement_number" VARCHAR NOT NULL,
    "title" VARCHAR NOT NULL,
    "priority" "RequirementPriority",
    "created_by" UUID,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "requirements_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "requirement_revisions" (
    "id" UUID NOT NULL,
    "requirement_id" UUID NOT NULL,
    "revision_number" INTEGER NOT NULL,
    "display_code" VARCHAR NOT NULL,
    "content" TEXT NOT NULL,
    "status" "RequirementRevisionStatus" NOT NULL DEFAULT 'DRAFT',
    "created_by" UUID,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "requirement_revisions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "requirement_product_links" (
    "requirement_revision_id" UUID NOT NULL,
    "product_revision_id" UUID NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "requirement_product_links_pkey" PRIMARY KEY ("requirement_revision_id","product_revision_id")
);

-- CreateTable
CREATE TABLE "requirement_component_links" (
    "requirement_revision_id" UUID NOT NULL,
    "component_revision_id" UUID NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "requirement_component_links_pkey" PRIMARY KEY ("requirement_revision_id","component_revision_id")
);

-- CreateTable
CREATE TABLE "dependencies" (
    "id" UUID NOT NULL,
    "source_type" VARCHAR NOT NULL,
    "source_id" UUID NOT NULL,
    "target_type" VARCHAR NOT NULL,
    "target_id" UUID NOT NULL,
    "relationship_type" "DependencyRelationshipType" NOT NULL,
    "metadata" JSONB,
    "created_by" UUID,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "dependencies_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "change_requests" (
    "id" UUID NOT NULL,
    "change_number" VARCHAR NOT NULL,
    "title" VARCHAR NOT NULL,
    "description" TEXT,
    "reason" TEXT,
    "priority" "ChangePriority",
    "status" "ChangeRequestStatus" NOT NULL DEFAULT 'DRAFT',
    "requested_by" UUID,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "change_requests_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "change_items" (
    "id" UUID NOT NULL,
    "change_request_id" UUID NOT NULL,
    "entity_type" VARCHAR NOT NULL,
    "entity_id" UUID NOT NULL,
    "from_revision_id" UUID,
    "to_revision_id" UUID,
    "description" VARCHAR,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "change_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "impact_analyses" (
    "id" UUID NOT NULL,
    "change_request_id" UUID NOT NULL,
    "version" INTEGER NOT NULL,
    "status" "ImpactAnalysisStatus" NOT NULL DEFAULT 'PENDING',
    "algorithm_version" VARCHAR NOT NULL,
    "started_at" TIMESTAMPTZ,
    "completed_at" TIMESTAMPTZ,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "impact_analyses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "impact_results" (
    "id" UUID NOT NULL,
    "impact_analysis_id" UUID NOT NULL,
    "entity_type" VARCHAR NOT NULL,
    "entity_id" UUID NOT NULL,
    "entity_name" VARCHAR,
    "impact_type" "ImpactType" NOT NULL,
    "depth" INTEGER,
    "risk_level" "RiskLevel",
    "details" JSONB,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "impact_results_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "workflow_definitions" (
    "id" UUID NOT NULL,
    "name" VARCHAR NOT NULL,
    "description" VARCHAR,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "workflow_definitions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "workflow_states" (
    "id" UUID NOT NULL,
    "workflow_definition_id" UUID NOT NULL,
    "name" VARCHAR NOT NULL,
    "state_type" "WorkflowStateType" NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "workflow_states_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "workflow_transitions" (
    "id" UUID NOT NULL,
    "workflow_definition_id" UUID NOT NULL,
    "from_state_id" UUID NOT NULL,
    "to_state_id" UUID NOT NULL,
    "name" VARCHAR,
    "required_permission" VARCHAR,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "workflow_transitions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "workflow_instances" (
    "id" UUID NOT NULL,
    "workflow_definition_id" UUID NOT NULL,
    "current_state_id" UUID NOT NULL,
    "entity_type" VARCHAR NOT NULL,
    "entity_id" UUID NOT NULL,
    "started_at" TIMESTAMPTZ NOT NULL,
    "completed_at" TIMESTAMPTZ,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "workflow_instances_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "workflow_tasks" (
    "id" UUID NOT NULL,
    "workflow_instance_id" UUID NOT NULL,
    "assigned_to" UUID NOT NULL,
    "task_type" VARCHAR NOT NULL,
    "status" "WorkflowTaskStatus" NOT NULL DEFAULT 'PENDING',
    "description" VARCHAR,
    "due_date" TIMESTAMPTZ,
    "completed_at" TIMESTAMPTZ,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "workflow_tasks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "documents" (
    "id" UUID NOT NULL,
    "document_number" VARCHAR NOT NULL,
    "title" VARCHAR NOT NULL,
    "type" VARCHAR,
    "created_by" UUID,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "documents_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "document_revisions" (
    "id" UUID NOT NULL,
    "document_id" UUID NOT NULL,
    "revision_number" INTEGER NOT NULL,
    "display_code" VARCHAR NOT NULL,
    "status" "DocumentRevisionStatus" NOT NULL DEFAULT 'DRAFT',
    "content" TEXT,
    "created_by" UUID,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "document_revisions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "audit_events" (
    "id" UUID NOT NULL,
    "actor_id" UUID,
    "action" VARCHAR NOT NULL,
    "entity_type" VARCHAR NOT NULL,
    "entity_id" UUID NOT NULL,
    "previous_state" JSONB,
    "new_state" JSONB,
    "metadata" JSONB,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "audit_events_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "roles_name_key" ON "roles"("name");

-- CreateIndex
CREATE UNIQUE INDEX "products_product_number_key" ON "products"("product_number");

-- CreateIndex
CREATE INDEX "idx_products_product_number" ON "products"("product_number");

-- CreateIndex
CREATE INDEX "idx_product_revisions_product_id" ON "product_revisions"("product_id", "revision_number");

-- CreateIndex
CREATE UNIQUE INDEX "product_revisions_product_id_revision_number_key" ON "product_revisions"("product_id", "revision_number");

-- CreateIndex
CREATE UNIQUE INDEX "components_component_number_key" ON "components"("component_number");

-- CreateIndex
CREATE INDEX "idx_components_component_number" ON "components"("component_number");

-- CreateIndex
CREATE INDEX "idx_component_revisions_component_id" ON "component_revisions"("component_id", "revision_number");

-- CreateIndex
CREATE UNIQUE INDEX "component_revisions_component_id_revision_number_key" ON "component_revisions"("component_id", "revision_number");

-- CreateIndex
CREATE UNIQUE INDEX "boms_product_revision_id_key" ON "boms"("product_revision_id");

-- CreateIndex
CREATE INDEX "idx_bom_items_bom_id" ON "bom_items"("bom_id");

-- CreateIndex
CREATE INDEX "idx_bom_items_parent" ON "bom_items"("parent_bom_item_id");

-- CreateIndex
CREATE INDEX "idx_bom_items_component_revision" ON "bom_items"("component_revision_id");

-- CreateIndex
CREATE UNIQUE INDEX "requirements_requirement_number_key" ON "requirements"("requirement_number");

-- CreateIndex
CREATE INDEX "idx_requirement_revisions_requirement_id" ON "requirement_revisions"("requirement_id", "revision_number");

-- CreateIndex
CREATE UNIQUE INDEX "requirement_revisions_requirement_id_revision_number_key" ON "requirement_revisions"("requirement_id", "revision_number");

-- CreateIndex
CREATE UNIQUE INDEX "dependencies_source_type_source_id_target_type_target_id_re_key" ON "dependencies"("source_type", "source_id", "target_type", "target_id", "relationship_type");

-- CreateIndex
CREATE UNIQUE INDEX "change_requests_change_number_key" ON "change_requests"("change_number");

-- CreateIndex
CREATE INDEX "idx_change_requests_number" ON "change_requests"("change_number");

-- CreateIndex
CREATE INDEX "idx_change_requests_status" ON "change_requests"("status");

-- CreateIndex
CREATE INDEX "idx_change_items_cr_id" ON "change_items"("change_request_id");

-- CreateIndex
CREATE INDEX "idx_impact_analyses_cr_id" ON "impact_analyses"("change_request_id");

-- CreateIndex
CREATE INDEX "idx_impact_results_analysis_id" ON "impact_results"("impact_analysis_id");

-- CreateIndex
CREATE UNIQUE INDEX "workflow_definitions_name_key" ON "workflow_definitions"("name");

-- CreateIndex
CREATE INDEX "idx_workflow_tasks_assigned" ON "workflow_tasks"("assigned_to", "status");

-- CreateIndex
CREATE UNIQUE INDEX "documents_document_number_key" ON "documents"("document_number");

-- CreateIndex
CREATE UNIQUE INDEX "document_revisions_document_id_revision_number_key" ON "document_revisions"("document_id", "revision_number");

-- CreateIndex
CREATE INDEX "idx_audit_events_entity" ON "audit_events"("entity_type", "entity_id");

-- CreateIndex
CREATE INDEX "idx_audit_events_created" ON "audit_events"("created_at");

-- AddForeignKey
ALTER TABLE "user_roles" ADD CONSTRAINT "user_roles_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_roles" ADD CONSTRAINT "user_roles_role_id_fkey" FOREIGN KEY ("role_id") REFERENCES "roles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "products" ADD CONSTRAINT "products_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product_revisions" ADD CONSTRAINT "product_revisions_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product_revisions" ADD CONSTRAINT "product_revisions_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "components" ADD CONSTRAINT "components_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "component_revisions" ADD CONSTRAINT "component_revisions_component_id_fkey" FOREIGN KEY ("component_id") REFERENCES "components"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "component_revisions" ADD CONSTRAINT "component_revisions_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "boms" ADD CONSTRAINT "boms_product_revision_id_fkey" FOREIGN KEY ("product_revision_id") REFERENCES "product_revisions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "boms" ADD CONSTRAINT "boms_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bom_items" ADD CONSTRAINT "bom_items_bom_id_fkey" FOREIGN KEY ("bom_id") REFERENCES "boms"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bom_items" ADD CONSTRAINT "bom_items_component_revision_id_fkey" FOREIGN KEY ("component_revision_id") REFERENCES "component_revisions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bom_items" ADD CONSTRAINT "bom_items_parent_bom_item_id_fkey" FOREIGN KEY ("parent_bom_item_id") REFERENCES "bom_items"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "requirements" ADD CONSTRAINT "requirements_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "requirement_revisions" ADD CONSTRAINT "requirement_revisions_requirement_id_fkey" FOREIGN KEY ("requirement_id") REFERENCES "requirements"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "requirement_revisions" ADD CONSTRAINT "requirement_revisions_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "requirement_product_links" ADD CONSTRAINT "requirement_product_links_requirement_revision_id_fkey" FOREIGN KEY ("requirement_revision_id") REFERENCES "requirement_revisions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "requirement_product_links" ADD CONSTRAINT "requirement_product_links_product_revision_id_fkey" FOREIGN KEY ("product_revision_id") REFERENCES "product_revisions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "requirement_component_links" ADD CONSTRAINT "requirement_component_links_requirement_revision_id_fkey" FOREIGN KEY ("requirement_revision_id") REFERENCES "requirement_revisions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "requirement_component_links" ADD CONSTRAINT "requirement_component_links_component_revision_id_fkey" FOREIGN KEY ("component_revision_id") REFERENCES "component_revisions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "dependencies" ADD CONSTRAINT "dependencies_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "change_requests" ADD CONSTRAINT "change_requests_requested_by_fkey" FOREIGN KEY ("requested_by") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "change_items" ADD CONSTRAINT "change_items_change_request_id_fkey" FOREIGN KEY ("change_request_id") REFERENCES "change_requests"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "impact_analyses" ADD CONSTRAINT "impact_analyses_change_request_id_fkey" FOREIGN KEY ("change_request_id") REFERENCES "change_requests"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "impact_results" ADD CONSTRAINT "impact_results_impact_analysis_id_fkey" FOREIGN KEY ("impact_analysis_id") REFERENCES "impact_analyses"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "workflow_states" ADD CONSTRAINT "workflow_states_workflow_definition_id_fkey" FOREIGN KEY ("workflow_definition_id") REFERENCES "workflow_definitions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "workflow_transitions" ADD CONSTRAINT "workflow_transitions_workflow_definition_id_fkey" FOREIGN KEY ("workflow_definition_id") REFERENCES "workflow_definitions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "workflow_transitions" ADD CONSTRAINT "workflow_transitions_from_state_id_fkey" FOREIGN KEY ("from_state_id") REFERENCES "workflow_states"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "workflow_transitions" ADD CONSTRAINT "workflow_transitions_to_state_id_fkey" FOREIGN KEY ("to_state_id") REFERENCES "workflow_states"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "workflow_instances" ADD CONSTRAINT "workflow_instances_workflow_definition_id_fkey" FOREIGN KEY ("workflow_definition_id") REFERENCES "workflow_definitions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "workflow_instances" ADD CONSTRAINT "workflow_instances_current_state_id_fkey" FOREIGN KEY ("current_state_id") REFERENCES "workflow_states"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "workflow_tasks" ADD CONSTRAINT "workflow_tasks_workflow_instance_id_fkey" FOREIGN KEY ("workflow_instance_id") REFERENCES "workflow_instances"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "workflow_tasks" ADD CONSTRAINT "workflow_tasks_assigned_to_fkey" FOREIGN KEY ("assigned_to") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "documents" ADD CONSTRAINT "documents_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "document_revisions" ADD CONSTRAINT "document_revisions_document_id_fkey" FOREIGN KEY ("document_id") REFERENCES "documents"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "document_revisions" ADD CONSTRAINT "document_revisions_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "audit_events" ADD CONSTRAINT "audit_events_actor_id_fkey" FOREIGN KEY ("actor_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
