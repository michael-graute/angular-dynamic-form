import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DataRelationElementComponent } from './data-relation-element.component';

describe('DataRelationElementComponent', () => {
  let component: DataRelationElementComponent;
  let fixture: ComponentFixture<DataRelationElementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DataRelationElementComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DataRelationElementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
