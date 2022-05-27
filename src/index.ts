import { Paths, Visitor } from "./path";

/**
 * Only paths leading to string properties are allowed
 */
type IndexablePath<T extends {}> = {
  [Path in Paths<T>]: Visitor<T, Path> extends string ? Path : never;
}[Paths<T>];

type Index<
  T extends {},
  Indices extends ReadonlyArray<IndexablePath<T>>
> = Indices extends readonly [infer First, ...infer Rest]
  ? First extends string
    ? Visitor<T, First> extends string | number
      ? Rest extends IndexablePath<T>[]
        ? Record<Visitor<T, First>, Index<T, Rest>>
        : never
      : never
    : never
  : T[];

function get<Item extends {}, Path extends IndexablePath<Item>>(
  item: Item,
  path: Path
) {
  const keys = (path as string).split(".");

  let value: any = item;
  for (const key of keys) {
    value = value[key];
  }

  return value as Visitor<Item, Path>;
}

export function createIndex<
  T extends {},
  P extends ReadonlyArray<IndexablePath<T>>
>(items: Array<T> | ReadonlyArray<T>, paths: P): Index<T, P> {
  const index: any = {};

  for (const item of items) {
    const indicesValues = paths.map((index: any) => get(item, index));

    const last = indicesValues.pop() as any;

    let current = index;
    for (const indexValue of indicesValues as any[]) {
      current[indexValue] = current[indexValue] || {};
      current = current[indexValue];
    }

    current[last] = [...(current[last] || []), item];
  }

  return index;
}
