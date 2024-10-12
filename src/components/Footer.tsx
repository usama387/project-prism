import { Github, Linkedin, Mail } from 'lucide-react'
import { Separator } from "@/components/ui/separator"

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="text-gray-200 mt-auto">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="text-center sm:text-left">
            <h2 className="text-xl sm:text-2xl font-bold mb-4">Project Prism</h2>
            <p className="text-sm max-w-xs mx-auto sm:mx-0">
              Empowering large companies to track progress and manage their business portfolios effectively.
            </p>
          </div>
          <div className="text-center sm:text-left">
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><a href="#" className="hover:underline text-sm sm:text-base">Home</a></li>
              <li><a href="#" className="hover:underline text-sm sm:text-base">About</a></li>
              <li><a href="#" className="hover:underline text-sm sm:text-base">Services</a></li>
              <li><a href="#" className="hover:underline text-sm sm:text-base">Contact</a></li>
            </ul>
          </div>
          <div className="text-center sm:text-left">
            <h3 className="text-lg font-semibold mb-4">Contact</h3>
            <p className="text-sm sm:text-base mb-2">Usama Razaaq</p>
            <p className="text-sm sm:text-base mb-4">Developer of Project Prism</p>
            <div className="flex justify-center sm:justify-start space-x-4">
              <a href="mailto:usamarazaaq3@gmail.com" aria-label="Email" className="hover:text-secondary">
                <Mail className="h-5 w-5 sm:h-6 sm:w-6" />
              </a>
              <a href="https://github.com/yourusername" target="_blank" rel="noopener noreferrer" aria-label="GitHub" className="hover:text-secondary">
                <Github className="h-5 w-5 sm:h-6 sm:w-6" />
              </a>
              <a href="https://linkedin.com/in/yourusername" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="hover:text-secondary">
                <Linkedin className="h-5 w-5 sm:h-6 sm:w-6" />
              </a>
            </div>
          </div>
        </div>
        <Separator className="my-8 bg-primary-foreground/20" />
        <div className="text-center text-xs sm:text-sm">
          <p>&copy; {currentYear} Project Prism. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}