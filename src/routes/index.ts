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
import { PaymentRoutes } from '../modules/Payment/payment.route';
import { AdminRoutes } from '../modules/Admin/admin.route';


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
        path: '/admin',
        route: AdminRoutes,
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
    {
        path: '/payments',
        route: PaymentRoutes,
    },
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
