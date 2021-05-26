import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AuthGuard } from "../../../core/auth/_guard/auth.guard";
import { PostComponent } from "./post.component";

const routes: Routes = [
	{
		path: "",
		component: PostComponent,
		canActivate: [AuthGuard],
	},
];

@NgModule({
	imports: [
        CommonModule,
		FormsModule,
		ReactiveFormsModule,
		RouterModule.forChild(routes),
	],
	declarations: [
		PostComponent,
	],
})
export class PostModule { }