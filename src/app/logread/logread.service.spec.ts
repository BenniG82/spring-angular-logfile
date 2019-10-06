import { TestBed } from '@angular/core/testing';

import { LogreadService } from './logread.service';

describe('LogreadService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: LogreadService = TestBed.get(LogreadService);
    expect(service).toBeTruthy();
  });
});
