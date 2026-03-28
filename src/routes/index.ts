import { Router } from 'express';


type TModuleRoutes = {
    path: string;
    route: Router;
};

const router = Router();

import { AuthRoutes } from '../modules/Auth/auth.route';
import { UserRoutes } from '../modules/User/user.route';
import { MediaRoutes } from '../modules/Media/media.route';

const moduleRoutes: TModuleRoutes[] = [
    {
        path: '/auth',
        route: AuthRoutes,
    },
    {
        path: '/users',
        route: UserRoutes,
    },
    {
        path: '/media',
        route: MediaRoutes,
    },
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
