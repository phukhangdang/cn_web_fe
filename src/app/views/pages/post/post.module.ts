import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { AuthGuard } from "../../../core/auth/_guard/auth.guard";
import { PostComponent } from "./post.component";

const routes: Routes = [
	{
		path: "",
		component: PostComponent,
		// canActivate: [AuthGuard],
	},
];

@NgModule({
	imports: [
        CommonModule,
		RouterModule.forChild(routes),
	],
	declarations: [
		PostComponent,
	],
})
export class PostModule { }