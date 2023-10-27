"use client";
import DefaultPageContainer, {
  THeaderOption,
} from "@/components/page-container/defaultPageContainer";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { trpc } from "@/app/_trpc/client";
import { toast } from "@/components/ui/use-toast";
import { useDebounce } from "use-debounce";
import { MisteriFormConfig, MisteriFormType } from "./_config/formConfig";
import MisteriForm from "./_form";
import MisteriLists from "./_lists";
import { TMisteri, TMisteriOption } from "@/lib/type/tmisteri";

interface misteriClientProps {
  data: {
    Lists: TMisteri[];
    count: number;
    totalPage: number;
  }
}

const MisteriPageClient = ({ data }: misteriClientProps) => {
  const headerOption: THeaderOption = {
    icon: "Gift",
    title: "Misteri Box",
  };
  const [tab, setTab] = useState("list");
  
  const [priceOption,setPriceOption] = useState<TMisteriOption[]>([])
  //Form Setup
  const form = useForm<MisteriFormType>(MisteriFormConfig);
  const { mutate: createMisteribox } = trpc.createMisteribox.useMutation({
    onSuccess: ({ saveData }) => {
      if (saveData) {
        toast({
          title: "Misteri Box Saved",
          description: "Your data has been Save successfully",
          variant: "success",
        });
        form.reset();
        getMisteriboxLists({ search: searchDebounce, skip: 0 });
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
  const { mutate: updateMisteribox } = trpc.updateMisteribox.useMutation({
    onSuccess: ({ saveData }) => {
      if (saveData) {
        toast({
          title: "Misteri Box Updated",
          description: "Your data has been update successfully",
          variant: "success",
        });
        form.reset();
        getMisteriboxLists({ search: searchDebounce, skip: 0 });
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
    onSubmit: (values: MisteriFormType) => {
      if(values.id)
        updateMisteribox(values)
      else
        createMisteribox(values);
    },
    onCancel: () => {
      form.reset();
      setTab("list");
    },
  };
  //Lists Setup
  const { mutate: getMisteriboxLists } = trpc.getMisteriboxLists.useMutation({
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
  const { mutate: deleteMisteribox } = trpc.deleteMisteribox.useMutation({
    onSuccess: ({ deleteCount }) => {
      if (deleteCount) {
        getMisteriboxLists({ search: searchDebounce, skip: 0 });
        setRowSelection({});
        toast({
          title: "Misteri Box Deleted",
          description: "Your data has been delete successfully",
          variant: "success",
        });
        form.reset();
        getMisteriboxLists({ search: searchDebounce, skip: 0 });
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
      deleteMisteribox({ listId: selected });
    },
    updateTable: (type: boolean) => {
      const updatedPage = type ? state.currentPage + 1 : state.currentPage - 1;
      getMisteriboxLists({
        search: searchDebounce,
        skip: (updatedPage - 1) * 10,
        type: type ? "plus" : "minus",
      });
    },
  };
  useEffect(() => {
    getMisteriboxLists({ search: searchDebounce, skip: 0 });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchDebounce]);

  useEffect(() => {
    getMisteriboxOptionListsAll()
  },[])

  const { mutate: getMisteriboxOptionListsAll } = trpc.getMisteriboxOptionListsAll.useMutation({
    onSuccess: ({ data }) => {
      setPriceOption(data)
    },
  });

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
          priceOption={priceOption}
          EventHandler={EventHandler}
        />
      }
      headerOption={headerOption}
      tabs={{ tab, setTab }}
    />
  );
};

export default MisteriPageClient;
