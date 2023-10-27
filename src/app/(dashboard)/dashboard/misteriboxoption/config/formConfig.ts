import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

export const MisteriOptionformSchema = z.object({
  id: z.string().optional(),
  option: z.string().min(1, {message: "Option required"}),
  category: z.string()
})

export type MisteriOptionFormType = z.infer<typeof MisteriOptionformSchema>

export const MisteriFormConfig = {
  resolver: zodResolver(MisteriOptionformSchema),
  defaultValues: {
    option: '',
    category: 'uang'
  },
}