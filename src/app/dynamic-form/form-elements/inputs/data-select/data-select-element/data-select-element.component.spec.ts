import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DataSelectElementComponent } from './data-select-element.component';

describe('DataSelectElementComponent', () => {
  let component: DataSelectElementComponent;
  let fixture: ComponentFixture<DataSelectElementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DataSelectElementComponent]
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
