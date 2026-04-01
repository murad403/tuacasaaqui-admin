import { ChevronRight, KeyRound, Shield, Database, FileText, UserCircle } from 'lucide-react'
import Link from 'next/link'
import React from 'react'

const settingLinks = [
  { id: 1, name: "Personal Information",    route: "/settings/personal-information",    icon: UserCircle,  description: "Update your name, email and profile details" },
  { id: 2, name: "Change Password",         route: "/settings/change-password",         icon: KeyRound,    description: "Set a new password for your account" },
  { id: 3, name: "Privacy Policy",          route: "/settings/privacy-policy",          icon: Shield,      description: "Review the platform's privacy policy" },
  { id: 5, name: "Terms and Conditions",    route: "/settings/terms-conditions",    icon: FileText,    description: "Detailed explanation of terms and conditions" },
  { id: 4, name: "Disclaimer",  route: "/settings/data-source-disclaimer",  icon: Database,    description: "Information about data sources used" },
]

const page = () => {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-title">Settings</h1>
        <p className="text-sm text-description mt-1">
          Manage your admin profile and platform settings
        </p>
      </div>

      <div className="bg-white rounded-xl border overflow-hidden divide-y divide-gray-100">
        {settingLinks.map(({ id, name, route, icon: Icon, description }) => (
          <Link
            key={id}
            href={route}
            className="flex items-center gap-4 px-6 py-5 hover:bg-gray-50 transition-colors group"
          >
            <div className="size-10 rounded-lg bg-[#EEF2F7] flex items-center justify-center shrink-0">
              <Icon className="size-5 text-heading" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-title text-sm">{name}</p>
              <p className="text-description text-xs mt-0.5">{description}</p>
            </div>
            <ChevronRight className="size-4 text-gray-400 group-hover:text-heading transition-colors shrink-0" />
          </Link>
        ))}
      </div>
    </div>
  )
}

export default page
