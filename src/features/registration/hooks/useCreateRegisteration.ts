"use client"
import { useMutation } from "@tanstack/react-query"
import api from "@/lib/api"
import { useToastMessage } from "@/hooks/useToastMessage"
import type { Company } from "../types"
import { registrationPayload, registrationRequestKey } from "../registrationPayload"

export const useCreateRegisteration = () => {
   const {getErrorMessage} = useToastMessage()
  const { mutate, isPending } = useMutation({
    mutationFn: async ({ item, token }: { item: Company; token: string | null }) => {
      if (!token) throw new Error("Registration link is missing")
      const payload = registrationPayload(item)
      const key = await registrationRequestKey(token, payload)
      return (await api.post(`/invite-link/registeration/${encodeURIComponent(token)}`, payload,
        { headers: { "Idempotency-Key": key } })).data
    },
    onError: (error) => {
      getErrorMessage(error)
    },
  })

  return { mutate, isPending }
}
