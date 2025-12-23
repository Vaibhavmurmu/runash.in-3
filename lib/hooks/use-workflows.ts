"use client"

import { useEffect, useState } from "react"
import { neon } from "@/lib/neon/client"
import type { Database } from "@/lib/neon/types"
import { v4 as uuidv4 } from "uuid"

export type Workflow = Database["public"]["Tables"]["automation_workflows"]["Row"]
export type WorkflowInsert = Database["public"]["Tables"]["automation_workflows"]["Insert"]
export type WorkflowUpdate = Database["public"]["Tables"]["automation_workflows"]["Update"]
export type WorkflowExecution = Database["public"]["Tables"]["workflow_executions"]["Row"]
export type WorkflowTemplate = Database["public"]["Tables"]["workflow_templates"]["Row"]

export interface WorkflowStep {
  id: string
  type: string
  name: string
  config: Record<string, any>
  enabled: boolean
}

export interface WorkflowTrigger {
  type: "manual" | "schedule" | "event" | "webhook"
  config: Record<string, any>
}

export function useWorkflows(userId?: string) {
  const [workflows, setWorkflows] = useState<Workflow[]>([])
  const [templates, setTemplates] = useState<WorkflowTemplate[]>([])
  const [executions, setExecutions] = useState<WorkflowExecution[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (userId) {
      fetchWorkflows()
      fetchTemplates()
      fetchExecutions()
      subscribeToWorkflows()
    }
  }, [userId])

  const fetchWorkflows = async () => {
    try {
      setLoading(true)
      const { data, error } = await neon
        .from("automation_workflows")
        .select("*")
        .eq("user_id", userId!)
        .order("created_at", { ascending: false })

      if (error) throw error
      setWorkflows(data || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setLoading(false)
    }
  }

  const fetchTemplates = async () => {
    try {
      const { data, error } = await neon
        .from("workflow_templates")
        .select("*")
        .eq("is_public", true)
        .order("usage_count", { ascending: false })

      if (error) throw error
      setTemplates(data || [])
    } catch (err) {
      console.error("Error fetching templates:", err)
    }
  }

  const fetchExecutions = async () => {
    try {
      const { data, error } = await neon
        .from("workflow_executions")
        .select(`
          *,
          automation_workflows!inner(user_id)
        `)
        .eq("automation_workflows.user_id", userId!)
        .order("started_at", { ascending: false })
        .limit(50)

      if (error) throw error
      setExecutions(data || [])
    } catch (err) {
      console.error("Error fetching executions:", err)
    }
  }

  const subscribeToWorkflows = () => {
    const subscription = neon
      .channel("workflows")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "automation_workflows",
          filter: `user_id=eq.${userId}`,
        },
        (payload) => {
          if (payload.eventType === "INSERT") {
            setWorkflows((prev) => [payload.new as Workflow, ...prev])
          } else if (payload.eventType === "UPDATE") {
            setWorkflows((prev) => prev.map((w) => (w.id === payload.new.id ? (payload.new as Workflow) : w)))
          } else if (payload.eventType === "DELETE") {
            setWorkflows((prev) => prev.filter((w) => w.id !== payload.old.id))
          }
        },
      )
      .subscribe()

    return () => subscription.unsubscribe()
  }

  const createWorkflow = async (workflowData: Omit<WorkflowInsert, "id" | "user_id">) => {
    try {
      const newWorkflow: WorkflowInsert = {
        id: uuidv4(),
        user_id: userId!,
        ...workflowData,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }

      const { data, error } = await neon.from("automation_workflows").insert(newWorkflow).select().single()

      if (error) throw error
      return { data, error: null }
    } catch (err) {
      return { data: null, error: err instanceof Error ? err.message : "An error occurred" }
    }
  }

  const updateWorkflow = async (id: string, updates: WorkflowUpdate) => {
    try {
      const { data, error } = await neon
        .from("automation_workflows")
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq("id", id)
        .select()
        .single()

      if (error) throw error
      return { data, error: null }
    } catch (err) {
      return { data: null, error: err instanceof Error ? err.message : "An error occurred" }
    }
  }

  const deleteWorkflow = async (id: string) => {
    try {
      const { error } = await neon.from("automation_workflows").delete().eq("id", id)

      if (error) throw error
      return { error: null }
    } catch (err) {
      return { error: err instanceof Error ? err.message : "An error occurred" }
    }
  }

  const executeWorkflow = async (id: string, inputData?: Record<string, any>) => {
    try {
      const executionId = uuidv4()
      const workflow = workflows.find((w) => w.id === id)

      if (!workflow) throw new Error("Workflow not found")

      const { data, error } = await neon
        .from("workflow_executions")
        .insert({
          id: executionId,
          workflow_id: id,
          status: "running",
          execution_data: inputData || {},
          total_steps: Array.isArray(workflow.workflow_steps) ? workflow.workflow_steps.length : 0,
        })
        .select()
        .single()

      if (error) throw error

      // Update workflow execution count
      await neon
        .from("automation_workflows")
        .update({
          execution_count: workflow.execution_count + 1,
          last_executed_at: new Date().toISOString(),
        })
        .eq("id", id)

      return { data, error: null }
    } catch (err) {
      return { data: null, error: err instanceof Error ? err.message : "An error occurred" }
    }
  }

  const toggleWorkflow = async (id: string, enabled: boolean) => {
    return updateWorkflow(id, { enabled, status: enabled ? "active" : "paused" })
  }

  const createFromTemplate = async (templateId: string, customizations?: Partial<WorkflowInsert>) => {
    try {
      const template = templates.find((t) => t.id === templateId)
      if (!template) throw new Error("Template not found")

      const templateData = template.template_data as any
      const workflowData: Omit<WorkflowInsert, "id" | "user_id"> = {
        name: customizations?.name || template.name,
        description: customizations?.description || template.description,
        category: template.category as any,
        trigger_type: templateData.trigger?.type || "manual",
        trigger_config: templateData.trigger?.config || {},
        workflow_steps: templateData.steps || [],
        ...customizations,
      }

      const result = await createWorkflow(workflowData)

      if (result.data) {
        // Update template usage count
        await neon
          .from("workflow_templates")
          .update({ usage_count: template.usage_count + 1 })
          .eq("id", templateId)
      }

      return result
    } catch (err) {
      return { data: null, error: err instanceof Error ? err.message : "An error occurred" }
    }
  }

  return {
    workflows,
    templates,
    executions,
    loading,
    error,
    createWorkflow,
    updateWorkflow,
    deleteWorkflow,
    executeWorkflow,
    toggleWorkflow,
    createFromTemplate,
    refetch: fetchWorkflows,
  }
  }
