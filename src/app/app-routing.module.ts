import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', redirectTo: 'start', pathMatch: 'full' },
  { path: 'start', loadChildren: () => import('./start/start.module').then(m => m.StartPageModule) },
  {
    path: 'login-auth',
    loadChildren: () => import('./login-auth/login-auth.module').then(m => m.LoginAuthPageModule)
  },
  {
    path: 'map',
    loadChildren: () => import('./map/map.module').then(m => m.MapPageModule)
  },
  {
    path: 'entry-form/:id',
    loadChildren: () => import('./place-entry-form/place-entry-form.module').then(m => m.PlaceEntryFormPageModule)
  },
  {
    path: 'entry-form',
    loadChildren: () => import('./place-entry-form/place-entry-form.module').then(m => m.PlaceEntryFormPageModule)
  },
  { path: '**', redirectTo: 'start', pathMatch: 'full' },

];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
