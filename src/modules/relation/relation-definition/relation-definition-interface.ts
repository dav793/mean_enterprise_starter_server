
export interface IRelationDefinition {
    description: string;
    entityTypeA: string;
    entityTypeB: string;
    deleted: boolean;
    createdAt?: Date;
    updatedAt?: Date;
}
