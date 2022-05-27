type IsTuple<T> = T extends Array<any> // A tuple should be an array
  ? T["length"] extends number // the length of the array should be a number
    ? number extends T["length"] // the length of the array should be a literal number
      ? false
      : true
    : true
  : false;

type IsEmptyTuple<T extends Array<any>> = T["length"] extends 0 ? true : false;

/**
 * The Trail is the path to the current position
 * If Trail is empty return Property without leading dot
 */
type FormatPath<
  Trail extends string,
  Property extends string | number
> = Trail extends "" ? `${Property}` : `${Trail}.${Property}`;

/**
 * Simple iteration through object properties
 */
type BrowseObject<Current, Trail extends string> = {
  [Property in keyof Current]:
    | FormatPath<Trail, Property & string> // save the intermediate path
    | Paths<Current[Property], FormatPath<Trail, Property & string>>; // and continue recursively aggregating paths
}[keyof Current];

export type Paths<
  Current,
  Trail extends string = ""
> = Current extends PropertyKey
  ? Trail // return Trail if we reach the end of a path
  : Current extends Array<unknown> // if Obj is Array (can be array, tuple, empty tuple)
  ? IsTuple<Current> extends true // and is tuple
    ? IsEmptyTuple<Current> extends true // and tuple is empty
      ? Paths<PropertyKey, FormatPath<Trail, -1>> // call recursively Path with `-1` as an allowed index
      : BrowseObject<Current, Trail> // if tuple is not empty we can handle it as regular object
    : Paths<Current[number], FormatPath<Trail, number>> // if Obj is regular array call Path with union of all elements
  : BrowseObject<Current, Trail>; // if Obj is neither Array nor Tuple nor Primitive - treat is as object

type FollowPath<Obj, Property extends string> = Property extends keyof Obj
  ? Obj[Property]
  : never;

export type Visitor<
  Obj,
  Path extends string
> = Path extends `${infer Property}.${infer Rest}` // Retrieve the first property to explore the object with
  ? Visitor<FollowPath<Obj, Property>, Rest> // Recursively explore the object using the remaining properties
  : Path extends `${infer Last}` // Or the last property to retrieve the value
  ? FollowPath<Obj, Last> // call reducer with last part
  : never;
