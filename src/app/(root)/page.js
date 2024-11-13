import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { BrainCircuit, Users, FileCheck, Video, FileText } from "lucide-react"
import connectToDatabase from "@/db/Dbconnect"

export default async function LandingPage() {
  const id = 123
  await connectToDatabase()
  return (
    <div className="flex flex-col min-h-screen">
     
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
                  Revolutionize Your Hiring Process with AI
                </h1>
                <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400">
                  Streamline recruitment, evaluate skills, and find the perfect candidates using cutting-edge AI technology.
                </p>
              </div>
              <div className="space-x-4">
               <Link href={`/Blog/${id}`}> <Button>Get Started</Button></Link>
                <Button variant="outline">Learn More</Button>
              </div>
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32 bg-gray-100 dark:bg-gray-800">
          <div className="container px-4 md:px-6">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-center mb-8">
              Our Features
            </h2>
            <div className="grid gap-10 sm:grid-cols-2 md:grid-cols-3">
              <div className="flex flex-col items-center space-y-2 border-gray-800 p-4 rounded-lg">
                <BrainCircuit className="h-12 w-12 mb-2 text-primary" />
                <h3 className="text-xl font-bold">AI-Generated Skills Evaluation</h3>
                <p className="text-gray-500 dark:text-gray-400 text-center">
                  Assess candidate skills with customized, AI-generated tests.
                </p>
              </div>
              <div className="flex flex-col items-center space-y-2 border-gray-800 p-4 rounded-lg">
                <Users className="h-12 w-12 mb-2 text-primary" />
                <h3 className="text-xl font-bold">Interview Preparation</h3>
                <p className="text-gray-500 dark:text-gray-400 text-center">
                  Prepare candidates with AI-powered interview simulations and feedback.
                </p>
              </div>
              <div className="flex flex-col items-center space-y-2 border-gray-800 p-4 rounded-lg">
                <FileCheck className="h-12 w-12 mb-2 text-primary" />
                <h3 className="text-xl font-bold">Candidate Filtering</h3>
                <p className="text-gray-500 dark:text-gray-400 text-center">
                  Efficiently filter candidates based on test results and qualifications.
                </p>
              </div>
              <div className="flex flex-col items-center space-y-2 border-gray-800 p-4 rounded-lg">
                <Video className="h-12 w-12 mb-2 text-primary" />
                <h3 className="text-xl font-bold">Live Video Interviews</h3>
                <p className="text-gray-500 dark:text-gray-400 text-center">
                  Conduct seamless live interviews with built-in screen sharing.
                </p>
              </div>
              <div className="flex flex-col items-center space-y-2 border-gray-800 p-4 rounded-lg">
                <FileText className="h-12 w-12 mb-2 text-primary" />
                <h3 className="text-xl font-bold">Resume Management</h3>
                <p className="text-gray-500 dark:text-gray-400 text-center">
                  Easily manage and analyze candidate resumes with AI assistance.
                </p>
              </div>
              <div className="flex flex-col items-center space-y-2 border-gray-800 p-4 rounded-lg">
                <FileText className="h-12 w-12 mb-2 text-primary" />
                <h3 className="text-xl font-bold">Job Posting</h3>
                <p className="text-gray-500 dark:text-gray-400 text-center">
                  Create and manage job postings with intelligent recommendations.
                </p>
              </div>
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                  Ready to Transform Your Hiring Process?
                </h2>
                <p className="mx-auto max-w-[600px] text-gray-500 md:text-xl dark:text-gray-400">
                  Join thousands of companies using AI Recruiter to find top talent faster and more efficiently.
                </p>
              </div>
              <div className="w-full max-w-sm space-y-2">
                <form className="flex space-x-2">
                  <Input className="max-w-lg flex-1" placeholder="Enter your email" type="email" />
                  <Button type="submit">Get Started</Button>
                </form>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Start your free trial. No credit card required.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t">
        <p className="text-xs text-gray-500 dark:text-gray-400">
          © 2024 AI Recruiter. All rights reserved.
        </p>
        <nav className="sm:ml-auto flex gap-4 sm:gap-6">
          <Link className="text-xs hover:underline underline-offset-4" href="#">
            Terms of Service
          </Link>
          <Link className="text-xs hover:underline underline-offset-4" href="#">
            Privacy
          </Link>
        </nav>
      </footer>
    </div>
  )
}