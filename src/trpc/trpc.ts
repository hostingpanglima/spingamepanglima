import { authOptions } from '@/lib/authOptions';
import { TRPCError, initTRPC } from '@trpc/server';
import { getServerSession } from 'next-auth';
import { stringify } from 'querystring';
 
const t = initTRPC.create();
const middleware = t.middleware

const isAuth = middleware(async (opts)=> {
  const session = await getServerSession(authOptions)
  const user = session?.user
  if(!user || !user.id){
    throw new TRPCError({code: "UNAUTHORIZED"})
  }

  return opts.next({ctx: {userId: session.user.id, user: session.user}})
})

export const router = t.router;
export const publicProcedure = t.procedure;
export const privateProcedure = t.procedure.use(isAuth)