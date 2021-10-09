import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { AuthService } from '../app/services/auth.service';
import { HttpClientModule } from '@angular/common/http'
import { AppRoutingModule } from './app-routing.module';
import { SongFormComponent } from './song/song-form/song-form.component';
import { SongComponent } from './song/song.component';
import { SongService } from './song/song.service';
import { AuthGuardService } from '../app/services/auth-guard.service';


@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    SongFormComponent,
    SongComponent,
  ],
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    HttpClientModule,
    AppRoutingModule
  ],
  providers: [AuthService, SongService, AuthGuardService],
  bootstrap: [AppComponent]
})
export class AppModule { }
