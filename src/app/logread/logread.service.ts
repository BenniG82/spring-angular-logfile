import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {BehaviorSubject, merge, Observable, Subject, timer} from 'rxjs';

const headers = new HttpHeaders().append('Authorization', `Basic ${(btoa('user:password'))}`);

@Injectable({
  providedIn: 'root'
})
export class LogreadService {

  private fileContentSubject: Subject<string> = new Subject();
  private readNextChunkSubject: Subject<void> = new Subject();
  private oldLength = 0;

  constructor(private http: HttpClient) {
  }

  readAndPollFile(url: string): Observable<string> {
    this.initializePolling(url);
    return this.fileContentSubject.asObservable();
  }

  private initializePolling(url: string) {
    merge(timer(0, 1000), this.readNextChunkSubject.asObservable())
      .subscribe(() => {
        const headersWithRange = headers.append('Range', `bytes=${this.oldLength}-${this.oldLength + (10 * 1024 * 1024)}`);
        this.http.get(url, {headers: headersWithRange, responseType: 'text', observe: 'response'})
          .subscribe(response => {
              const contentRange = response.headers.get('Content-Range');
              // content range looks like this: 	"bytes 90117-90352/91353"
              // but we are only interested in the end of the current chunk => 90352 and the total length => 91353
              const totalLength = Number(contentRange.substring(contentRange.indexOf('/') + 1));
              this.oldLength = Number(contentRange.substring(contentRange.indexOf('-') + 1, contentRange.indexOf('/'))) + 1;
              if (this.oldLength + 1 < totalLength) {
                console.log('Need to load more data');
                this.readNextChunkSubject.next(null);
              }
              this.fileContentSubject.next(response.body);
            }, error => {
              if (error.status === 416) {
                console.log('Log Rotation detected');
                this.oldLength = 0;
                this.fileContentSubject.next(null);
                this.readNextChunkSubject.next(null);
              } else {
                console.log(error);
              }
            }
          );
      });

  }
}
