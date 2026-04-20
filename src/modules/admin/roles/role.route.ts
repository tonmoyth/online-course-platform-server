import { Router } from 'express';
import validateRequest from '../../../middlewares/validateRequest';
import { RoleValidations } from './role.validation';
import { RoleController } from './role.controller';

const router = Router();

router.post(
    '/',
    validateRequest(RoleValidations.createRoleValidationSchema),
    RoleController.createRole
);

router.patch(
    '/:id',
    validateRequest(RoleValidations.updateRoleValidationSchema),
    RoleController.updateRole
);

router.delete(
    '/:id',
    RoleController.deleteRole
);

export const RoleRoutes = router;
