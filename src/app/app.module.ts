import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BarRatingModule } from 'ngx-bar-rating';
import { RatingModule } from 'ng-starrating';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './site/home/home.component';
import { DatePipe, AsyncPipe } from '@angular/common';
import { NewsComponent } from './site/news/news.component';
import { StateComponent } from './site/state/state.component';
import { HeaderComponent } from './site/header/header.component';
import { CourseComponent } from './site/course/course.component';

import { AngularFireModule } from '@angular/fire';
import { environment } from '../environments/environment';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireStorageModule } from '@angular/fire/storage';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { CourseInfoComponent } from './site/course-info/course-info.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    NewsComponent,
    StateComponent,
    HeaderComponent,
    CourseComponent,
    CourseInfoComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    AngularFireModule.initializeApp(environment.firebaseConfig, 'covid-nineteen'),
    AngularFirestoreModule,     // Only required for database features
    AngularFireAuthModule,     // Only required for auth features,
    AngularFireStorageModule,
    BarRatingModule,
    RatingModule
  ],
  providers: [DatePipe, AsyncPipe],
  bootstrap: [AppComponent]
})
export class AppModule { }
