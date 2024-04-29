import { Routes } from '@angular/router';

import { HomeComponent } from './home/home.component';
import { AuthComponent } from './auth/auth.component';
import { VideosComponent } from './videos/videos.component';

export const routes: Routes = [
    { path: '', component: HomeComponent },
    {path: 'auth', component: AuthComponent},
    // {
    //     path: 'auth', 
    //     loadComponent: () => import('./auth/auth.component').then((component) => { component.AuthComponent })
    // }, //lazyloading Authcomponent here
    { path: 'upload', component: VideosComponent }
];