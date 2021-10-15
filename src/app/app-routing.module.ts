import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { AuthGuardService } from './services/auth-guard.service';
import { SongFormComponent } from './song/song-form/song-form.component';
import { SongListComponent } from './song/song-list/song-list.component';
import { SongDetailsComponent } from './song/song-details/song-details.component';


const routes: Routes = [
  {path: 'login', component: LoginComponent},
  {path: 'register', component: RegisterComponent},
  {path: 'song/create', component: SongFormComponent, canActivate: [AuthGuardService]},
  {path: 'song', component: SongListComponent, canActivate: [AuthGuardService]},
  {path: 'song/:id', component: SongDetailsComponent, canActivate: [AuthGuardService]}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
