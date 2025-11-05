import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';

import { CustomCallbacksComponent } from './custom-callbacks.component';

describe('CustomCallbacksComponent', () => {
  let component: CustomCallbacksComponent;
  let fixture: ComponentFixture<CustomCallbacksComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CustomCallbacksComponent],
      providers: [provideHttpClient()]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CustomCallbacksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have formConfig defined', () => {
    expect(component.formConfig).toBeDefined();
    expect(component.formConfig.elements).toBeDefined();
    expect(component.formConfig.buttons).toBeDefined();
  });

  it('should have save-draft button with custom callback', () => {
    const saveDraftButton = component.formConfig.buttons.find(b => b.key === 'save-draft');
    expect(saveDraftButton).toBeDefined();
    expect(saveDraftButton?.callback.function).toBe('saveDraft');
    expect(saveDraftButton?.callback.params).toBeDefined();
  });

  it('should have preview button with disableIfFormInvalid setting', () => {
    const previewButton = component.formConfig.buttons.find(b => b.key === 'preview');
    expect(previewButton).toBeDefined();
    expect(previewButton?.settings?.disableIfFormInvalid).toBe(true);
  });

  it('should have publish button with disableIfFormInvalid setting', () => {
    const publishButton = component.formConfig.buttons.find(b => b.key === 'submit');
    expect(publishButton).toBeDefined();
    expect(publishButton?.settings?.disableIfFormInvalid).toBe(true);
  });
});
