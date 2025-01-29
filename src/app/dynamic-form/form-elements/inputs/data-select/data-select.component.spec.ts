import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DataSelectComponent } from './data-select.component';

describe('DataSelectComponent', () => {
  let component: DataSelectComponent;
  let fixture: ComponentFixture<DataSelectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DataSelectComponent]
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
