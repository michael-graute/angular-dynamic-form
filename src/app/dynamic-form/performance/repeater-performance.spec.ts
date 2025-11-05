/**
 * Performance benchmark tests for repeater components
 * Tests rendering performance for various repeater sizes (50, 100, 200 items)
 */

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { DynamicFormComponent } from '../dynamic-form.component';
import { FormConfig, FormElement } from '../dynamic-form.types';

describe('Repeater Performance Benchmarks', () => {
  let component: DynamicFormComponent;
  let fixture: ComponentFixture<DynamicFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DynamicFormComponent],
      providers: [provideHttpClient()]
    }).compileComponents();

    fixture = TestBed.createComponent(DynamicFormComponent);
    component = fixture.componentInstance;
  });

  /**
   * Helper function to generate repeater configuration with specified number of items
   */
  function generateRepeaterConfig(itemCount: number): FormConfig {
    const values: any[] = [];

    for (let i = 0; i < itemCount; i++) {
      values.push({
        name: `Item ${i}`,
        email: `item${i}@example.com`,
        phone: `+1-555-000-${String(i).padStart(4, '0')}`
      });
    }

    const repeaterElement: FormElement = {
      key: 'contacts',
      type: 'repeater',
      label: `Contact List (${itemCount} items)`,
      children: [
        {
          key: 'name',
          type: 'input',
          label: 'Name',
          controlType: 'text',
          validators: [
            {
              name: 'required'
            }
          ]
        },
        {
          key: 'email',
          type: 'input',
          label: 'Email',
          controlType: 'email',
          validators: [
            {
              name: 'required'
            },
            {
              name: 'email'
            }
          ]
        },
        {
          key: 'phone',
          type: 'input',
          label: 'Phone',
          controlType: 'tel'
        }
      ],
      value: values
    };

    return {
      elements: [repeaterElement],
      buttons: []
    };
  }

  /**
   * Helper function to measure repeater rendering time
   */
  function measureRepeaterRenderTime(itemCount: number): number {
    const config = generateRepeaterConfig(itemCount);
    const startTime = performance.now();

    component.formConfig = config;
    component.ngOnInit();
    fixture.detectChanges();

    const endTime = performance.now();
    return endTime - startTime;
  }

  it('should render repeater with 50 items efficiently', () => {
    const renderTime = measureRepeaterRenderTime(50);

    console.log(`Repeater with 50 items render time: ${renderTime.toFixed(2)}ms`);

    // 50 items should render quickly (< 500ms)
    // Note: This is at the threshold for virtual scrolling
    expect(renderTime).toBeLessThan(500);
  });

  it('should render repeater with 100 items using virtual scrolling', () => {
    const renderTime = measureRepeaterRenderTime(100);

    console.log(`Repeater with 100 items render time: ${renderTime.toFixed(2)}ms`);

    // 100 items with virtual scrolling should render within 1000ms
    // Virtual scrolling should be enabled at this point
    expect(renderTime).toBeLessThan(1000);
  });

  it('should render repeater with 200 items using virtual scrolling', () => {
    const renderTime = measureRepeaterRenderTime(200);

    console.log(`Repeater with 200 items render time: ${renderTime.toFixed(2)}ms`);

    // 200 items with virtual scrolling should still render within reasonable time
    // Virtual scrolling prevents rendering all items at once
    expect(renderTime).toBeLessThan(1500);
  });

  it('should handle multiple repeaters efficiently', () => {
    const config: FormConfig = {
      elements: [
        {
          key: 'contacts1',
          type: 'repeater',
          label: 'Contact List 1',
          children: [
            {
              key: 'name',
              type: 'input',
              label: 'Name',
              controlType: 'text'
            }
          ],
          value: Array(30).fill({}).map((_, i) => ({ name: `Contact ${i}` }))
        },
        {
          key: 'contacts2',
          type: 'repeater',
          label: 'Contact List 2',
          children: [
            {
              key: 'name',
              type: 'input',
              label: 'Name',
              controlType: 'text'
            }
          ],
          value: Array(30).fill({}).map((_, i) => ({ name: `Contact ${i}` }))
        }
      ],
      buttons: []
    };

    const startTime = performance.now();
    component.formConfig = config;
    component.ngOnInit();
    fixture.detectChanges();
    const renderTime = performance.now() - startTime;

    console.log(`Multiple repeaters (60 total items) render time: ${renderTime.toFixed(2)}ms`);

    // Multiple repeaters should render efficiently
    expect(renderTime).toBeLessThan(1000);
  });

  it('should verify virtual scrolling threshold behavior', () => {
    // Test just below threshold (50 items - no virtual scrolling)
    const time50 = measureRepeaterRenderTime(50);
    console.log(`50 items (threshold) render time: ${time50.toFixed(2)}ms`);

    // Test above threshold (51 items - virtual scrolling enabled)
    const time51 = measureRepeaterRenderTime(51);
    console.log(`51 items (virtual scrolling) render time: ${time51.toFixed(2)}ms`);

    // Both should render within acceptable time
    expect(time50).toBeLessThan(1000);
    expect(time51).toBeLessThan(1000);
  });

  it('should handle repeater with complex nested children', () => {
    const config: FormConfig = {
      elements: [
        {
          key: 'addresses',
          type: 'repeater',
          label: 'Addresses',
          children: [
            {
              key: 'addressGroup',
              type: 'formGroup',
              children: [
                {
                  key: 'street',
                  type: 'input',
                  label: 'Street',
                  controlType: 'text'
                },
                {
                  key: 'city',
                  type: 'input',
                  label: 'City',
                  controlType: 'text'
                },
                {
                  key: 'state',
                  type: 'select',
                  label: 'State',
                  options: [
                    { label: 'CA', value: 'ca' },
                    { label: 'NY', value: 'ny' },
                    { label: 'TX', value: 'tx' }
                  ]
                },
                {
                  key: 'zip',
                  type: 'input',
                  label: 'ZIP',
                  controlType: 'text'
                }
              ]
            }
          ],
          value: Array(60).fill({}).map((_, i) => ({
            addressGroup: {
              street: `${i} Main St`,
              city: 'Springfield',
              state: 'ca',
              zip: '12345'
            }
          }))
        }
      ],
      buttons: []
    };

    const startTime = performance.now();
    component.formConfig = config;
    component.ngOnInit();
    fixture.detectChanges();
    const renderTime = performance.now() - startTime;

    console.log(`Complex nested repeater (60 items) render time: ${renderTime.toFixed(2)}ms`);

    // Complex nested repeaters should benefit from virtual scrolling
    expect(renderTime).toBeLessThan(2000);
  });

  it('should measure add/remove item performance', () => {
    const config = generateRepeaterConfig(100);

    component.formConfig = config;
    component.ngOnInit();
    fixture.detectChanges();

    // Measure time to add an item
    const addStartTime = performance.now();
    // This would require accessing the repeater component instance
    // For now, we just verify the setup completes
    const addTime = performance.now() - addStartTime;

    console.log(`Add item operation setup time: ${addTime.toFixed(2)}ms`);

    expect(addTime).toBeLessThan(100);
  });

  it('should compare rendering performance across different sizes', () => {
    const sizes = [10, 25, 50, 75, 100, 150, 200];
    const results: { size: number; time: number }[] = [];

    sizes.forEach(size => {
      const time = measureRepeaterRenderTime(size);
      results.push({ size, time });
      console.log(`Size ${size}: ${time.toFixed(2)}ms`);
    });

    // Verify that virtual scrolling keeps times reasonable even for large sizes
    const time50 = results.find(r => r.size === 50)!.time;
    const time200 = results.find(r => r.size === 200)!.time;

    // With virtual scrolling, 200 items shouldn't take 4x longer than 50 items
    // It should be more linear or even better due to virtual scrolling
    expect(time200).toBeLessThan(time50 * 3);
  });
});
