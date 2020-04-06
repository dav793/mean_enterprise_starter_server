import { Request, Response, NextFunction } from 'express';

import { requestMetadataSingleton as ReqMetadataFactory} from '../../shared/helpers/request-metadata-factory';

import { relationDefinitionControllerSingleton as RelationDefinitionController } from './relation-definition/relation-definition-controller';
import { relationInstanceControllerSingleton as RelationInstanceController } from './relation-instance/relation-instance-controller';
import { IRelationDefinitionModel } from './relation-definition/relation-definition-model';
import { IRelationInstanceModel } from './relation-instance/relation-instance-model';

class RelationExpressLayer {
    constructor() { }

    public getAllRelationDefinitions(req: Request, res: Response, next: NextFunction) {
        RelationDefinitionController.getRelationDefinitions().subscribe(
            (definitions: IRelationDefinitionModel[]) => res.status(200).json(definitions),
            err => next(err)
        );
    }

    public getAllRelationInstances(req: Request, res: Response, next: NextFunction) {
        RelationInstanceController.getRelationInstances().subscribe(
            (instances: IRelationInstanceModel[]) => res.status(200).json(instances),
            err => next(err)
        );
    }

    public getRelationDefinitionById(req: Request, res: Response, next: NextFunction) {
        const definitionId = req.params.id;

        RelationDefinitionController.getRelationDefinitionById(definitionId).subscribe(
            (definition: IRelationDefinitionModel) => res.status(200).json(definition),
            err => next(err)
        );
    }

    public getRelationInstanceById(req: Request, res: Response, next: NextFunction) {
        const instanceId = req.params.id;

        RelationInstanceController.getRelationInstanceById(instanceId).subscribe(
            (instance: IRelationInstanceModel) => res.status(200).json(instance),
            err => next(err)
        );
    }

    public createRelationDefinition(req: Request, res: Response, next: NextFunction) {
        const definitionData: any = req.body;
        const meta = ReqMetadataFactory.create(req);

        RelationDefinitionController.createRelationDefinition(definitionData, meta).subscribe(
            (definition: IRelationDefinitionModel) => res.status(200).json(definition),
            err => next(err)
        );
    }

    public createRelationInstance(req: Request, res: Response, next: NextFunction) {
        const instanceData: any = req.body;
        const meta = ReqMetadataFactory.create(req);

        RelationInstanceController.createRelationInstance(instanceData, meta).subscribe(
            (instance: IRelationInstanceModel) => res.status(200).json(instance),
            err => next(err)
        );
    }

    public updateRelationDefinition(req: Request, res: Response, next: NextFunction) {
        const definitionId = req.params.id;
        const definitionData: any = req.body;
        const meta = ReqMetadataFactory.create(req);

        RelationDefinitionController.updateRelationDefinition(definitionId, definitionData, meta).subscribe(
            (definition: IRelationDefinitionModel) => res.status(200).json(definition),
            err => next(err)
        );
    }

    public updateRelationInstance(req: Request, res: Response, next: NextFunction) {
        const instanceId = req.params.id;
        const instanceData: any = req.body;
        const meta = ReqMetadataFactory.create(req);

        RelationInstanceController.updateRelationInstance(instanceId, instanceData, meta).subscribe(
            (definition: IRelationInstanceModel) => res.status(200).json(definition),
            err => next(err)
        );
    }

    public deleteRelationDefinition(req: Request, res: Response, next: NextFunction) {
        const definitionId = req.params.id;
        const meta = ReqMetadataFactory.create(req);

        RelationDefinitionController.deleteRelationDefinition(definitionId, meta).subscribe(
            (result: boolean) => res.status(200).json(result),
            err => next(err)
        );
    }

    public deleteRelationInstance(req: Request, res: Response, next: NextFunction) {
        const instanceId = req.params.id;
        const meta = ReqMetadataFactory.create(req);

        RelationInstanceController.deleteRelationInstance(instanceId, meta).subscribe(
            (result: boolean) => res.status(200).json(result),
            err => next(err)
        );
    }
}

export const RelationExpressLayerSingleton = new RelationExpressLayer();
