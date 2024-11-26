import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormLayoutsComponent } from './form-layouts.component';

describe('FormLayoutsComponent', () => {
  let component: FormLayoutsComponent;
  let fixture: ComponentFixture<FormLayoutsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormLayoutsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FormLayoutsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
