// Angular
import { RouterModule } from "@angular/router";
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
// components
import { ButtonUploadFileComponent } from "./button-upload-file/button-upload-file.component";
import { ButtonDownloadFileComponent } from "./button-download-file/button-download-file.component";

@NgModule({
  declarations: [ButtonUploadFileComponent, ButtonDownloadFileComponent],
  exports: [ButtonUploadFileComponent, ButtonDownloadFileComponent],
  imports: [CommonModule, RouterModule, FormsModule, ReactiveFormsModule],
  providers: [],
})
export class ComponentsModule {}
