import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RepeaterElementComponent } from './repeater-element.component';

describe('RepeaterElementComponent', () => {
  let component: RepeaterElementComponent;
  let fixture: ComponentFixture<RepeaterElementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RepeaterElementComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RepeaterElementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
