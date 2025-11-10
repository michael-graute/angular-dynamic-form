import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

import { DataSelectComponent } from './data-select.component';

describe('DataSelectComponent', () => {
  let component: DataSelectComponent;
  let fixture: ComponentFixture<DataSelectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DataSelectComponent],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DataSelectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
