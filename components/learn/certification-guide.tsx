"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Award,
  CheckCircle,
  Clock,
  FileText,
  Globe,
  IndianRupee,
  Shield,
  Users,
  AlertCircle,
  Download,
  ExternalLink,
} from "lucide-react"

interface Certification {
  id: string
  name: string
  authority: string
  region: "India" | "International" | "Regional"
  cost: string
  duration: string
  validity: string
  requirements: string[]
  benefits: string[]
  process: string[]
  documents: string[]
  difficulty: "Easy" | "Moderate" | "Complex"
  popularity: number
  description: string
}

const certifications: Certification[] = [
  {
    id: "india-organic",
    name: "India Organic Certification",
    authority: "APEDA (Agricultural and Processed Food Products Export Development Authority)",
    region: "India",
    cost: "₹15,000 - ₹50,000",
    duration: "3-6 months",
    validity: "3 years",
    requirements: [
      "Minimum 3 years conversion period from conventional to organic",
      "Detailed farm management plan and record keeping",
      "Soil and water testing reports",
      "Buffer zones from conventional farms",
      "Organic inputs and pest management plan",
    ],
    benefits: [
      "Access to premium organic markets in India",
      "Government subsidies and support schemes",
      "Higher price premiums (20-40% above conventional)",
      "Export opportunities to international markets",
      "Consumer trust and brand recognition",
    ],
    process: [
      "Submit application with required documents",
      "Initial inspection by certified inspector",
      "Review of farm management system",
      "Soil and water sample testing",
      "Certification decision and certificate issuance",
    ],
    documents: [
      "Land ownership/lease documents",
      "Farm management plan",
      "Input purchase records",
      "Harvest and sales records",
      "Soil and water test reports",
    ],
    difficulty: "Moderate",
    popularity: 95,
    description:
      "The primary organic certification for the Indian market, recognized by FSSAI and accepted for domestic sales and exports.",
  },
  {
    id: "usda-organic",
    name: "USDA Organic Certification",
    authority: "United States Department of Agriculture (USDA)",
    region: "International",
    cost: "₹75,000 - ₹2,00,000",
    duration: "6-12 months",
    validity: "Annual renewal",
    requirements: [
      "3-year transition period without prohibited substances",
      "Detailed organic system plan",
      "Use of only USDA-approved inputs",
      "Detailed record keeping and documentation",
      "Annual inspections and updates",
    ],
    benefits: [
      "Access to US organic market (largest in the world)",
      "Premium pricing in international markets",
      "Global recognition and credibility",
      "Compliance with strict quality standards",
      "Enhanced export opportunities",
    ],
    process: [
      "Develop organic system plan",
      "Submit application to USDA-accredited certifier",
      "On-site inspection by qualified inspector",
      "Review process and certification decision",
      "Annual updates and re-certification",
    ],
    documents: [
      "Organic system plan",
      "Field history for past 3 years",
      "Input materials list and sources",
      "Harvest and handling records",
      "Sales and inventory records",
    ],
    difficulty: "Complex",
    popularity: 78,
    description:
      "Internationally recognized certification that opens doors to the lucrative US and global organic markets.",
  },
  {
    id: "jaivik-bharat",
    name: "Jaivik Bharat Certification",
    authority: "Quality Council of India (QCI)",
    region: "India",
    cost: "₹5,000 - ₹25,000",
    duration: "2-4 months",
    validity: "3 years",
    requirements: [
      "Compliance with National Programme for Organic Production (NPOP)",
      "Participatory Guarantee System (PGS) group membership",
      "Local peer review and verification",
      "Minimal external input usage",
      "Community-based quality assurance",
    ],
    benefits: [
      "Lower certification costs compared to third-party",
      "Community-based support system",
      "Government recognition and support",
      "Access to local organic markets",
      "Simplified certification process",
    ],
    process: [
      "Join local PGS group",
      "Peer review and farm verification",
      "Documentation and record maintenance",
      "Annual group meetings and reviews",
      "Certificate issuance through QCI",
    ],
    documents: [
      "PGS group membership certificate",
      "Farm conversion plan",
      "Peer review reports",
      "Input usage records",
      "Production and sales data",
    ],
    difficulty: "Easy",
    popularity: 65,
    description:
      "Community-based certification system that's more affordable and accessible for small-scale farmers in India.",
  },
  {
    id: "eu-organic",
    name: "EU Organic Certification",
    authority: "European Union Organic Regulation",
    region: "International",
    cost: "₹60,000 - ₹1,50,000",
    duration: "4-8 months",
    validity: "Annual renewal",
    requirements: [
      "Compliance with EU Organic Regulation (EU) 2018/848",
      "3-year conversion period",
      "Approved organic inputs only",
      "Detailed traceability system",
      "Annual inspections and certification",
    ],
    benefits: [
      "Access to European organic market",
      "High premium prices in EU",
      "Strict quality standards recognition",
      "Enhanced brand value globally",
      "Compliance with EU import requirements",
    ],
    process: [
      "Contact EU-recognized certification body",
      "Submit detailed application and documentation",
      "On-site inspection and evaluation",
      "Certification decision and certificate issuance",
      "Annual surveillance and re-certification",
    ],
    documents: [
      "Detailed farm management plan",
      "Input purchase and usage records",
      "Production and processing documentation",
      "Sales and distribution records",
      "Traceability system documentation",
    ],
    difficulty: "Complex",
    popularity: 45,
    description:
      "Prestigious certification for accessing the European organic market with its high quality standards and premium pricing.",
  },
]

