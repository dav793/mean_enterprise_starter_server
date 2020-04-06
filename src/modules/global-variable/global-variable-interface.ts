
export interface IGlobalVariable {
    name: string;
    value: ILastEntityIdentifiers | any;
    deleted: boolean;
}

export interface ILastEntityIdentifiers {
    case: string|null;
}
