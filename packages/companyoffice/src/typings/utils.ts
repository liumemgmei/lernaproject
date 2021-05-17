export const tuple = <T extends string[]>(...args: T) => args;
export const tupleNum = <T extends number[]>(...args: T) => args;
export type Page = { pageIndex: number; pageSize: number };
export type PageTable<T> = { pageIndex: number; pageSize: number; totalCount: number; totalPage: number; list: T[] };