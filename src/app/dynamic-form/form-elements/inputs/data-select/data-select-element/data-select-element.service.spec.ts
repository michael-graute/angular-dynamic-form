import { TestBed } from '@angular/core/testing';

import { DataSelectElementService } from './data-select-element.service';

describe('DataSelectElementService', () => {
  let service: DataSelectElementService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DataSelectElementService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
