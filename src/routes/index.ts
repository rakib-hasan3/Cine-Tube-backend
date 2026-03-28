import { Router } from 'express';


type TModuleRoutes = {
    path: string;
    route: Router;
};

const router = Router();

import { AuthRoutes } from '../modules/Auth/auth.route';
import { UserRoutes } from '../modules/User/user.route';
import { MediaRoutes } from '../modules/Media/media.route';
import { ReviewRoutes } from '../modules/Review/review.route';
import { LikeRoutes } from '../modules/Like/like.route';
import { CommentRoutes } from '../modules/Comment/comment.route';
import { WatchlistRoutes } from '../modules/Watchlist/watchlist.route';
import { PurchaseRoutes } from '../modules/Purchase/purchase.route';

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
    {
        path: '/reviews',
        route: ReviewRoutes,
    },
    {
        path: '/reviews',
        route: LikeRoutes,
    },
    {
        path: '/comments',
        route: CommentRoutes,
    },
    {
        path: '/watchlist',
        route: WatchlistRoutes,
    },
    {
        path: '/purchases',
        route: PurchaseRoutes,
    },
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
