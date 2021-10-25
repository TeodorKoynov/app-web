import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { AuthService } from '../app/services/auth.service';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http'
import { AppRoutingModule } from './app-routing.module';
import { SongFormComponent } from './song/song-form/song-form.component';
import { SongComponent } from './song/song.component';
import { SongService } from './song/song.service';
import { AuthGuardService } from '../app/services/auth-guard.service';
import { TokenInterceptorService } from './services/token-interceptor.service';
import { SongListComponent } from './song/song-list/song-list.component';
import { SongDetailsComponent } from './song/song-details/song-details.component';
import { NavigationComponent } from './navigation/navigation.component';
import { HeaderComponent } from './header/header.component';


@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    SongFormComponent,
    SongComponent,
    SongListComponent,
    SongDetailsComponent,
    NavigationComponent,
    HeaderComponent,
  ],
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    HttpClientModule,
    AppRoutingModule
  ],
  providers: [
    AuthService, 
    SongService, 
    AuthGuardService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptorService,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
