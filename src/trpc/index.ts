import { db } from "@/db";
import { privateProcedure, publicProcedure, router } from "./trpc";
import { z } from "zod";
import bcrypt from "bcrypt";
import { TSpinerOption } from "@/lib/type/tspiner";
import { gameOption } from "@/lib/type/tmisteri";
import { TRPCError } from "@trpc/server";

export const appRouter = router({
  register: publicProcedure
    .input(z.object({
      username: z.string(),
      password: z.string()
    }))
    .mutation(async ({input}) => {
      const {username,password} = input
      const exist = await db.user.findUnique({
        where: {username: username}
      })
      if(exist) throw new TRPCError({code: 'BAD_REQUEST'})
      const hashedPassword = await bcrypt.hash(password,10)
      const user = await db.user.create({
        data: {
          username: username,
          password: hashedPassword
        }
      })

      return {user}
  }),
  changePassword: privateProcedure.input(z.object({
    userId: z.string(),
    password: z.string()
  })).mutation(async ({input}) => {
    const newPassword = await bcrypt.hash(input.password,10)
    const user = await db.user.update({
      where: {id: input.userId},
      data: {
        password: newPassword
      }
    })
    user.password=""
    return {user}
  }),
  //Lucky Spinner
  getLuckySpinerList: privateProcedure
    .input(
      z.object({
        skip: z.number(),
        search: z.string(),
        type: z.string().optional(),
      }),
    )
    .mutation(async ({ input }) => {
      const { skip, search, type } = input;
      const listsData = await db.$transaction([
        db.luckySpiner.findMany({
          where: {
            OR: [
              { memberId: { contains: search, mode: "insensitive" } },
              { codeVoucher: { contains: search, mode: "insensitive" } },
            ],
          },
          include: {
            price: true
          },
          skip: skip,
          take: 10,
        }),
        db.luckySpiner.count({
          where: {
            OR: [
              { memberId: { contains: search, mode: "insensitive" } },
              { codeVoucher: { contains: search, mode: "insensitive" } },
            ],
          },
        }),
      ]);
      const totalPage = Math.floor((listsData[1] + 10 - 1) / 10);
      return {
        Lists: listsData[0],
        count: listsData[1],
        totalPage: totalPage,
        type: type,
      };
    }),
  createLuckySpiner: privateProcedure
    .input(
      z.object({
        memberId: z.string().min(1, { message: "username required" }),
        codeVoucher: z.string().min(1, { message: "code voucher required" }),
        canExpired: z.boolean(),
        expiredDate: z.any().optional(),
        used: z.boolean(),
        priceId: z.string().optional()
      }),
    )
    .mutation(async ({ input }) => {
      const saveData = await db.luckySpiner.create({
        data: {...input}
      });
      return { saveData };
    }),
  deleteLuckySpiner: privateProcedure
    .input(z.object({ listId: z.array(z.string()) }))
    .mutation(async ({ input }) => {
      const { listId } = input;
      const deleteCount = await db.luckySpiner.deleteMany({
        where: {
          id: { in: listId },
        },
      });
      return { deleteCount };
    }),
  updateLuckySpiner: privateProcedure
    .input(
      z.object({
        id: z.string().optional(),
        memberId: z.string().min(1, { message: "username required" }),
        codeVoucher: z.string().min(1, { message: "code voucher required" }),
        canExpired: z.boolean(),
        expiredDate: z.any().optional(),
        used: z.boolean(),
        priceId: z.string().optional()
      }),
    )
    .mutation(async ({ input }) => {
      const data = { ...input };
      const saveData = await db.luckySpiner.update({
        where: { id: data.id },
        data: { ...input },
      });
      return { saveData };
    }),

  // Misteri Box
  getMisteriboxLists: privateProcedure
    .input(
      z.object({
        skip: z.number(),
        search: z.string(),
        type: z.string().optional(),
      }),
    )
    .mutation(async ({ input }) => {
      const { skip, search, type } = input;
      const listsData = await db.$transaction([
        db.misteribox.findMany({
          where: {
            OR: [
              { memberId: { contains: search, mode: "insensitive" } },
              { codeVoucher: { contains: search, mode: "insensitive" } },
            ],
          },
          include: {price:true},
          skip: skip,
          take: 10,
        }),
        db.misteribox.count({
          where: {
            OR: [
              { memberId: { contains: search, mode: "insensitive" } },
              { codeVoucher: { contains: search, mode: "insensitive" } },
            ],
          },
        }),
      ]);
      const totalPage = Math.floor((listsData[1] + 10 - 1) / 10);
      return {
        Lists: listsData[0],
        count: listsData[1],
        totalPage: totalPage,
        type: type,
      };
    }),
  createMisteribox: privateProcedure
    .input(
      z.object({
        memberId: z.string().min(1, { message: "username required" }),
        codeVoucher: z.string().min(1, { message: "code voucher required" }),
        canExpired: z.boolean(),
        expiredDate: z.any().optional(),
        used: z.boolean(),
        priceId: z.string().optional()
      }),
    )
    .mutation(async ({ input }) => {
      const saveData = await db.misteribox.create({
        data: { ...input },
      });
      return { saveData };
    }),
  deleteMisteribox: privateProcedure
    .input(z.object({ listId: z.array(z.string()) }))
    .mutation(async ({ input }) => {
      const { listId } = input;
      const deleteCount = await db.misteribox.deleteMany({
        where: {
          id: { in: listId },
        },
      });
      return { deleteCount };
    }),
  updateMisteribox: privateProcedure
    .input(
      z.object({
        id: z.string().optional(),
        memberId: z.string().min(1, { message: "username required" }),
        codeVoucher: z.string().min(1, { message: "code voucher required" }),
        canExpired: z.boolean(),
        expiredDate: z.any().optional(),
        used: z.boolean(),
        priceId: z.string().optional()
      }),
    )
    .mutation(async ({ input }) => {
      const data = { ...input };
      const saveData = await db.misteribox.update({
        where: { id: data.id },
        data: { ...input },
      });
      return { saveData };
    }),

  //Lucky Spiner Option
  getLuckySpinerOptionListAll: privateProcedure.mutation(async () => {
    const data = await db.luckySpinerOption.findMany()
    return {data}
  }),
  getLuckySpinerOptionClient: publicProcedure.query(async () => {
    const option:TSpinerOption[] = await db.luckySpinerOption.findMany()
    return {option}
  }),
  getLuckySpinerOptionList: privateProcedure
    .input(
      z.object({
        skip: z.number(),
        search: z.string(),
        type: z.string().optional(),
      }),
    )
    .mutation(async ({ input }) => {
      const { skip, search, type } = input;
      const listsData = await db.$transaction([
        db.luckySpinerOption.findMany({
          where: {
            OR: [
              { option: { contains: search, mode: "insensitive" } },
              { color: { contains: search, mode: "insensitive" } },
            ],
          },
          skip: skip,
          take: 10,
        }),
        db.luckySpinerOption.count({
          where: {
            OR: [
              { option: { contains: search, mode: "insensitive" } },
              { color: { contains: search, mode: "insensitive" } },
            ],
          },
        }),
      ]);
      const totalPage = Math.floor((listsData[1] + 10 - 1) / 10);
      return {
        Lists: listsData[0],
        count: listsData[1],
        totalPage: totalPage,
        type: type,
      };
    }),
  createLuckySpinerOption: privateProcedure
    .input(
      z.object({
        option: z.string(),
        color: z.string(),
        probability: z.number(),
        forceWin: z.boolean(),
      }),
    )
    .mutation(async ({ input }) => {
      
      if(input.forceWin){
        const saveData = await db.$transaction([
          db.luckySpinerOption.updateMany({
            where:{forceWin: true},
            data: {forceWin: false}
          }),
          db.luckySpinerOption.create({
            data: { ...input },
          })
        ])
        return { saveData: saveData[1] };
      }else{
        const saveData = await db.luckySpinerOption.create({
          data: { ...input },
        })
        
        return { saveData };
      }
    }),
  deleteLuckySpinerOption: privateProcedure
    .input(z.object({ listId: z.array(z.string()) }))
    .mutation(async ({ input }) => {
      const { listId } = input;
      const deleteCount = await db.luckySpinerOption.deleteMany({
        where: {
          id: { in: listId },
        },
      });
      return { deleteCount };
    }),
  updateLuckySpinerOption: privateProcedure
    .input(
      z.object({
        id: z.string().optional(),
        option: z.string(),
        color: z.string(),
        probability: z.number(),
        forceWin: z.boolean(),
      }),
    )
    .mutation(async ({ input }) => {
      const data = { ...input }
      if(data.forceWin){
        const saveData = await db.$transaction([
          db.luckySpinerOption.updateMany({
            where:{forceWin: true},
            data: {forceWin: false}
          }),
          db.luckySpinerOption.update({
            where: { id: data.id },
            data: { ...input },
          })
        ])
        return { saveData: saveData[1] };
      }else{
        const saveData = await db.luckySpinerOption.update({
          where: { id: data.id },
          data: { ...input },
        });
        
        return { saveData };
      }
    }),

  // Misteri Box
  getMisteriboxOptionListsAll: privateProcedure.mutation(async () => {
    const data = await db.misteriboxOption.findMany()
    return {data}
  }),
  getMisteriboxOptionClient: publicProcedure.query(async () => {
    const option = await db.misteriboxOption.findMany()
    let optionData:gameOption[] = []
    option.map((item,index) => {
      optionData.push({
        id: item.id,
        option: item.option,
        category: item.category,
        x: 0,
        y: 0,
        c: index,
        open: false
      })
    })
    return {option: optionData}
  }),
  getMisteriboxOptionLists: privateProcedure
    .input(
      z.object({
        skip: z.number(),
        search: z.string(),
        type: z.string().optional(),
      }),
    )
    .mutation(async ({ input }) => {
      const { skip, search, type } = input;
      const listsData = await db.$transaction([
        db.misteriboxOption.findMany({
          where: {
            OR: [
              { option: { contains: search, mode: "insensitive" } },
              { category: { contains: search, mode: "insensitive" } }
            ],
          },
          skip: skip,
          take: 10,
        }),
        db.misteriboxOption.count({
          where: {
            OR: [
              { option: { contains: search, mode: "insensitive" } },
              { category: { contains: search, mode: "insensitive" } }
            ],
          },
        }),
      ]);
      const totalPage = Math.floor((listsData[1] + 10 - 1) / 10);
      return {
        Lists: listsData[0],
        count: listsData[1],
        totalPage: totalPage,
        type: type,
      };
    }),
  //misteri option
  createMisteriOption: privateProcedure
    .input(
      z.object({
        option: z.string().min(1, { message: "option required" }),
        category: z.string()
      }),
    )
    .mutation(async ({ input }) => {
      const saveData = await db.misteriboxOption.create({
        data: { ...input },
      });
      return { saveData };
    }),
  deleteMisteriOption: privateProcedure
    .input(z.object({ listId: z.array(z.string()) }))
    .mutation(async ({ input }) => {
      const { listId } = input;
      const deleteCount = await db.misteriboxOption.deleteMany({
        where: {
          id: { in: listId },
        },
      });
      return { deleteCount };
    }),
  updateMisteriOption: privateProcedure
    .input(
      z.object({
        id: z.string().optional(),
        option: z.string().min(1, { message: "option required" }),
        category: z.string()
      }),
    )
    .mutation(async ({ input }) => {
      const data = { ...input };
      const saveData = await db.misteriboxOption.update({
        where: { id: data.id },
        data: { ...input },
      });
      return { saveData };
    }),

  //game
  checkCoupon: publicProcedure.input(z.object({memberId: z.string(),codeVoucher: z.string()})).mutation(async ({input}) => {
    const data = {...input}
    const getData = await db.luckySpiner.findFirst({where: {
      memberId: {equals:data.memberId,mode:'insensitive'},
      codeVoucher: {equals: data.codeVoucher,mode:'insensitive'},
      used: false,
    },include:{price:true}})
    if(getData?.canExpired && getData.expiredDate && getData.expiredDate < new Date()){
      return {getData: null}
    }
    return {getData}
  }),

  checkCouponMB: publicProcedure.input(z.object({memberId: z.string(),codeVoucher: z.string()})).mutation(async ({input}) => {
    const data = {...input}
    const getData = await db.misteribox.findFirst({where: {
      memberId: {equals:data.memberId,mode:'insensitive'},
      codeVoucher: {equals: data.codeVoucher,mode:'insensitive'},
      used: false
    },include:{price:true}})
    if(getData?.canExpired && getData.expiredDate && getData.expiredDate < new Date()){
      return {getData: null}
    }
    return {getData}
  }),

  updateCoupon: publicProcedure.input(z.object({id: z.string(),price: z.string()})).mutation(async ({input}) => {
    const saveData = await db.luckySpiner.update({where: {
      id: input.id
    },
    data: {
      priceId: input.price,
      used: true
    }
  })
  return {saveData}
  }),
  updateCouponMB: publicProcedure.input(z.object({id: z.string()})).mutation(async ({input}) => {
    const saveData = await db.misteribox.update({where: {
      id: input.id
    },
    data: {
      used: true
    }
  })
  return {saveData}
  })
});

export type AppRouter = typeof appRouter;
