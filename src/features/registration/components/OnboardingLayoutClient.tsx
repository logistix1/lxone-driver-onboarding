"use client"
import { Logo } from "@/components/ui/Logo"
import Footer from "@/features/registration/components/Footer"
import { cx } from "@/lib/utils"
import QueryProvider from "@/providers/ReactQuery"
import { Mail, Phone } from "lucide-react"
import { usePathname } from "next/navigation"
import React from "react"

interface Step {
  name: string
  href: string
}

const steps: Step[] = [
  { name: "Product selection", href: "/step-one" },
  { name: "Employees", href: "/step-two" },
  { name: "Infrastructure", href: "/step-three" },
  { name: "Infrastructuredwd", href: "/step-finish" },
]

interface StepProgressProps {
  steps: Step[]
}

const StepProgress = ({ steps }: StepProgressProps) => {
  const pathname = usePathname()
  const currentStepIndex = steps.findIndex((step) =>
    pathname.startsWith(step.href),
  )

  return (
    <div aria-label="Onboarding progress">
      <ol className="mx-auto flex w-24 flex-nowrap gap-1 md:w-fit">
        {steps.map((step, index) => (
          <li
            key={step.name}
            className={cx(
              "h-1 w-12 rounded-full",
              index <= currentStepIndex
                ? "bg-blue-500"
                : "bg-gray-300 dark:bg-gray-700",
            )}
          >
            <span className="sr-only">
              {step.name}{" "}
              {index < currentStepIndex
                ? "completed"
                : index === currentStepIndex
                  ? "current"
                  : ""}
            </span>
          </li>
        ))}
      </ol>
    </div>
  )
}

const Layout = ({
  children,
}: Readonly<{
  children: React.ReactNode
}>) => {
  return (
    <>
      <header
        className={cx(
          "py-2 fixed inset-x-0 top-0 isolate z-50 flex items-center justify-between border-b border-gray-200 bg-gray-50 px-4 transition-all md:grid md:grid-cols-[200px_auto_200px] md:px-6 dark:border-gray-900 dark:bg-gray-925",
          // scrolled ? "h-12" : "h-20",
        )}
      >
        <div
          className="hidden flex-nowrap items-center gap-0.5 md:flex"
          aria-hidden="true"
        >
          <Logo
            className="w-7 p-px text-blue-500 dark:text-blue-500"
            aria-hidden="true"
          />
          <span className="mt-0.5 text-lg font-semibold text-gray-900 dark:text-gray-50">
            Insights
          </span>
        </div>
        <StepProgress steps={steps} />
       <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full border border-blue-500 bg-white shadow-sm transition-transform duration-300 hover:scale-110 dark:bg-gray-800">
            <Mail size={18} className="text-blue-500 dark:text-blue-400" />
          </div>
          <div className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full border border-green-500 bg-white shadow-sm transition-transform duration-300 hover:scale-110 dark:bg-gray-800">
            <Phone size={18} className="text-green-500 dark:text-green-400" />
          </div>
        </div>
      </header>
      <main id="main-content" className="mx-auto mb-20 mt-28 max-w-5xl">
        <QueryProvider>
           {children}
        </QueryProvider>
       <Footer/>
      </main>
    </>
  )
}

export default Layout
