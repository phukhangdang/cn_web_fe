import { FileInfo } from "../../services/modules/file/file.request.payload";
import { FileService } from "../../services/modules/file/file.service";
import { Component, Input, OnInit } from "@angular/core";

@Component({
  selector: "button-download-file",
  templateUrl: "./button-download-file.component.html",
  styleUrls: ["./button-download-file.component.scss"],
})
export class ButtonDownloadFileComponent implements OnInit {
  @Input() file: any;

  constructor(public fileService: FileService) {}

  ngOnInit() {}

  public onDownloadFile(): void {
    const fileInfo = new FileInfo();
    fileInfo.id = this.file.id;
    fileInfo.name = this.file.name;
    this.fileService.download(fileInfo);
  }
}
