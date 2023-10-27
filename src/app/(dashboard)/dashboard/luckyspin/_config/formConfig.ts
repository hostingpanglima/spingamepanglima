import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

export const SpinOptionformSchema = z.object({
  id: z.string().optional(),
  option: z.string(),
  color : z.string(),
  probability: z.number().min(0).max(10000),
  forceWin: z.boolean(),
})

export type SpinOptionFormType = z.infer<typeof SpinOptionformSchema>

export const SpinOptionFormConfig = {
  resolver: zodResolver(SpinOptionformSchema),
  defaultValues: {
    option: '',
    color: '',
    probability: 0,
    forceWin: false
  },
}