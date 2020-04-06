
export interface IRelationInstance {
    relationDefinitionId: string;
    entityAId: string;
    entityBId: string;
    userId: string;
    isValid: boolean;
    deleted: boolean;
    createdAt?: Date;
    updatedAt?: Date;
}
