"use client"

import { useState, useEffect } from "react"
import {
  Sparkles,
  Zap,
  Heart,
  Star,
  Palette,
  Play,
  Pause,
  RotateCcw,
  Settings,
  Send,
  QrCode,
  Wallet,
  CreditCard,
  ArrowRight,
  Eye,
  Camera,
  Download,
  Moon,
  Sun,
  Volume2,
  VolumeX,
} from "lucide-react"
import {
  GlassCard,
  GlassCardContent,
  GlassCardHeader,
  GlassCardTitle,
  GlassCardDescription,
} from "@/components/ui/glass-card"
import { GlassButton } from "@/components/ui/glass-button"
import {
  GlassModal,
  GlassModalContent,
  GlassModalHeader,
  GlassModalTitle,
  GlassModalDescription,
  GlassModalTrigger,
} from "@/components/ui/glass-modal"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CameraPreview } from "@/components/camera/camera-preview"
import { InstallPrompt } from "@/components/pwa/install-prompt"

export default function ShowcasePage() {
  const [isPlaying, setIsPlaying] = useState(false)
  const [glowIntensity, setGlowIntensity] = useState([50])
  const [blurIntensity, setBlurIntensity] = useState([10])
  const [animationSpeed, setAnimationSpeed] = useState([1])
  const [showEffects, setShowEffects] = useState(true)
  const [soundEnabled, setSoundEnabled] = useState(false)
  const [darkMode, setDarkMode] = useState(false)
  const [selectedVariant, setSelectedVariant] = useState<"default" | "orange" | "yellow" | "white" | "subtle">(
    "default",
  )
  const [selectedEffect, setSelectedEffect] = useState<"none" | "float" | "glow" | "shimmer" | "morph">("none")
  const [activeTab, setActiveTab] = useState("controls")
  const [showCamera, setShowCamera] = useState(false)

  // Real-time style updates
  const [dynamicStyles, setDynamicStyles] = useState({
    glowColor: "rgba(251, 146, 60, 0.5)",
    blurAmount: "10px",
    animationDuration: "3s",
  })

  useEffect(() => {
    setDynamicStyles({
      glowColor: `rgba(251, 146, 60, ${glowIntensity[0] / 100})`,
      blurAmount: `${blurIntensity[0]}px`,
      animationDuration: `${3 / animationSpeed[0]}s`,
    })
  }, [glowIntensity, blurIntensity, animationSpeed])

  const variants = [
    { name: "default", label: "Default", color: "from-white/40 to-orange-50/20", description: "Balanced transparency" },
    { name: "orange", label: "Orange", color: "from-orange-400/60 to-yellow-300/30", description: "Warm orange tones" },
    {
      name: "yellow",
      label: "Yellow",
      color: "from-yellow-300/50 to-orange-200/30",
      description: "Bright yellow accent",
    },
    { name: "white", label: "White", color: "from-white/70 to-orange-50/30", description: "Clean white base" },
    { name: "subtle", label: "Subtle", color: "from-white/20 to-yellow-50/5", description: "Minimal transparency" },
  ] as const

  const effects = [
    { name: "none", label: "None", icon: Eye, description: "Static appearance" },
    { name: "float", label: "Float", icon: Sparkles, description: "Gentle floating motion" },
    { name: "glow", label: "Glow", icon: Zap, description: "Pulsing glow effect" },
    { name: "shimmer", label: "Shimmer", icon: Star, description: "Light shimmer animation" },
    { name: "morph", label: "Morph", icon: RotateCcw, description: "Shape morphing borders" },
  ] as const

  const playSound = (type: "click" | "hover" | "success") => {
    if (!soundEnabled) return
    // In a real app, you'd play actual sounds here
    console.log(`Playing ${type} sound`)
  }

  return (
    <div className={`min-h-screen liquid-bg particles transition-all duration-500 ${darkMode ? "dark" : ""}`}>
      {/* Dynamic Styles */}
      <style jsx global>{`
        .dynamic-glow {
          box-shadow: 0 0 20px ${dynamicStyles.glowColor}, 0 0 40px ${dynamicStyles.glowColor};
        }
        .dynamic-blur {
          backdrop-filter: blur(${dynamicStyles.blurAmount});
          -webkit-backdrop-filter: blur(${dynamicStyles.blurAmount});
        }
        .dynamic-animation {
          animation-duration: ${dynamicStyles.animationDuration};
        }
      `}</style>

      {/* Header */}
      <header className="sticky top-0 z-50 glass-morphism border-b border-white/20 backdrop-blur-xl">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 glass-orange rounded-xl flex items-center justify-center pulse-glow">
                <Palette className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold gradient-text">Glass Components Showcase</h1>
                <p className="text-sm text-orange-600/70">Interactive liquid glass design system</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <GlassButton
                variant="white"
                size="sm"
                onClick={() => setDarkMode(!darkMode)}
                onMouseEnter={() => playSound("hover")}
              >
                {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              </GlassButton>
              <GlassButton
                variant="orange"
                effect="shimmer"
                size="sm"
                onClick={() => setSoundEnabled(!soundEnabled)}
                onMouseEnter={() => playSound("hover")}
              >
                {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
              </GlassButton>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 space-y-8">
        {/* Main Controls Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="glass-white rounded-2xl p-1 mb-6">
            <TabsList className="grid w-full grid-cols-4 bg-transparent">
              <TabsTrigger value="controls" className="glass-button-tab">
                <Settings className="w-4 h-4 mr-2" />
                Controls
              </TabsTrigger>
              <TabsTrigger value="components" className="glass-button-tab">
                <Sparkles className="w-4 h-4 mr-2" />
                Components
              </TabsTrigger>
              <TabsTrigger value="demo" className="glass-button-tab">
                <Wallet className="w-4 h-4 mr-2" />
                Demo
              </TabsTrigger>
              <TabsTrigger value="camera" className="glass-button-tab">
                <Camera className="w-4 h-4 mr-2" />
                Camera
              </TabsTrigger>
            </TabsList>
          </div>

          {/* Controls Tab */}
          <TabsContent value="controls" className="space-y-6">
            <GlassCard variant="white" className="hover-lift">
              <GlassCardHeader>
                <GlassCardTitle className="flex items-center gap-2">
                  <Settings className="w-6 h-6" />
                  Real-Time Controls
                  <Badge variant="secondary" className="ml-2">
                    Live
                  </Badge>
                </GlassCardTitle>
                <GlassCardDescription>Adjust glass properties and see changes instantly</GlassCardDescription>
              </GlassCardHeader>
              <GlassCardContent className="space-y-8">
                {/* Variant Selector */}
                <div className="space-y-4">
                  <Label className="text-base font-semibold text-orange-800 flex items-center gap-2">
                    <Palette className="w-4 h-4" />
                    Glass Variant
                  </Label>
                  <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
                    {variants.map((variant) => (
                      <div key={variant.name} className="space-y-2">
                        <GlassButton
                          variant={selectedVariant === variant.name ? "orange" : "white"}
                          size="sm"
                          onClick={() => {
                            setSelectedVariant(variant.name)
                            playSound("click")
                          }}
                          onMouseEnter={() => playSound("hover")}
                          className="w-full"
                        >
                          {variant.label}
                        </GlassButton>
                        <p className="text-xs text-orange-600/70 text-center">{variant.description}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Effect Selector */}
                <div className="space-y-4">
                  <Label className="text-base font-semibold text-orange-800 flex items-center gap-2">
                    <Zap className="w-4 h-4" />
                    Visual Effects
                  </Label>
                  <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
                    {effects.map((effect) => (
                      <div key={effect.name} className="space-y-2">
                        <GlassButton
                          variant={selectedEffect === effect.name ? "orange" : "white"}
                          size="sm"
                          onClick={() => {
                            setSelectedEffect(effect.name)
                            playSound("click")
                          }}
                          onMouseEnter={() => playSound("hover")}
                          className="w-full flex items-center gap-2"
                        >
                          <effect.icon className="w-3 h-3" />
                          {effect.label}
                        </GlassButton>
                        <p className="text-xs text-orange-600/70 text-center">{effect.description}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Intensity Controls */}
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="space-y-3">
                    <Label className="text-sm font-medium text-orange-800 flex items-center gap-2">
                      <Zap className="w-4 h-4" />
                      Glow Intensity
                    </Label>
                    <Slider
                      value={glowIntensity}
                      onValueChange={setGlowIntensity}
                      max={100}
                      step={1}
                      className="w-full"
                    />
                    <div className="flex justify-between text-xs text-orange-600/70">
                      <span>Subtle</span>
                      <span className="font-medium">{glowIntensity[0]}%</span>
                      <span>Intense</span>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <Label className="text-sm font-medium text-orange-800 flex items-center gap-2">
                      <Eye className="w-4 h-4" />
                      Blur Amount
                    </Label>
                    <Slider
                      value={blurIntensity}
                      onValueChange={setBlurIntensity}
                      max={20}
                      min={2}
                      step={1}
                      className="w-full"
                    />
                    <div className="flex justify-between text-xs text-orange-600/70">
                      <span>Sharp</span>
                      <span className="font-medium">{blurIntensity[0]}px</span>
                      <span>Blurred</span>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <Label className="text-sm font-medium text-orange-800 flex items-center gap-2">
                      <RotateCcw className="w-4 h-4" />
                      Animation Speed
                    </Label>
                    <Slider
                      value={animationSpeed}
                      onValueChange={setAnimationSpeed}
                      max={3}
                      min={0.5}
                      step={0.1}
                      className="w-full"
                    />
                    <div className="flex justify-between text-xs text-orange-600/70">
                      <span>Slow</span>
                      <span className="font-medium">{animationSpeed[0]}x</span>
                      <span>Fast</span>
                    </div>
                  </div>
                </div>

                {/* Toggle Controls */}
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="flex items-center justify-between p-4 glass-subtle rounded-xl">
                    <div>
                      <Label className="text-sm font-medium text-orange-800">Show All Effects</Label>
                      <p className="text-xs text-orange-600/70">Enable global effect visibility</p>
                    </div>
                    <Switch checked={showEffects} onCheckedChange={setShowEffects} />
                  </div>
                  <div className="flex items-center justify-between p-4 glass-subtle rounded-xl">
                    <div>
                      <Label className="text-sm font-medium text-orange-800">Sound Feedback</Label>
                      <p className="text-xs text-orange-600/70">Audio cues for interactions</p>
                    </div>
                    <Switch checked={soundEnabled} onCheckedChange={setSoundEnabled} />
                  </div>
                </div>
              </GlassCardContent>
            </GlassCard>

            {/* Live Preview */}
            <GlassCard
              variant={selectedVariant}
              effect={selectedEffect}
              className={`hover-lift transition-all duration-500 ${showEffects ? "dynamic-glow dynamic-blur dynamic-animation" : ""}`}
            >
              <GlassCardHeader>
                <GlassCardTitle>Live Preview</GlassCardTitle>
                <GlassCardDescription>
                  Current: {variants.find((v) => v.name === selectedVariant)?.label} variant with{" "}
                  {effects.find((e) => e.name === selectedEffect)?.label} effect
                </GlassCardDescription>
              </GlassCardHeader>
              <GlassCardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h3 className="font-semibold gradient-text">Dynamic Content</h3>
                    <p className="text-sm text-orange-700/80">
                      This card updates in real-time as you adjust the controls. The glow intensity is at{" "}
                      {glowIntensity[0]}%, blur is {blurIntensity[0]}px, and animations run at {animationSpeed[0]}x
                      speed.
                    </p>
                    <div className="flex gap-2">
                      <GlassButton
                        variant="orange"
                        size="sm"
                        effect="shimmer"
                        onClick={() => playSound("success")}
                        onMouseEnter={() => playSound("hover")}
                      >
                        <Send className="w-4 h-4 mr-2" />
                        Send Money
                      </GlassButton>
                      <GlassButton
                        variant="yellow"
                        size="sm"
                        effect="glow"
                        onClick={() => playSound("success")}
                        onMouseEnter={() => playSound("hover")}
                      >
                        <QrCode className="w-4 h-4 mr-2" />
                        Scan QR
                      </GlassButton>
                    </div>
                  </div>
                  <div className="glass-input p-4 rounded-xl">
                    <h4 className="font-medium gradient-text mb-3">Interactive Form</h4>
                    <div className="space-y-3">
                      <div>
                        <Label className="text-xs text-orange-700">Amount</Label>
                        <Input placeholder="₹ 0.00" className="glass-input mt-1" onChange={() => playSound("click")} />
                      </div>
                      <div>
                        <Label className="text-xs text-orange-700">Recipient</Label>
                        <Input
                          placeholder="Enter UPI ID or phone"
                          className="glass-input mt-1"
                          onChange={() => playSound("click")}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </GlassCardContent>
            </GlassCard>
          </TabsContent>

          {/* Components Tab */}
          <TabsContent value="components" className="space-y-6">
            <GlassCard variant="subtle" className="hover-lift">
              <GlassCardHeader>
                <GlassCardTitle>Component Gallery</GlassCardTitle>
                <GlassCardDescription>Explore all glass component variations</GlassCardDescription>
              </GlassCardHeader>
              <GlassCardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {/* Button Variations */}
                  <div className="space-y-4">
                    <h4 className="text-sm font-medium gradient-text">Button Variants</h4>
                    <div className="space-y-2">
                      <GlassButton
                        variant="default"
                        size="sm"
                        className="w-full"
                        onMouseEnter={() => playSound("hover")}
                      >
                        Default
                      </GlassButton>
                      <GlassButton
                        variant="orange"
                        size="sm"
                        className="w-full"
                        onMouseEnter={() => playSound("hover")}
                      >
                        Orange
                      </GlassButton>
                      <GlassButton
                        variant="yellow"
                        size="sm"
                        className="w-full"
                        onMouseEnter={() => playSound("hover")}
                      >
                        Yellow
                      </GlassButton>
                      <GlassButton variant="white" size="sm" className="w-full" onMouseEnter={() => playSound("hover")}>
                        White
                      </GlassButton>
                      <GlassButton
                        variant="subtle"
                        size="sm"
                        className="w-full"
                        onMouseEnter={() => playSound("hover")}
                      >
                        Subtle
                      </GlassButton>
                    </div>
                  </div>

                  {/* Effect Variations */}
                  <div className="space-y-4">
                    <h4 className="text-sm font-medium gradient-text">Effect Variants</h4>
                    <div className="space-y-2">
                      <GlassButton
                        variant="orange"
                        effect="none"
                        size="sm"
                        className="w-full"
                        onMouseEnter={() => playSound("hover")}
                      >
                        None
                      </GlassButton>
                      <GlassButton
                        variant="orange"
                        effect="shimmer"
                        size="sm"
                        className="w-full"
                        onMouseEnter={() => playSound("hover")}
                      >
                        Shimmer
                      </GlassButton>
                      <GlassButton
                        variant="orange"
                        effect="glow"
                        size="sm"
                        className="w-full"
                        onMouseEnter={() => playSound("hover")}
                      >
                        Glow
                      </GlassButton>
                      <GlassButton
                        variant="orange"
                        effect="float"
                        size="sm"
                        className="w-full"
                        onMouseEnter={() => playSound("hover")}
                      >
                        Float
                      </GlassButton>
                      <GlassButton
                        variant="orange"
                        effect="morph"
                        size="sm"
                        className="w-full"
                        onMouseEnter={() => playSound("hover")}
                      >
                        Morph
                      </GlassButton>
                    </div>
                  </div>

                  {/* Size Variations */}
                  <div className="space-y-4">
                    <h4 className="text-sm font-medium gradient-text">Size Variants</h4>
                    <div className="space-y-2">
                      <GlassButton
                        variant="yellow"
                        size="sm"
                        className="w-full"
                        onMouseEnter={() => playSound("hover")}
                      >
                        Small
                      </GlassButton>
                      <GlassButton
                        variant="yellow"
                        size="default"
                        className="w-full"
                        onMouseEnter={() => playSound("hover")}
                      >
                        Default
                      </GlassButton>
                      <GlassButton
                        variant="yellow"
                        size="lg"
                        className="w-full"
                        onMouseEnter={() => playSound("hover")}
                      >
                        Large
                      </GlassButton>
                      <div className="flex justify-center">
                        <GlassButton variant="yellow" size="icon" onMouseEnter={() => playSound("hover")}>
                          <Heart className="w-4 h-4" />
                        </GlassButton>
                      </div>
                    </div>
                  </div>

                  {/* Interactive Elements */}
                  <div className="space-y-4">
                    <h4 className="text-sm font-medium gradient-text">Interactive</h4>
                    <div className="space-y-2">
                      <GlassButton
                        variant="orange"
                        effect="shimmer"
                        size="sm"
                        className="w-full ripple-effect"
                        onClick={() => {
                          setIsPlaying(!isPlaying)
                          playSound("click")
                        }}
                        onMouseEnter={() => playSound("hover")}
                      >
                        {isPlaying ? <Pause className="w-4 h-4 mr-2" /> : <Play className="w-4 h-4 mr-2" />}
                        {isPlaying ? "Pause" : "Play"}
                      </GlassButton>

                      <GlassModal>
                        <GlassModalTrigger asChild>
                          <GlassButton
                            variant="yellow"
                            effect="glow"
                            size="sm"
                            className="w-full"
                            onMouseEnter={() => playSound("hover")}
                          >
                            Open Modal
                          </GlassButton>
                        </GlassModalTrigger>
                        <GlassModalContent>
                          <GlassModalHeader>
                            <GlassModalTitle>Interactive Glass Modal</GlassModalTitle>
                            <GlassModalDescription>
                              This modal demonstrates the glass morphism effect with backdrop blur and real-time
                              styling.
                            </GlassModalDescription>
                          </GlassModalHeader>
                          <div className="py-4">
                            <p className="text-sm text-orange-700/80 mb-4">
                              The modal inherits the current theme settings: {glowIntensity[0]}% glow intensity and{" "}
                              {blurIntensity[0]}px backdrop blur.
                            </p>
                            <div className="flex gap-2">
                              <GlassButton variant="orange" size="sm" onClick={() => playSound("success")}>
                                Confirm
                              </GlassButton>
                              <GlassButton variant="white" size="sm">
                                Cancel
                              </GlassButton>
                            </div>
                          </div>
                        </GlassModalContent>
                      </GlassModal>

                      <GlassButton
                        variant="white"
                        size="sm"
                        className="w-full hover-lift"
                        onMouseEnter={() => playSound("hover")}
                      >
                        Hover Effect
                      </GlassButton>
                    </div>
                  </div>
                </div>
              </GlassCardContent>
            </GlassCard>
          </TabsContent>

          {/* Demo Tab */}
          <TabsContent value="demo" className="space-y-6">
            <GlassCard variant="orange" effect="glow" className="hover-lift">
              <GlassCardHeader>
                <GlassCardTitle className="text-white">Payment App Demo</GlassCardTitle>
                <GlassCardDescription className="text-orange-100">
                  Experience the glass components in a real payment interface
                </GlassCardDescription>
              </GlassCardHeader>
              <GlassCardContent>
                <div className="grid md:grid-cols-3 gap-6 mb-6">
                  {/* Balance Card */}
                  <GlassCard variant="white" className="hover-lift">
                    <GlassCardContent className="p-4 text-center">
                      <Wallet className="w-8 h-8 mx-auto mb-2 text-orange-600" />
                      <p className="text-xs text-orange-600/70 mb-1">Balance</p>
                      <p className="text-xl font-bold gradient-text">₹12,450</p>
                      <p className="text-xs text-green-600 mt-1">+2.5% today</p>
                    </GlassCardContent>
                  </GlassCard>

                  {/* Quick Actions */}
                  <GlassCard variant="yellow" className="hover-lift">
                    <GlassCardContent className="p-4">
                      <h4 className="text-sm font-medium text-orange-800 mb-3">Quick Actions</h4>
                      <div className="grid grid-cols-2 gap-2">
                        <GlassButton
                          variant="orange"
                          size="sm"
                          effect="shimmer"
                          className="text-xs"
                          onClick={() => playSound("success")}
                          onMouseEnter={() => playSound("hover")}
                        >
                          <Send className="w-3 h-3 mr-1" />
                          Send
                        </GlassButton>
                        <GlassButton
                          variant="yellow"
                          size="sm"
                          effect="glow"
                          className="text-xs"
                          onClick={() => setShowCamera(true)}
                          onMouseEnter={() => playSound("hover")}
                        >
                          <QrCode className="w-3 h-3 mr-1" />
                          Scan
                        </GlassButton>
                        <GlassButton
                          variant="white"
                          size="sm"
                          className="text-xs col-span-2"
                          onClick={() => playSound("success")}
                          onMouseEnter={() => playSound("hover")}
                        >
                          <CreditCard className="w-3 h-3 mr-1" />
                          Pay Bills
                        </GlassButton>
                      </div>
                    </GlassCardContent>
                  </GlassCard>

                  {/* Recent Transaction */}
                  <GlassCard variant="subtle" className="hover-lift">
                    <GlassCardContent className="p-4">
                      <h4 className="text-sm font-medium gradient-text mb-3">Recent Transaction</h4>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <div className="w-8 h-8 glass-orange rounded-full flex items-center justify-center">
                              <ArrowRight className="w-4 h-4 text-white" />
                            </div>
                            <div>
                              <p className="text-xs font-medium text-orange-800">Coffee Shop</p>
                              <p className="text-xs text-orange-600/70">2 min ago</p>
                            </div>
                          </div>
                          <p className="text-sm font-bold text-red-600">-₹250</p>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <div className="w-8 h-8 glass-yellow rounded-full flex items-center justify-center">
                              <Download className="w-4 h-4 text-orange-800" />
                            </div>
                            <div>
                              <p className="text-xs font-medium text-orange-800">Salary Credit</p>
                              <p className="text-xs text-orange-600/70">1 hour ago</p>
                            </div>
                          </div>
                          <p className="text-sm font-bold text-green-600">+₹45,000</p>
                        </div>
                      </div>
                    </GlassCardContent>
                  </GlassCard>
                </div>

                {/* Payment Form */}
                <GlassCard variant="white" className="hover-lift">
                  <GlassCardHeader>
                    <GlassCardTitle>Send Money</GlassCardTitle>
                    <GlassCardDescription>Transfer funds instantly with glass UI</GlassCardDescription>
                  </GlassCardHeader>
                  <GlassCardContent>
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div>
                          <Label className="text-sm text-orange-700">Recipient</Label>
                          <Input
                            placeholder="Enter UPI ID or phone number"
                            className="glass-input mt-1"
                            onChange={() => playSound("click")}
                          />
                        </div>
                        <div>
                          <Label className="text-sm text-orange-700">Amount</Label>
                          <Input
                            placeholder="₹ 0.00"
                            className="glass-input mt-1"
                            onChange={() => playSound("click")}
                          />
                        </div>
                        <div>
                          <Label className="text-sm text-orange-700">Message (Optional)</Label>
                          <Input
                            placeholder="Add a note"
                            className="glass-input mt-1"
                            onChange={() => playSound("click")}
                          />
                        </div>
                      </div>
                      <div className="space-y-4">
                        <div className="glass-subtle p-4 rounded-xl">
                          <h4 className="font-medium gradient-text mb-2">Transaction Summary</h4>
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span className="text-orange-700/70">Amount:</span>
                              <span className="font-medium">₹0.00</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-orange-700/70">Fee:</span>
                              <span className="font-medium text-green-600">Free</span>
                            </div>
                            <div className="flex justify-between border-t border-orange-200/50 pt-2">
                              <span className="font-medium">Total:</span>
                              <span className="font-bold gradient-text">₹0.00</span>
                            </div>
                          </div>
                        </div>
                        <GlassButton
                          variant="orange"
                          effect="glow"
                          className="w-full"
                          onClick={() => playSound("success")}
                          onMouseEnter={() => playSound("hover")}
                        >
                          <Send className="w-4 h-4 mr-2" />
                          Send Money
                        </GlassButton>
                      </div>
                    </div>
                  </GlassCardContent>
                </GlassCard>

                <div className="text-center">
                  <GlassButton
                    variant="white"
                    size="lg"
                    effect="shimmer"
                    className="group"
                    onClick={() => playSound("success")}
                    onMouseEnter={() => playSound("hover")}
                  >
                    Experience Full App
                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </GlassButton>
                </div>
              </GlassCardContent>
            </GlassCard>
          </TabsContent>

          {/* Camera Tab */}
          <TabsContent value="camera" className="space-y-6">
            <GlassCard variant="orange" className="hover-lift">
              <GlassCardHeader>
                <GlassCardTitle className="text-white flex items-center gap-2">
                  <Camera className="w-6 h-6" />
                  Camera Integration
                </GlassCardTitle>
                <GlassCardDescription className="text-orange-100">
                  Glass-themed camera preview with QR scanning
                </GlassCardDescription>
              </GlassCardHeader>
              <GlassCardContent>
                <div className="space-y-6">
                  <div className="flex justify-center">
                    <GlassButton
                      variant="white"
                      size="lg"
                      onClick={() => setShowCamera(!showCamera)}
                      onMouseEnter={() => playSound("hover")}
                    >
                      <Camera className="w-5 h-5 mr-2" />
                      {showCamera ? "Close Camera" : "Open Camera"}
                    </GlassButton>
                  </div>

                  {showCamera && (
                    <div className="glass-white p-4 rounded-2xl">
                      <CameraPreview />
                    </div>
                  )}

                  <div className="grid md:grid-cols-2 gap-6">
                    <GlassCard variant="yellow" className="hover-lift">
                      <GlassCardContent className="p-4">
                        <h4 className="font-medium gradient-text mb-3">Camera Features</h4>
                        <ul className="text-sm text-orange-700/80 space-y-2">
                          <li>• Real-time video preview</li>
                          <li>• QR code scanning overlay</li>
                          <li>• Flash control toggle</li>
                          <li>• Front/back camera switching</li>
                          <li>• Glass-themed UI elements</li>
                        </ul>
                      </GlassCardContent>
                    </GlassCard>

                    <GlassCard variant="white" className="hover-lift">
                      <GlassCardContent className="p-4">
                        <h4 className="font-medium gradient-text mb-3">PWA Integration</h4>
                        <InstallPrompt />
                        <p className="text-sm text-orange-700/80 mt-3">
                          Install as a native app for the best camera experience with offline capabilities.
                        </p>
                      </GlassCardContent>
                    </GlassCard>
                  </div>
                </div>
              </GlassCardContent>
            </GlassCard>
          </TabsContent>
        </Tabs>

        {/* Technical Details */}
        <GlassCard variant="white" className="hover-lift">
          <GlassCardHeader>
            <GlassCardTitle>Technical Implementation</GlassCardTitle>
            <GlassCardDescription>Real-time styling and performance optimizations</GlassCardDescription>
          </GlassCardHeader>
          <GlassCardContent>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="space-y-4">
                <h4 className="font-semibold gradient-text">CSS Features</h4>
                <ul className="text-sm text-orange-700/80 space-y-2">
                  <li>• Dynamic CSS custom properties</li>
                  <li>• Real-time backdrop-filter updates</li>
                  <li>• Hardware-accelerated animations</li>
                  <li>• Responsive glass morphism</li>
                  <li>• Accessibility-first design</li>
                </ul>
              </div>
              <div className="space-y-4">
                <h4 className="font-semibold gradient-text">React Integration</h4>
                <ul className="text-sm text-orange-700/80 space-y-2">
                  <li>• Real-time state management</li>
                  <li>• Dynamic style injection</li>
                  <li>• Component composition</li>
                  <li>• TypeScript type safety</li>
                  <li>• Performance optimizations</li>
                </ul>
              </div>
              <div className="space-y-4">
                <h4 className="font-semibold gradient-text">Current Settings</h4>
                <div className="text-sm text-orange-700/80 space-y-2">
                  <div className="flex justify-between">
                    <span>Variant:</span>
                    <span className="font-medium">{selectedVariant}</span>
                   </div>
                     <div className="flex justify-between">
                    <span>Effect:</span>
                    <span className="font-medium">{selectedEffect}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Glow:</span>
                    <span className="font-medium">{glowIntensity[0]}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Blur:</span>
                    <span className="font-medium">{blurIntensity[0]}px</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Speed:</span>
                    <span className="font-medium">{animationSpeed[0]}x</span>
                  </div>
                </div>
              </div>
            </div>
          </GlassCardContent>
        </GlassCard>
      </main>

      {/* Floating Action Button */}
      <div className="fixed bottom-6 right-6">
        <GlassButton
          variant="orange"
          effect="glow"
          size="icon"
          className="w-14 h-14 rounded-full floating-animation shadow-2xl"
          onClick={() => playSound("success")}
          onMouseEnter={() => playSound("hover")}
        >
          <Sparkles className="w-6 h-6" />
        </GlassButton>
      </div>
    </div>
  )
}
