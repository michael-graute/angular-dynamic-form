import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SimpleAjaxFormComponent } from './simple-ajax-form.component';

describe('SimpleAjaxFormComponent', () => {
  let component: SimpleAjaxFormComponent;
  let fixture: ComponentFixture<SimpleAjaxFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SimpleAjaxFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SimpleAjaxFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
