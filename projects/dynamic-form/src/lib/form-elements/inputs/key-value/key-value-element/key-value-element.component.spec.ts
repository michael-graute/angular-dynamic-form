import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

import { KeyValueElementComponent } from './key-value-element.component';

describe('KeyValueElementComponent', () => {
  let component: KeyValueElementComponent;
  let fixture: ComponentFixture<KeyValueElementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [KeyValueElementComponent],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(KeyValueElementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
