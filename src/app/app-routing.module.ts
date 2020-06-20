import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { StateComponent } from './site/state/state.component';
import { HomeComponent } from './site/home/home.component';
import { CourseComponent } from './site/course/course.component';


const routes: Routes = [
  {path: 'home', component: HomeComponent},
  {path: 'state/:statecode', component: StateComponent},
  {path: 'courses', component: CourseComponent},
  {path: '', component: HomeComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
