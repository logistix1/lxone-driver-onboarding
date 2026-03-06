"use client"

import React from "react"
import Link from "next/link"

const PRIVACY_POLICY_URL = "https://www.logistix.one/privacy-policy"

function openPrivacyPolicyPopup() {
  const popup = window.open(
    PRIVACY_POLICY_URL,
    "lx1-privacy-policy",
    "popup=yes,width=980,height=760,resizable=yes,scrollbars=yes",
  )

  if (popup) {
    popup.focus()
    return
  }

  window.open(PRIVACY_POLICY_URL, "_blank", "noopener,noreferrer")
}

export default function Footer() {
  return (
    <div className="xs:text-xs px-3 py-8 text-center text-sm font-medium text-gray-500">
      <div>
        Powered by:{" "}
        <span className="text-base font-bold text-red-500">Lx1</span>
      </div>
      <div>© 2025 All Rights Reserved. Eva Auto Transport LLC</div>
      <div>
        <Link
          href={PRIVACY_POLICY_URL}
          className="text-blue-500"
          onClick={(e) => {
            e.preventDefault()
            openPrivacyPolicyPopup()
          }}
        >
          Privacy Policy.
        </Link>
      </div>
      <div>
        Eva Auto Transport LLC, 7280 N.W. 87th Terrace, Suite C-210 Kansas City,
        MO 64153
      </div>
      <div>+13613177773 info@evaautotrans.com</div>
    </div>
  )
}
