import { THeaderOption } from "@/components/page-container/defaultPageContainer";
import { Card } from "@/components/ui/card";
import { Menuicon } from "@/components/ui/menuIcon";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { UseFormReturn } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { MisteriOptionFormType } from "./config/formConfig";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
interface MisteriFormProps {
  headerOption: THeaderOption;
  form: UseFormReturn<MisteriOptionFormType>;
  EventHandler: {
    onSubmit: (values: MisteriOptionFormType) => void;
    onCancel: () => void;
  };
}

const MisteriForm = ({
  headerOption,
  form,
  EventHandler,
}: MisteriFormProps) => {
  return (
    <>
      <Card>
        <div className="hidden h-20 items-center space-x-3 px-5 md:flex">
          <Menuicon name={headerOption.icon} />
          <h2 className="text-xl font-bold capitalize">
            {headerOption.title} Form
          </h2>
        </div>
        <Card className="md:border-none md:bg-transparent md:shadow-none">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(EventHandler.onSubmit)}>
              <div className="grid grid-cols-1 gap-5 p-5 sm:grid-cols-2 md:pt-0">
                <FormField
                  control={form.control}
                  name="option"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Option</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="option..."
                          {...field}
                          disabled={form.formState.isSubmitting}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Category</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select Category"/>
                        </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="emas">Emas</SelectItem>
                          <SelectItem value="uang">Uang</SelectItem>
                          <SelectItem value="iphone">Iphone</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="flex px-5 h-20 items-center justify-end">
                <div className="grid grid-cols-2 gap-3">
                    <Button type="button" onClick={()=> EventHandler.onCancel()} disabled={form.formState.isSubmitting}>Cancel</Button>
                    <Button type="submit" disabled={form.formState.isSubmitting}>Save</Button>
                </div>
            </div>
            </form>
          </Form>
        </Card>
      </Card>
    </>
  );
};

export default MisteriForm;
