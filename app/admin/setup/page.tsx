import { OpenAISetupGuide } from "@/components/openai-setup-guide"

export default function AdminSetupPage() {
  return (
    <div className="container mx-auto py-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">System Setup</h1>
        <p className="text-muted-foreground">Configure OpenAI API and other system components</p>
      </div>

      <OpenAISetupGuide />
    </div>
  )
}
