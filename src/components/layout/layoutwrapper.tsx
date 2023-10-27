"use client";
import { PropsWithChildren, useState } from "react";
import Sidebar from "./sidebar";
import Header from "./header";
import { cn } from "@/lib/utils";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { PasswordInput } from "../ui/passwordInput";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import { signOut, useSession } from "next-auth/react";
import { trpc } from "@/app/_trpc/client";
import { toast } from "../ui/use-toast";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";

const formSchema = z.object({
  password: z.string().min(1, {message: "password required"}),
  confirmpassword: z.string().min(1)
})

const LayoutWrapper = ({ children }: PropsWithChildren) => {
  const [isOpen, setIsOpen] = useState(true)
  const [dialog,setDialoag] = useState(false)
  const {data:session} = useSession()
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      password: '',
      confirmpassword: ''
    },
  })
  const { mutate: changePassword } = trpc.changePassword.useMutation({
    onSuccess: ({ user }) => {
      if (user) {
        toast({
          title: "Password Updated",
          description: "Your data has been update successfully",
          variant: "success",
        });
        form.reset()
        signOut()
      }
      if (!user) {
        toast({
          title: "There was a problem...",
          description: "Please try again in a moment",
          variant: "destructive",
        });
      }
    },
  });
  const handleCancel = () => {
    form.reset()
    setDialoag(false)
  }
  const handleChangePassword = async (values: z.infer<typeof formSchema>) => {
    if(session){
      if(values.password === values.confirmpassword)
        changePassword({userId:session.user.id,password:values.password})
      else
        form.setError("confirmpassword", {type:"custom", message: "password not match"})
    }
  }
  return (
    <div className={cn("flex flex-row min-h-screen overflow-hidden bg-slate-100")}>
      <Sidebar state={{ isOpen, setIsOpen }} />
      <div className="flex-1">
        <Header state={{ isOpen, setIsOpen }} setDialog={setDialoag} />
        {children}
        <Dialog open={dialog} onOpenChange={setDialoag}>
          <DialogContent className="bg-white">
            <DialogHeader>
              <DialogTitle>Change Password</DialogTitle>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleChangePassword)}>
                <div className="grid grid-cols-1 gap-5">
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>New Password</FormLabel>
                      <FormControl>
                        <PasswordInput placeholder="New Password" {...field} disabled={form.formState.isSubmitting}/>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="confirmpassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Confirm Password</FormLabel>
                      <FormControl>
                        <PasswordInput placeholder="Confirm Password" {...field} disabled={form.formState.isSubmitting}/>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="flex gap-5 mt-5 justify-end">
                <Button className="min-w-[100px]" variant="destructive" type="button" onClick={()=> handleCancel()}>Cancel</Button>
                <Button className="min-w-[100px]" variant="success" type="submit">Save</Button>
              </div>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default LayoutWrapper;
