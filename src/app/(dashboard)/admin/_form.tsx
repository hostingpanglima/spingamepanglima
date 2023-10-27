"use client"
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form";
import * as z from "zod"
import { signIn, useSession } from "next-auth/react"
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { PasswordInput } from "@/components/ui/passwordInput";

const formSchema = z.object({
  username: z.string().min(1, {message: "username required"}),
  password: z.string().min(1, {message: "password required"}),
})

const SigninForm = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/dashboard";
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: '',
      password: '',
    },
  })
  const [error, setError] = useState("")
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try{
      const res = await signIn("credentials", {...values,redirect: false})
      if(res?.error){
        setError("Invalid Credentials")
        return
      }
      router.push(callbackUrl);
    }catch(err){
      console.log(err)
    }
  }
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="grid grid-cols-1 justify-center gap-5">
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Username</FormLabel>
                <FormControl>
                  <Input placeholder="username" {...field} disabled={form.formState.isSubmitting}/>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <PasswordInput placeholder="password" {...field} disabled={form.formState.isSubmitting}/>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {error != '' && <div className='text-red-500 font-medium'>{error}</div>}
          <div className="flex justify-center">
            <Button type="submit" className="mt-2 w-32" disabled={form.formState.isSubmitting}>Submit</Button>
          </div>
        </div>
      </form>
    </Form>
  );
}

export default SigninForm;