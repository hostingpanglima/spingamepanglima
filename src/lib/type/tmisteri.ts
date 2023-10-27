export type TMisteri = {
  id: string;
  memberId: string;
  codeVoucher: string;
  canExpired: boolean;
  expiredDate: Date | string | null;
  used: boolean
  priceId: string | null
  price: TMisteriOption | null;
}

export type TMisteriOption = {
  id: string;
  option: string
  category: string
}
export type gameOption = {
  id: string
  category: string
  option: string
  x: number
  y: number
  c: number
  open: boolean
}