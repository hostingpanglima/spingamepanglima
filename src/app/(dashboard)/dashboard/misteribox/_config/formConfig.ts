import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

export const MisteriformSchema = z.object({
  id: z.string().optional(),
  memberId: z.string().min(1, {message: "username required"}),
  codeVoucher : z.string().min(1, {message: "code voucher required"}),
  canExpired: z.boolean(),
  expiredDate: z.date().optional().nullable(),
  used: z.boolean(),
  priceId: z.string().optional()
})

export type MisteriFormType = z.infer<typeof MisteriformSchema>

export const MisteriFormConfig = {
  resolver: zodResolver(MisteriformSchema),
  defaultValues: {
    memberId: '',
    codeVoucher: '',
    canExpired: false,
    used: false,
    priceId: undefined
  },
}