export default function CertificationGuide() {
  const [selectedCert, setSelectedCert] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState("overview")

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Easy":
        return "bg-green-100 text-green-800"
      case "Moderate":
        return "bg-yellow-100 text-yellow-800"
      case "Complex":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getRegionColor = (region: string) => {
    switch (region) {
      case "India":
        return "bg-orange-100 text-orange-800"
      case "International":
        return "bg-blue-100 text-blue-800"
      case "Regional":
        return "bg-purple-100 text-purple-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <h2 className="text-3xl font-bold">Organic Certification Guide</h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Navigate the world of organic certifications. Choose the right certification for your farm based on your
          target markets, budget, and farming scale.
        </p>
      </div>

      {/* Certification Comparison */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2">
        {certifications.map((cert) => (
          <Card
            key={cert.id}
            className={`cursor-pointer transition-all hover:shadow-lg ${
              selectedCert === cert.id ? "ring-2 ring-green-500" : ""
            }`}
            onClick={() => setSelectedCert(selectedCert === cert.id ? null : cert.id)}
          >
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <Award className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">{cert.name}</CardTitle>
                    <p className="text-sm text-gray-600">{cert.authority}</p>
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <Badge className={getRegionColor(cert.region)}>{cert.region}</Badge>
                  <Badge className={getDifficultyColor(cert.difficulty)}>{cert.difficulty}</Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-700 text-sm">{cert.description}</p>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <IndianRupee className="h-4 w-4 text-gray-500" />
                  <span>{cert.cost}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-gray-500" />
                  <span>{cert.duration}</span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-gray-500" />
                  <span className="text-sm">Popularity</span>
                </div>
                <div className="flex items-center gap-2">
                  <Progress value={cert.popularity} className="w-20 h-2" />
                  <span className="text-sm font-medium">{cert.popularity}%</span>
                </div>
              </div>

              {selectedCert === cert.id && (
                <Button className="w-full mt-4">
                  <FileText className="h-4 w-4 mr-2" />
                  View Detailed Guide
                </Button>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Detailed View */}
      {selectedCert && (
        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="h-5 w-5" />
              {certifications.find((c) => c.id === selectedCert)?.name} - Detailed Guide
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-5">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="requirements">Requirements</TabsTrigger>
                <TabsTrigger value="process">Process</TabsTrigger>
                <TabsTrigger value="benefits">Benefits</TabsTrigger>
                <TabsTrigger value="documents">Documents</TabsTrigger>
              </TabsList>

              {certifications
                .filter((cert) => cert.id === selectedCert)
                .map((cert) => (
                  <div key={cert.id}>
                    <TabsContent value="overview" className="space-y-6">
                      <div className="grid md:grid-cols-2 gap-6">
                        <div>
                          <h4 className="font-semibold mb-3 flex items-center gap-2">
                            <Globe className="h-4 w-4" />
                            Certification Details
                          </h4>
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span>Authority:</span>
                              <span className="font-medium">{cert.authority}</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Region:</span>
                              <Badge className={getRegionColor(cert.region)}>{cert.region}</Badge>
                            </div>
                            <div className="flex justify-between">
                              <span>Cost Range:</span>
                              <span className="font-medium">{cert.cost}</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Duration:</span>
                              <span className="font-medium">{cert.duration}</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Validity:</span>
                              <span className="font-medium">{cert.validity}</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Difficulty:</span>
                              <Badge className={getDifficultyColor(cert.difficulty)}>{cert.difficulty}</Badge>
                            </div>
                          </div>
                        </div>
                        <div>
                          <h4 className="font-semibold mb-3 flex items-center gap-2">
                            <AlertCircle className="h-4 w-4" />
                            Quick Facts
                          </h4>
                          <div className="space-y-3">
                            <div className="p-3 bg-blue-50 rounded-lg">
                              <p className="text-sm text-blue-800">
                                <strong>Best for:</strong>{" "}
                                {cert.region === "India" ? "Domestic market focus" : "Export-oriented farms"}
                              </p>
                            </div>
                            <div className="p-3 bg-green-50 rounded-lg">
                              <p className="text-sm text-green-800">
                                <strong>Popularity:</strong> {cert.popularity}% of farmers choose this certification
                              </p>
                            </div>
                            <div className="p-3 bg-yellow-50 rounded-lg">
                              <p className="text-sm text-yellow-800">
                                <strong>ROI:</strong> Typically 20-40% price premium over conventional products
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </TabsContent>

                    <TabsContent value="requirements" className="space-y-4">
                      <h4 className="font-semibold flex items-center gap-2">
                        <CheckCircle className="h-4 w-4" />
                        Certification Requirements
                      </h4>
                      <ul className="space-y-3">
                        {cert.requirements.map((req, index) => (
                          <li key={index} className="flex items-start gap-3">
                            <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                            <span className="text-gray-700">{req}</span>
                          </li>
                        ))}
                      </ul>
                    </TabsContent>

                    <TabsContent value="process" className="space-y-4">
                      <h4 className="font-semibold flex items-center gap-2">
                        <Clock className="h-4 w-4" />
                        Certification Process
                      </h4>
                      <div className="space-y-4">
                        {cert.process.map((step, index) => (
                          <div key={index} className="flex items-start gap-4">
                            <div className="flex-shrink-0 w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                              <span className="text-sm font-semibold text-green-600">{index + 1}</span>
                            </div>
                            <div className="flex-1">
                              <p className="text-gray-700">{step}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </TabsContent>

                    <TabsContent value="benefits" className="space-y-4">
                      <h4 className="font-semibold flex items-center gap-2">
                        <Shield className="h-4 w-4" />
                        Key Benefits
                      </h4>
                      <ul className="space-y-3">
                        {cert.benefits.map((benefit, index) => (
                          <li key={index} className="flex items-start gap-3">
                            <Shield className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                            <span className="text-gray-700">{benefit}</span>
                          </li>
                        ))}
                      </ul>
                    </TabsContent>

                    <TabsContent value="documents" className="space-y-4">
                      <h4 className="font-semibold flex items-center gap-2">
                        <FileText className="h-4 w-4" />
                        Required Documents
                      </h4>
                      <ul className="space-y-3">
                        {cert.documents.map((doc, index) => (
                          <li key={index} className="flex items-start gap-3">
                            <FileText className="h-4 w-4 text-purple-600 mt-0.5 flex-shrink-0" />
                            <span className="text-gray-700">{doc}</span>
                          </li>
                        ))}
                      </ul>
                      <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                        <h5 className="font-medium mb-2">Document Preparation Tips:</h5>
                        <ul className="text-sm text-gray-600 space-y-1">
                          <li>• Keep all records for at least 3 years</li>
                          <li>• Maintain digital copies as backup</li>
                          <li>• Ensure all documents are properly dated and signed</li>
                          <li>• Translate documents to English if required</li>
                        </ul>
                      </div>
                    </TabsContent>
                  </div>
                ))}
            </Tabs>

            <div className="mt-6 flex gap-4">
              <Button className="flex-1">
                <Download className="h-4 w-4 mr-2" />
                Download Application Form
              </Button>
              <Button variant="outline" className="flex-1">
                <ExternalLink className="h-4 w-4 mr-2" />
                Visit Official Website
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Comparison Table */}
      <Card>
        <CardHeader>
          <CardTitle>Certification Comparison</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                   <th className="text-left p-2">Certification</th>
                  <th className="text-left p-2">Cost</th>
                  <th className="text-left p-2">Duration</th>
                  <th className="text-left p-2">Market Access</th>
                  <th className="text-left p-2">Difficulty</th>
                </tr>
              </thead>
              <tbody>
                {certifications.map((cert) => (
                  <tr key={cert.id} className="border-b">
                    <td className="p-2 font-medium">{cert.name}</td>
                    <td className="p-2">{cert.cost}</td>
                    <td className="p-2">{cert.duration}</td>
                    <td className="p-2">{cert.region}</td>
                    <td className="p-2">
                      <Badge className={getDifficultyColor(cert.difficulty)}>{cert.difficulty}</Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
