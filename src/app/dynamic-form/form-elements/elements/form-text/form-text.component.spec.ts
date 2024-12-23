import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormTextComponent } from './form-text.component';

describe('FormTextComponent', () => {
  let component: FormTextComponent;
  let fixture: ComponentFixture<FormTextComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormTextComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FormTextComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
