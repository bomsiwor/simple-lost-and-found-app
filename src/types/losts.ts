export interface IData {
    name: string;
    age: string;
    found: boolean;
    chronology: string;
    last_seen_location: string;
    owner: string;
    owner_contact: string;
    user: string;
    user_id: string;
    _id?: string;
}

export type TDataList = Pick<
    IData,
    "name" | "found" | "age" | "last_seen_location" | "_id" | "user_id"
>[]

export type TDataPayloadStore = Omit<
    IData,
    "_id"
>[]