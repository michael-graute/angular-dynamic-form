import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DataSelectExampleComponent } from './data-select-example.component';

describe('DataSelectExampleComponent', () => {
  let component: DataSelectExampleComponent;
  let fixture: ComponentFixture<DataSelectExampleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DataSelectExampleComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DataSelectExampleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
