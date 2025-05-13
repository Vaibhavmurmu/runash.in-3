"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { ArrowRight, Brain, Code, Cpu, Database, Network, FileText, Users, Award, Video } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function AIHero() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setIsVisible(true)
  }, [])

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5 },
    },
  }

  const nodeVariants = {
    hidden: { scale: 0, opacity: 0 },
    visible: (i: number) => ({
      scale: 1,
      opacity: 1,
      transition: { delay: 0.5 + i * 0.1, duration: 0.5 },
    }),
  }

  const lineVariants = {
    hidden: { pathLength: 0, opacity: 0 },
    visible: {
      pathLength: 1,
      opacity: 1,
      transition: { delay: 0.5, duration: 1.5, ease: "easeInOut" },
    },
  }

  return (
    <section className="relative py-20 overflow-hidden bg-gradient-to-b from-orange-50 to-white dark:from-gray-900 dark:to-gray-900">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-orange-500/10 to-yellow-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-br from-yellow-500/10 to-orange-500/10 rounded-full blur-3xl"></div>
      </div>

      <div className="container px-4 mx-auto relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div
            className="flex flex-col"
            variants={containerVariants}
            initial="hidden"
            animate={isVisible ? "visible" : "hidden"}
          >
            <motion.div variants={itemVariants} className="mb-6">
              <span className="inline-block py-1 px-3 text-sm font-medium bg-gradient-to-r from-orange-600/10 to-yellow-600/10 dark:from-orange-500/20 dark:to-yellow-500/20 text-orange-600 dark:text-orange-400 rounded-full mb-4">
                RunAsh AI Research
              </span>
              <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-orange-600 via-orange-500 to-yellow-500 dark:from-orange-400 dark:via-orange-300 dark:to-yellow-300 text-transparent bg-clip-text leading-tight mb-6">
                Advancing AI for Live Streaming
              </h1>
              <p className="text-xl text-gray-700 dark:text-gray-300">
                Explore our cutting-edge research, technical papers, and interactive demos showcasing the future of
                AI-powered live streaming technology.
              </p>
            </motion.div>

            <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-4">
              <Button className="bg-gradient-to-r from-orange-600 to-yellow-600 hover:opacity-90 text-white">
                Explore Research <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                className="border-orange-500 text-orange-600 hover:bg-orange-50 dark:border-orange-400 dark:text-orange-400 dark:hover:bg-orange-950"
              >
                View Interactive Demos
              </Button>
            </motion.div>

            <motion.div variants={itemVariants} className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="flex flex-col items-center text-center">
                <div className="p-3 rounded-lg bg-gradient-to-br from-orange-500/20 to-yellow-500/20 mb-2">
                  <FileText className="h-6 w-6 text-orange-600 dark:text-orange-400" />
                </div>
                <span className="text-sm text-gray-700 dark:text-gray-300">25+ Research Papers</span>
              </div>
              <div className="flex flex-col items-center text-center">
                <div className="p-3 rounded-lg bg-gradient-to-br from-orange-500/20 to-yellow-500/20 mb-2">
                  <Users className="h-6 w-6 text-orange-600 dark:text-orange-400" />
                </div>
                <span className="text-sm text-gray-700 dark:text-gray-300">15 AI Researchers</span>
              </div>
              <div className="flex flex-col items-center text-center">
                <div className="p-3 rounded-lg bg-gradient-to-br from-orange-500/20 to-yellow-500/20 mb-2">
                  <Award className="h-6 w-6 text-orange-600 dark:text-orange-400" />
                </div>
                <span className="text-sm text-gray-700 dark:text-gray-300">8 Industry Awards</span>
              </div>
              <div className="flex flex-col items-center text-center">
                <div className="p-3 rounded-lg bg-gradient-to-br from-orange-500/20 to-yellow-500/20 mb-2">
                  <Code className="h-6 w-6 text-orange-600 dark:text-orange-400" />
                </div>
                <span className="text-sm text-gray-700 dark:text-gray-300">12 Open Source Projects</span>
              </div>
            </motion.div>
          </motion.div>

          <motion.div
            className="relative h-[400px] md:h-[500px]"
            initial="hidden"
            animate={isVisible ? "visible" : "hidden"}
          >
            {/* Neural Network Visualization */}
            <svg className="w-full h-full" viewBox="0 0 500 500" fill="none" xmlns="http://www.w3.org/2000/svg">
              {/* Lines */}
              <motion.path
                d="M100,125 C200,50 300,150 400,125"
                stroke="url(#gradient1)"
                strokeWidth="2"
                strokeDasharray="0 1"
                fill="none"
                variants={lineVariants}
              />
              <motion.path
                d="M100,250 C200,175 300,275 400,250"
                stroke="url(#gradient1)"
                strokeWidth="2"
                strokeDasharray="0 1"
                fill="none"
                variants={lineVariants}
              />
              <motion.path
                d="M100,375 C200,300 300,400 400,375"
                stroke="url(#gradient1)"
                strokeWidth="2"
                strokeDasharray="0 1"
                fill="none"
                variants={lineVariants}
              />
              <motion.path
                d="M100,125 C150,175 150,225 100,250"
                stroke="url(#gradient2)"
                strokeWidth="2"
                strokeDasharray="0 1"
                fill="none"
                variants={lineVariants}
              />
              <motion.path
                d="M100,250 C150,300 150,350 100,375"
                stroke="url(#gradient2)"
                strokeWidth="2"
                strokeDasharray="0 1"
                fill="none"
                variants={lineVariants}
              />
              <motion.path
                d="M400,125 C350,175 350,225 400,250"
                stroke="url(#gradient2)"
                strokeWidth="2"
                strokeDasharray="0 1"
                fill="none"
                variants={lineVariants}
              />
              <motion.path
                d="M400,250 C350,300 350,350 400,375"
                stroke="url(#gradient2)"
                strokeWidth="2"
                strokeDasharray="0 1"
                fill="none"
                variants={lineVariants}
              />

              {/* Gradient Definitions */}
              <defs>
                <linearGradient id="gradient1" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#f97316" />
                  <stop offset="100%" stopColor="#eab308" />
                </linearGradient>
                <linearGradient id="gradient2" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#f97316" />
                  <stop offset="100%" stopColor="#eab308" />
                </linearGradient>
              </defs>

              {/* Nodes */}
              <motion.circle cx="100" cy="125" r="15" fill="url(#gradient1)" custom={0} variants={nodeVariants} />
              <motion.circle cx="100" cy="250" r="15" fill="url(#gradient1)" custom={1} variants={nodeVariants} />
              <motion.circle cx="100" cy="375" r="15" fill="url(#gradient1)" custom={2} variants={nodeVariants} />
              <motion.circle cx="400" cy="125" r="15" fill="url(#gradient1)" custom={3} variants={nodeVariants} />
              <motion.circle cx="400" cy="250" r="15" fill="url(#gradient1)" custom={4} variants={nodeVariants} />
              <motion.circle cx="400" cy="375" r="15" fill="url(#gradient1)" custom={5} variants={nodeVariants} />
            </svg>

            {/* Icons inside nodes */}
            <motion.div className="absolute top-[110px] left-[85px] p-2" variants={nodeVariants} custom={0}>
              <Database className="h-6 w-6 text-white" />
            </motion.div>
            <motion.div className="absolute top-[235px] left-[85px] p-2" variants={nodeVariants} custom={1}>
              <Brain className="h-6 w-6 text-white" />
            </motion.div>
            <motion.div className="absolute top-[360px] left-[85px] p-2" variants={nodeVariants} custom={2}>
              <Code className="h-6 w-6 text-white" />
            </motion.div>
            <motion.div className="absolute top-[110px] left-[385px] p-2" variants={nodeVariants} custom={3}>
              <Cpu className="h-6 w-6 text-white" />
            </motion.div>
            <motion.div className="absolute top-[235px] left-[385px] p-2" variants={nodeVariants} custom={4}>
              <Network className="h-6 w-6 text-white" />
            </motion.div>
            <motion.div className="absolute top-[360px] left-[385px] p-2" variants={nodeVariants} custom={5}>
              <Video className="h-6 w-6 text-white" />
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
