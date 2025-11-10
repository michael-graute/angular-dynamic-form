import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

import { DataRelationComponent } from './data-relation.component';

describe('DataRelationComponent', () => {
  let component: DataRelationComponent;
  let fixture: ComponentFixture<DataRelationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DataRelationComponent],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DataRelationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
