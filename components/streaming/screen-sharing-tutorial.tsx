"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Steps, Step } from "@/components/ui/steps"
import { Monitor, Presentation, Settings, Users, CheckCircle2 } from "lucide-react"

export default function ScreenSharingTutorial() {
  const [currentStep, setCurrentStep] = useState(0)
  const [tutorialComplete, setTutorialComplete] = useState(false)

  const steps = [
    {
      title: "Select Screen Sharing",
      description: "Click on the 'Sources' tab in the left panel, then select 'Screen Share'.",
      icon: <Monitor className="h-5 w-5" />,
    },
    {
      title: "Choose What to Share",
      description: "Select whether to share your entire screen, an application window, or a browser tab.",
      icon: <Presentation className="h-5 w-5" />,
    },
    {
      title: "Configure Settings",
      description: "Adjust frame rate, cursor visibility, and audio capture options as needed.",
      icon: <Settings className="h-5 w-5" />,
    },
    {
      title: "Start Sharing",
      description: "Click 'Start Sharing' to begin. Your audience will now see your screen.",
      icon: <Users className="h-5 w-5" />,
    },
  ]

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      setTutorialComplete(true)
    }
  }

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const resetTutorial = () => {
    setCurrentStep(0)
    setTutorialComplete(false)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl font-bold">Screen Sharing Tutorial</CardTitle>
        <CardDescription>Learn how to share your screen for tutorials and demonstrations</CardDescription>
      </CardHeader>
      <CardContent>
        {tutorialComplete ? (
          <div className="flex flex-col items-center py-6 text-center">
            <div className="rounded-full bg-green-100 dark:bg-green-900/20 p-3 mb-4">
              <CheckCircle2 className="h-8 w-8 text-green-600 dark:text-green-400" />
            </div>
            <h3 className="text-xl font-medium mb-2">You're Ready to Share!</h3>
            <p className="text-gray-500 dark:text-gray-400 mb-6">
              You now know how to use screen sharing for your tutorials and demonstrations.
            </p>
            <Button variant="outline" onClick={resetTutorial}>
              Restart Tutorial
            </Button>
          </div>
        ) : (
          <>
            <Steps currentStep={currentStep} className="mb-8">
              {steps.map((step, index) => (
                <Step key={index} title={step.title} icon={step.icon} />
              ))}
            </Steps>

            <div className="py-4">
              <h3 className="text-lg font-medium mb-2 flex items-center">
                {steps[currentStep].icon}
                <span className="ml-2">{steps[currentStep].title}</span>
              </h3>
              <p className="text-gray-600 dark:text-gray-400">{steps[currentStep].description}</p>
            </div>
          </>
        )}
      </CardContent>
      {!tutorialComplete && (
        <CardFooter className="flex justify-between">
          <Button variant="outline" onClick={prevStep} disabled={currentStep === 0}>
            Previous
          </Button>
          <Button onClick={nextStep}>{currentStep === steps.length - 1 ? "Finish" : "Next"}</Button>
        </CardFooter>
      )}
    </Card>
  )
}
