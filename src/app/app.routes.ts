import { Routes } from '@angular/router';
import { Login } from './pages/login/login';
import { authGuard } from './core/guards/auth-guard';


export const routes: Routes = [
    {
        path:'',
        component: Login
    },
    {
        path:'login',
        component: Login
    },
    {
        path:"orders",
        canActivate: [authGuard],
        loadComponent:()=>import('./pages/orders/orders').then(c=>c.Orders)
    },
    {
        path:'**',
        component: Login
    }
];
