"use client";
import DefaultPageContainer, {
  THeaderOption,
} from "@/components/page-container/defaultPageContainer";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { trpc } from "@/app/_trpc/client";
import { toast } from "@/components/ui/use-toast";
import { useDebounce } from "use-debounce";
import MisteriForm from "./_form";
import MisteriLists from "./_lists";
import { TMisteriOption } from "@/lib/type/tmisteri";
import { MisteriFormConfig, MisteriOptionFormType } from "./config/formConfig";

interface misteriClientProps {
  data: {
    Lists: TMisteriOption[];
    count: number;
    totalPage: number;
  };
}

const MisteriPageClient = ({ data }: misteriClientProps) => {
  const headerOption: THeaderOption = {
    icon: "Gift",
    title: "Misteri Box",
  };
  const [tab, setTab] = useState("list");

  //Form Setup
  const form = useForm<MisteriOptionFormType>(MisteriFormConfig);
  const { mutate: createMisteriOption } = trpc.createMisteriOption.useMutation({
    onSuccess: ({ saveData }) => {
      if (saveData) {
        toast({
          title: "Misteri box option Saved",
          description: "Your data has been Save successfully",
          variant: "success",
        });
        form.reset();
        getMisteriboxOptionLists({ search: searchDebounce, skip: 0 });
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
  const { mutate: updateMisteriOption } = trpc.updateMisteriOption.useMutation({
    onSuccess: ({ saveData }) => {
      if (saveData) {
        toast({
          title: "Misteri Box option Updated",
          description: "Your data has been update successfully",
          variant: "success",
        });
        form.reset();
        getMisteriboxOptionLists({ search: searchDebounce, skip: 0 });
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
    onSubmit: (values: MisteriOptionFormType) => {
      if(values.id)
        updateMisteriOption(values)
      else
        createMisteriOption(values);
    },
    onCancel: () => {
      form.reset();
      setTab("list");
    },
  };
  //Lists Setup
  const { mutate: getMisteriboxOptionLists } = trpc.getMisteriboxOptionLists.useMutation({
    onSuccess: ({ Lists, count, totalPage, type }) => {
      setState((prevState) => ({
        ...prevState,
        misteriLists: Lists,
        currentPage:
          prevState.currentPage +
          (type === undefined ? 0 : type === "plus" ? 1 : -1),
        totalData: count,
        totalPage: totalPage,
      }));
    },
  });
  const { mutate: deleteMisteriOption} = trpc.deleteMisteriOption.useMutation({
    onSuccess: ({ deleteCount }) => {
      if (deleteCount) {
        getMisteriboxOptionLists({ search: searchDebounce, skip: 0 });
        setRowSelection({});
        toast({
          title: "Misteri Box Deleted",
          description: "Your data has been delete successfully",
          variant: "success",
        });
        form.reset();
        getMisteriboxOptionLists({ search: searchDebounce, skip: 0 });
      }
    },
  });
  const [rowSelection, setRowSelection] = useState({});
  const [state, setState] = useState({
    searchFilter: "",
    misteriLists: data.Lists,
    currentPage: 1,
    totalData: data.count,
    totalPage: data.totalPage,
  });
  const [searchDebounce] = useDebounce(state.searchFilter, 1000);

  const EventHandlerLists = {
    handleEdit: () => {
      const selected = Object.keys(rowSelection);
      const selectedvalue =
        state.misteriLists.find((item) => item.id === selected[0]) || {};
      form.reset(selectedvalue, { keepDefaultValues: true });
      setRowSelection({});
    },
    handleDelete: () => {
      const selected = Object.keys(rowSelection);
      deleteMisteriOption({ listId: selected });
    },
    updateTable: (type: boolean) => {
      const updatedPage = type ? state.currentPage + 1 : state.currentPage - 1;
      getMisteriboxOptionLists({
        search: searchDebounce,
        skip: (updatedPage - 1) * 10,
        type: type ? "plus" : "minus",
      });
    },
  };
  useEffect(() => {
    getMisteriboxOptionLists({ search: searchDebounce, skip: 0 });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchDebounce]);

  return (
    <DefaultPageContainer
      list={
        <MisteriLists
          headerOption={headerOption}
          data={{ state, setState }}
          selection={{ rowSelection, setRowSelection }}
          EventHandler={EventHandlerLists}
        />
      }
      form={
        <MisteriForm
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

export default MisteriPageClient;
