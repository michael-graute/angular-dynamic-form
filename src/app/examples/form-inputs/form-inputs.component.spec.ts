import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

import { FormInputsComponent } from './form-inputs.component';

describe('FormInputsComponent', () => {
  let component: FormInputsComponent;
  let fixture: ComponentFixture<FormInputsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormInputsComponent],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FormInputsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
