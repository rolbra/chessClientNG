import { TestBed } from '@angular/core/testing';

import { PositionerService } from './positioner.service';

describe('PositionerService', () => {
  let service: PositionerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PositionerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
