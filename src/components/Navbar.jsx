import Link from 'next/link'
import { UserButton, SignInButton, SignUpButton } from '@clerk/nextjs'
import { auth } from '@clerk/nextjs/server'



export default async function Navbar() {
  const { userId } =  await auth()

  return (
    <nav className="bg-background border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <Link href="/" className="flex-shrink-0 flex items-center">
              <div className="h-8 w-8 text-primary" />
              <span className="ml-2 text-2xl font-bold text-primary">AI Recruiter</span>
            </Link>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              <Link href="/jobs" className="inline-flex items-center px-1 pt-1 text-sm font-medium text-primary">
                Jobs
              </Link>
              <Link href="/candidates" className="inline-flex items-center px-1 pt-1 text-sm font-medium text-primary">
                Candidates
              </Link>
              <Link href="/about" className="inline-flex items-center px-1 pt-1 text-sm font-medium text-primary">
                About
              </Link>
            </div>
          </div>
          <div className="flex items-center">
            {userId ? (
              <UserButton afterSignOutUrl="/" />
            ) : (
              <div className="flex space-x-4">
                <SignInButton mode="modal">
                  <button variant="ghost">Log in</button>
                </SignInButton>
                <SignUpButton mode="modal">
                  <button>Sign up</button>
                </SignUpButton>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}