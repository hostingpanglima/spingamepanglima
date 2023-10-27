"use client";
import DefaultPageContainer, {
  THeaderOption,
} from "@/components/page-container/defaultPageContainer";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { trpc } from "@/app/_trpc/client";
import { toast } from "@/components/ui/use-toast";
import { TSpiner, TSpinerOption } from "@/lib/type/tspiner";
import { useDebounce } from "use-debounce";
import { SpinOptionFormConfig, SpinOptionFormType } from "./_config/formConfig";
import SpinerOptionForm from "./_form";
import SpinnerOptionLists from "./_lists";

interface SpinclientProps {
  data: {
    Lists: TSpinerOption[];
    count: number;
    totalPage: number;
  };
}

const SpinSetupPageClient = ({ data }: SpinclientProps) => {
  const headerOption: THeaderOption = {
    icon: "Spin",
    title: "Spinner",
  };
  const [tab, setTab] = useState("list");

  //Form Setup
  const form = useForm<SpinOptionFormType>(SpinOptionFormConfig);
  const { mutate: createLuckySpinerOption } = trpc.createLuckySpinerOption.useMutation({
    onSuccess: ({ saveData }) => {
      if (saveData) {
        toast({
          title: "Lucky Spiner Saved",
          description: "Your data has been Save successfully",
          variant: "success",
        });
        form.reset();
        getLuckySpinerOptionList({ search: searchDebounce, skip: 0 });
      }
      if (!saveData) {
        toast({
          title: "There was a problem...",
          description: "Please try again in a moment",
          variant: "destructive",
        });
      }
    },
  });
  const { mutate: updateLuckySpinerOption } = trpc.updateLuckySpinerOption.useMutation({
    onSuccess: ({ saveData }) => {
      if (saveData) {
        toast({
          title: "Lucky Spiner Updated",
          description: "Your data has been update successfully",
          variant: "success",
        });
        form.reset();
        getLuckySpinerOptionList({ search: searchDebounce, skip: 0 });
      }
      if (!saveData) {
        toast({
          title: "There was a problem...",
          description: "Please try again in a moment",
          variant: "destructive",
        });
      }
    },
  });
  const EventHandler = {
    onSubmit: (values: SpinOptionFormType) => {
      if(values.id)
        updateLuckySpinerOption(values)
      else
        createLuckySpinerOption(values);
    },
    onCancel: () => {
      form.reset();
      setTab("list");
    },
  };
  //Lists Setup
  const { mutate: getLuckySpinerOptionList } = trpc.getLuckySpinerOptionList.useMutation({
    onSuccess: ({ Lists, count, totalPage, type }) => {
      setState((prevState) => ({
        ...prevState,
        spinerLists: Lists,
        currentPage:
          prevState.currentPage +
          (type === undefined ? 0 : type === "plus" ? 1 : -1),
        totalData: count,
        totalPage: totalPage,
      }));
    },
  });
  const { mutate: deleteLuckySpinerOption } = trpc.deleteLuckySpinerOption.useMutation({
    onSuccess: ({ deleteCount }) => {
      if (deleteCount) {
        getLuckySpinerOptionList({ search: searchDebounce, skip: 0 });
        setRowSelection({});
        toast({
          title: "Lucky Spiner Deleted",
          description: "Your data has been delete successfully",
          variant: "success",
        });
      }
    },
  });
  const [rowSelection, setRowSelection] = useState({});
  const [state, setState] = useState({
    searchFilter: "",
    spinerLists: data.Lists,
    currentPage: 1,
    totalData: data.count,
    totalPage: data.totalPage,
  });
  const [searchDebounce] = useDebounce(state.searchFilter, 1000);

  const EventHandlerLists = {
    handleEdit: () => {
      const selected = Object.keys(rowSelection);
      const selectedvalue =
        state.spinerLists.find((item) => item.id === selected[0]) || {};
      form.reset(selectedvalue, { keepDefaultValues: true });
      setRowSelection({});
    },
    handleDelete: () => {
      const selected = Object.keys(rowSelection);
      deleteLuckySpinerOption({ listId: selected });
    },
    updateTable: (type: boolean) => {
      const updatedPage = type ? state.currentPage + 1 : state.currentPage - 1;
      getLuckySpinerOptionList({
        search: searchDebounce,
        skip: (updatedPage - 1) * 10,
        type: type ? "plus" : "minus",
      });
    },
  };
  useEffect(() => {
    getLuckySpinerOptionList({ search: searchDebounce, skip: 0 });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchDebounce]);

  return (
    <DefaultPageContainer
      list={
        <SpinnerOptionLists
          headerOption={headerOption}
          data={{ state, setState }}
          selection={{ rowSelection, setRowSelection }}
          EventHandler={EventHandlerLists}
        />
      }
      form={
        <SpinerOptionForm
          headerOption={headerOption}
          form={form}
          EventHandler={EventHandler}
        />
      }
      headerOption={headerOption}
      tabs={{ tab, setTab }}
    />
  );
};

export default SpinSetupPageClient;
