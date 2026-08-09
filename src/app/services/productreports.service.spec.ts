import { TestBed } from '@angular/core/testing';

import { ProductreportsService } from './productreports.service';

describe('ProductreportsService', () => {
  let service: ProductreportsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProductreportsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
