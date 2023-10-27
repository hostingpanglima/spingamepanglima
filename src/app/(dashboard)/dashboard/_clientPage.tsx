"use client";
import DefaultPageContainer, {
  THeaderOption,
} from "@/components/page-container/defaultPageContainer";
import { useEffect, useState } from "react";
import LuckyspinerForm from "./_form";
import { useForm } from "react-hook-form";
import {
  luckyspinerFormConfig,
  luckyspinnerFormType,
} from "./_config/formconfig";
import { trpc } from "@/app/_trpc/client";
import { toast } from "@/components/ui/use-toast";
import { TSpiner, TSpinerOption } from "@/lib/type/tspiner";
import SpinerLists from "./_lists";
import { useDebounce } from "use-debounce";

interface SpinclientProps {
  data: {
    Lists: TSpiner[];
    count: number;
    totalPage: number;
  }
}

const LuckyspinPageClient = ({ data}: SpinclientProps) => {
  const headerOption: THeaderOption = {
    icon: "Spin",
    title: "Spinner",
  };
  const [priceOption,setPriceOption] = useState<TSpinerOption[]>([])
  const [tab, setTab] = useState("list");

  //Form Setup
  const form = useForm<luckyspinnerFormType>(luckyspinerFormConfig);
  const { mutate: createLuckySpiner } = trpc.createLuckySpiner.useMutation({
    onSuccess: ({ saveData }) => {
      if (saveData) {
        toast({
          title: "Lucky Spiner Saved",
          description: "Your data has been Save successfully",
          variant: "success",
        });
        form.reset();
        getLuckySpinerList({ search: searchDebounce, skip: 0 });
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
  const { mutate: updateLuckySpiner } = trpc.updateLuckySpiner.useMutation({
    onSuccess: ({ saveData }) => {
      if (saveData) {
        toast({
          title: "Lucky Spiner Updated",
          description: "Your data has been update successfully",
          variant: "success",
        });
        form.reset();
        getLuckySpinerList({ search: searchDebounce, skip: 0 });
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
    onSubmit: (values: luckyspinnerFormType) => {
      if(values.id)
        updateLuckySpiner(values)
      else
      createLuckySpiner(values);
      
      form.reset()
    },
    onCancel: () => {
      form.reset();
      setTab("list");
    },
  };
  //Lists Setup
  const { mutate: getLuckySpinerList } = trpc.getLuckySpinerList.useMutation({
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
  const { mutate: deleteLuckySpiner } = trpc.deleteLuckySpiner.useMutation({
    onSuccess: ({ deleteCount }) => {
      if (deleteCount) {
        getLuckySpinerList({ search: searchDebounce, skip: 0 });
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
      deleteLuckySpiner({ listId: selected });
    },
    updateTable: (type: boolean) => {
      const updatedPage = type ? state.currentPage + 1 : state.currentPage - 1;
      getLuckySpinerList({
        search: searchDebounce,
        skip: (updatedPage - 1) * 10,
        type: type ? "plus" : "minus",
      });
    },
  };
  useEffect(() => {
    getLuckySpinerList({ search: searchDebounce, skip: 0 });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchDebounce]);

  useEffect(() => {
    getLuckySpinerOptionListAll()
  },[])

  const { mutate: getLuckySpinerOptionListAll } = trpc.getLuckySpinerOptionListAll.useMutation({
    onSuccess: ({ data }) => {
      setPriceOption(data)
    },
  });

  return (
    <DefaultPageContainer
      list={
        <SpinerLists
          headerOption={headerOption}
          data={{ state, setState }}
          selection={{ rowSelection, setRowSelection }}
          EventHandler={EventHandlerLists}
        />
      }
      form={
        <LuckyspinerForm
          priceOption={priceOption}
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

export default LuckyspinPageClient;
