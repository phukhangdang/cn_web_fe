import { HttpService } from "./../../common/http/http.service";
import { Injectable } from "@angular/core";
import { Subscription, Observable } from "rxjs";
import { FileInfo, FileRequestPayload } from "./file.request.payload";
import * as FileSaver from "file-saver";
import { map } from "rxjs/operators";
import { HttpHeaders } from "@angular/common/http";
import { BaseResponse } from "../../common/http/base-response.model";

@Injectable({
  providedIn: "root",
})
export class FileService extends HttpService {
  constructor() {
    super();
    this.url = this.origin + "file";
  }

  public upload(
    files: File[],
    requestPayload: FileRequestPayload,
    isShowLoading?: boolean
  ): Observable<any> {
    requestPayload = !requestPayload
      ? new FileRequestPayload()
      : requestPayload;
    const formData = new FormData();
    const response = this.httpClient.post<any>(
      `${this.url}/upload`, // URL
      formData, // Form data
      {
        observe: "response",
        headers: new HttpHeaders({
          AccessToken: this.getCookie("AccessToken"),
        }),
        params: requestPayload.toParams(),
      }
    );

    for (const file of files) {
      formData.append("files", file, file.name);
    }

    return this.intercept(response, isShowLoading).pipe(map((r) => r.body));
  }

  public download(file: FileInfo): Subscription {
    const request = this.httpClient.get(`${this.url}/${file.id}`, {
      headers: this.getHeaders(),
      responseType: "blob",
    });

    return request.subscribe((response) => {
      FileSaver.saveAs(response, file.name);
    });
  }

  public delete(body: any, isSpinner?: boolean, params?: any): Observable<any> {
    return this.intercept(
      this.httpClient.post<any>(`${this.url}/delete`, JSON.stringify(body), {
        observe: "response",
        headers: this.getHeaders(),
        params: this.toParams(params),
      }),
      isSpinner
    ).pipe(map((r) => r.body));
  }
}
