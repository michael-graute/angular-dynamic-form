import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { FormGroupComponent } from './form-group.component';
import { DynamicFormService } from '../../../dynamic-form.service';

describe('FormGroupComponent', () => {
  let component: FormGroupComponent;
  let fixture: ComponentFixture<FormGroupComponent>;
  let dynamicFormService: jasmine.SpyObj<DynamicFormService>;

  beforeEach(async () => {
    const dynamicFormServiceSpy = jasmine.createSpyObj('DynamicFormService', ['addComponentRef'], {
      elementAdded: jasmine.createSpyObj('Subject', ['subscribe'])
    });

    await TestBed.configureTestingModule({
      imports: [FormGroupComponent],
      providers: [
        { provide: DynamicFormService, useValue: dynamicFormServiceSpy }
      ]
    })
    .compileComponents();

    dynamicFormService = TestBed.inject(DynamicFormService) as jasmine.SpyObj<DynamicFormService>;
    fixture = TestBed.createComponent(FormGroupComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Validation Propagation', () => {
    it('should propagate child control invalid state to parent formGroup', () => {
      // Setup: Create a parent form and nested formGroup
      const parentForm = new FormGroup({});
      component.form = parentForm;
      component.key = 'userProfile';

      fixture.detectChanges();

      // Get the formGroup that was added to the parent
      const nestedFormGroup = parentForm.get('userProfile') as unknown as FormGroup;
      expect(nestedFormGroup).toBeTruthy();

      // Add a child control with validation to the nested formGroup
      const childControl = new FormControl('', Validators.required);
      nestedFormGroup.addControl('name', childControl);

      // Initially, the control is invalid (empty + required)
      expect(childControl.invalid).toBe(true);
      expect(nestedFormGroup.invalid).toBe(true);
      expect(parentForm.invalid).toBe(true);

      // Make the control valid
      childControl.setValue('John Doe');
      expect(childControl.valid).toBe(true);
      expect(nestedFormGroup.valid).toBe(true);
      expect(parentForm.valid).toBe(true);

      // Make it invalid again
      childControl.setValue('');
      expect(childControl.invalid).toBe(true);
      expect(nestedFormGroup.invalid).toBe(true);
      expect(parentForm.invalid).toBe(true);
    });

    it('should propagate validation through multiple nested levels (2-3 levels deep)', () => {
      // Setup: Create a deeply nested structure
      // Level 0: parentForm
      // Level 1: userProfile (FormGroup)
      // Level 2: contactInfo (FormGroup)
      // Level 3: address (FormGroup with invalid field)

      const parentForm = new FormGroup({});
      component.form = parentForm;
      component.key = 'userProfile';

      fixture.detectChanges();

      const userProfileGroup = parentForm.get('userProfile') as unknown as FormGroup;

      // Level 2: Add contactInfo formGroup
      const contactInfoGroup = new FormGroup({});
      userProfileGroup.addControl('contactInfo', contactInfoGroup);

      // Level 3: Add address formGroup with required field
      const addressGroup = new FormGroup({
        city: new FormControl('', Validators.required)
      });
      contactInfoGroup.addControl('address', addressGroup);

      // Verify validation propagates from level 3 to level 0
      expect(addressGroup.invalid).toBe(true, 'Level 3 (address) should be invalid');
      expect(contactInfoGroup.invalid).toBe(true, 'Level 2 (contactInfo) should be invalid');
      expect(userProfileGroup.invalid).toBe(true, 'Level 1 (userProfile) should be invalid');
      expect(parentForm.invalid).toBe(true, 'Level 0 (parentForm) should be invalid');

      // Make the deep field valid
      addressGroup.get('city')?.setValue('Springfield');

      expect(addressGroup.valid).toBe(true, 'Level 3 (address) should be valid');
      expect(contactInfoGroup.valid).toBe(true, 'Level 2 (contactInfo) should be valid');
      expect(userProfileGroup.valid).toBe(true, 'Level 1 (userProfile) should be valid');
      expect(parentForm.valid).toBe(true, 'Level 0 (parentForm) should be valid');
    });

    it('should handle multiple invalid children correctly', () => {
      const parentForm = new FormGroup({});
      component.form = parentForm;
      component.key = 'testGroup';

      fixture.detectChanges();

      const formGroup = parentForm.get('testGroup') as unknown as FormGroup;

      // Add multiple controls with validation
      formGroup.addControl('field1', new FormControl('', Validators.required));
      formGroup.addControl('field2', new FormControl('', Validators.email));
      formGroup.addControl('field3', new FormControl('', Validators.minLength(5)));

      // All invalid - formGroup should be invalid
      expect(formGroup.invalid).toBe(true);

      // Fix one field - formGroup should still be invalid
      formGroup.get('field1')?.setValue('value1');
      expect(formGroup.invalid).toBe(true);

      // Fix second field - formGroup should still be invalid
      formGroup.get('field2')?.setValue('test@example.com');
      expect(formGroup.invalid).toBe(true);

      // Fix third field - now formGroup should be valid
      formGroup.get('field3')?.setValue('12345');
      expect(formGroup.valid).toBe(true);
    });

    it('should maintain validation propagation after dynamic control addition', () => {
      const parentForm = new FormGroup({});
      component.form = parentForm;
      component.key = 'dynamicGroup';

      fixture.detectChanges();

      const formGroup = parentForm.get('dynamicGroup') as unknown as FormGroup;

      // Initially valid (no controls)
      expect(formGroup.valid).toBe(true);

      // Dynamically add an invalid control
      formGroup.addControl('newField', new FormControl('', Validators.required));

      // Should now be invalid
      expect(formGroup.invalid).toBe(true);
      expect(parentForm.invalid).toBe(true);

      // Fix the new field
      formGroup.get('newField')?.setValue('value');
      expect(formGroup.valid).toBe(true);
      expect(parentForm.valid).toBe(true);
    });
  });
});
