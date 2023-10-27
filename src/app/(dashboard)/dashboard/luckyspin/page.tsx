import { db } from "@/db";
import SpinSetupPageClient from "./_clientPage";

const LuckySpinSetupPage = async () => {
  const listsData = await db.$transaction([db.luckySpinerOption.findMany({skip: 0,take: 10}),db.luckySpinerOption.count({})])
  const totalPage = (listsData[1]+10-1)/10
  return (
    <SpinSetupPageClient data={{Lists: listsData[0], count: listsData[1], totalPage: totalPage}}/>
  );
}

export default LuckySpinSetupPage;