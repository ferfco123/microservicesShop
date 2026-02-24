import React, { type Dispatch, type SetStateAction } from "react";

type Item = {
  title: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
};
export type Items = Item[];

export type CategoryFilterProps = {
  data: Items;
  searchParams: URLSearchParams;
  setSearchParams: Dispatch<SetStateAction<URLSearchParams>>;
};
