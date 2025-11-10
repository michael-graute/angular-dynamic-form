import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

import { DataSelectElementService } from './data-select-element.service';

describe('DataSelectElementService', () => {
  let service: DataSelectElementService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    });
    service = TestBed.inject(DataSelectElementService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
