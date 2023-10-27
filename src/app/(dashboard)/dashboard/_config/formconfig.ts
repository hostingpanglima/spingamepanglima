import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

export const LuckyformSchema = z.object({
  id: z.string().optional(),
  memberId: z.string().min(1, {message: "username required"}),
  codeVoucher : z.string().min(1, {message: "code voucher required"}),
  canExpired: z.boolean(),
  expiredDate: z.date().optional().nullable(),
  used: z.boolean(),
  priceId: z.string().optional()
})

export type luckyspinnerFormType = z.infer<typeof LuckyformSchema>

export const luckyspinerFormConfig = {
  resolver: zodResolver(LuckyformSchema),
  defaultValues: {
    memberId: '',
    codeVoucher: '',
    canExpired: false,
    used: false,
    priceId: undefined
  },
}