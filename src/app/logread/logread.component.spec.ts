import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LogreadComponent } from './logread.component';

describe('LogreadComponent', () => {
  let component: LogreadComponent;
  let fixture: ComponentFixture<LogreadComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LogreadComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LogreadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
