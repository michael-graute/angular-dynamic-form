import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

import { DataSelectElementComponent } from './data-select-element.component';

describe('DataSelectElementComponent', () => {
  let component: DataSelectElementComponent;
  let fixture: ComponentFixture<DataSelectElementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DataSelectElementComponent],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DataSelectElementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
