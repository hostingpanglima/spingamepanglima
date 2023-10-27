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
import { luckyspinnerFormType } from "./_config/formconfig";
import { UseFormReturn } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import Datepicker from "@/components/ui/datepicker";
import { Button } from "@/components/ui/button";
import { TSpinerOption } from "@/lib/type/tspiner";
import Combobox from "@/components/ui/combobox";
interface LuckySpinerFormProps {
  headerOption: THeaderOption;
  form: UseFormReturn<luckyspinnerFormType>;
  EventHandler: {
    onSubmit: (values: luckyspinnerFormType) => void;
    onCancel: () => void;
  };
  priceOption: TSpinerOption[]
}

const LuckyspinerForm = ({
  headerOption,
  form,
  EventHandler,
  priceOption
}: LuckySpinerFormProps) => {
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
                  name="memberId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Member ID</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Member ID..."
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
                  name="codeVoucher"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Code Voucher</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Code Voucher..."
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
                  name="expiredDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Expired Date</FormLabel>
                        <FormControl>
                          <Datepicker {...field} disabled={!form.getValues("canExpired") || form.formState.isSubmitting}/>
                        </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="canExpired"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Can Expired</FormLabel>
                      <FormControl className="ml-2">
                        <Checkbox cbtype="form" checked={field.value} onCheckedChange={field.onChange} disabled={form.formState.isSubmitting}/>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="priceId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Price</FormLabel>
                      <FormControl className="ml-2">
                        <Combobox Lists={priceOption} {...field} name="Price"/>
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

export default LuckyspinerForm;
