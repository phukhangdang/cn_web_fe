import { FileRequestPayload } from "../../services/modules/file/file.request.payload";
import { FileService } from "../../services/modules/file/file.service";
import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from "@angular/core";

@Component({
  selector: "button-upload-file",
  templateUrl: "./button-upload-file.component.html",
  styleUrls: ["./button-upload-file.component.scss"],
})
export class ButtonUploadFileComponent implements OnInit {
  @ViewChild("file") file: any;
  @Output() uploaded: EventEmitter<any> = new EventEmitter();
  @Input() module: string;
  public fileName: any;

  constructor(
    private cdr: ChangeDetectorRef,
    public fileService: FileService
  ) {}

  ngOnInit() {}

  public onFileInputChange(files: File[]): void {
    const request = new FileRequestPayload();
    request.module = this.module;

    this.fileService.upload(files, request).subscribe((res) => {
      this.fileName = res[0].name;
      this.cdr.detectChanges();
      this.uploaded.emit(res[0]);
    });
  }
}
