import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {LogreadService} from './logread.service';
import {timer} from 'rxjs';
import {map, take, tap} from 'rxjs/operators';
import {FormArray, FormControl, FormGroup} from '@angular/forms';

@Component({
  selector: 'app-logread',
  templateUrl: './logread.component.html',
  styleUrls: ['./logread.component.scss']
})
export class LogreadComponent implements OnInit {

  public logLevels = new FormGroup({
    TRACE: new FormControl(false),
    DEBUG: new FormControl(false),
    INFO: new FormControl(true),
    WARN: new FormControl(true),
    ERROR: new FormControl(true),
});

  @ViewChild('divToScroll', {static: true}) divToScroll: ElementRef;

  enabledLogLevels = ['INFO'];

  constructor(private logreadService: LogreadService) {
  }

  ngOnInit() {
    this.logreadService.readAndPollFile('https://someHost/actuator/logfile')
      .pipe(
        tap(() => this.autoScrollIfDesired()),
        map((contents) => this.filterForEnabledLogLevels(contents))
      )
      .subscribe(content => {
        if (content === null) {
          this.divToScroll.nativeElement.value = '';
        } else {
          this.divToScroll.nativeElement.value += content;
        }
      });
  }

  onScroll($event: Event) {
    console.log($event, this.divToScroll);
  }

  autoScrollIfDesired() {
    if (this.divToScroll.nativeElement.scrollTop === this.divToScroll.nativeElement.scrollTopMax) {
      timer(100, 0).pipe(take(1)).subscribe(() =>
        this.divToScroll.nativeElement.scrollTop = this.divToScroll.nativeElement.scrollTopMax
      );
    }
  }

  private filterForEnabledLogLevels(contents: string) {
    if (contents === '') {
      return '';
    }
    let lines = contents.split('\n');
    lines = lines.filter(line => {
      const level = line.split(' ', 4)[3];
      return (this.enabledLogLevels.indexOf(level) >= 0);
    });
    return lines.join('\n') + '\n';

  }
}
