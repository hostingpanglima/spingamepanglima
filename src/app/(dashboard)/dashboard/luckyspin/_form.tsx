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
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { SpinOptionFormType } from "./_config/formConfig";
import InputNumber from "@/components/ui/inputNumber";
import ColorPicker from "@/components/ui/colorPicker";
interface SpinnerOptionProps {
  headerOption: THeaderOption;
  form: UseFormReturn<SpinOptionFormType>;
  EventHandler: {
    onSubmit: (values: SpinOptionFormType) => void;
    onCancel: () => void;
  };
}

const SpinerOptionForm = ({
  headerOption,
  form,
  EventHandler,
}: SpinnerOptionProps) => {
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
                          placeholder="Option..."
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
                  name="color"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Color</FormLabel>
                      <FormControl>
                        {/* <Input
                          placeholder="Color..."
                          {...field}
                          disabled={form.formState.isSubmitting}
                        /> */}
                        <ColorPicker {...field} disabled={form.formState.isSubmitting}/>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="probability"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>probability</FormLabel>
                        <FormControl>
                        <InputNumber placeholder="probability..." {...field} onValueChange={field.onChange} disabled={form.formState.isSubmitting } />
                          {/* <Datepicker {...field} disabled={!form.getValues("canExpired") || form.formState.isSubmitting}/> */}
                        </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="forceWin"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Force Win</FormLabel>
                      <FormControl className="ml-2">
                        <Checkbox cbtype="form" checked={field.value} onCheckedChange={field.onChange} disabled={form.formState.isSubmitting}/>
                      </FormControl>
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

export default SpinerOptionForm;
