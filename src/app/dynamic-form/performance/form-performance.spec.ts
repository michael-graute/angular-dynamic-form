/**
 * Performance benchmark tests for dynamic forms
 * Tests rendering performance for various form sizes (10, 50, 100 fields)
 */

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { DynamicFormComponent } from '../dynamic-form.component';
import { FormConfig, FormElement } from '../dynamic-form.types';
import { PerformanceMonitorService } from '../services/performance-monitor.service';

describe('Form Performance Benchmarks', () => {
  let component: DynamicFormComponent;
  let fixture: ComponentFixture<DynamicFormComponent>;
  let performanceMonitor: PerformanceMonitorService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DynamicFormComponent],
      providers: [
        provideHttpClient(),
        PerformanceMonitorService
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(DynamicFormComponent);
    component = fixture.componentInstance;
    performanceMonitor = TestBed.inject(PerformanceMonitorService);
  });

  /**
   * Helper function to generate form configuration with specified number of fields
   */
  function generateFormConfig(fieldCount: number): FormConfig {
    const elements: FormElement[] = [];

    for (let i = 0; i < fieldCount; i++) {
      elements.push({
        key: `field${i}`,
        type: 'input',
        controlType: 'text',
        label: `Field ${i}`,
        validators: [
          {
            name: 'required'
          },
          {
            name: 'minLength',
            value: 2
          }
        ]
      });
    }

    return {
      elements,
      buttons: [
        {
          key: 'submit',
          type: 'submit',
          label: 'Submit',
          callback: {
            function: 'formSubmit'
          }
        }
      ]
    };
  }

  /**
   * Helper function to measure rendering time
   */
  function measureRenderTime(fieldCount: number): number {
    const config = generateFormConfig(fieldCount);
    const startTime = performance.now();

    component.formConfig = config;
    component.ngOnInit();
    fixture.detectChanges();

    const endTime = performance.now();
    return endTime - startTime;
  }

  it('should render 10-field form within performance budget', () => {
    const renderTime = measureRenderTime(10);

    console.log(`10-field form render time: ${renderTime.toFixed(2)}ms`);

    // 10-field form should render very quickly (< 100ms)
    expect(renderTime).toBeLessThan(100);
  });

  it('should render 50-field form within performance budget', () => {
    const renderTime = measureRenderTime(50);

    console.log(`50-field form render time: ${renderTime.toFixed(2)}ms`);

    // 50-field form should render within 500ms
    expect(renderTime).toBeLessThan(500);

    // Check if warning was emitted for approaching field count limit
    const fieldCountMetrics = performanceMonitor.getMetrics('form_field_count');
    expect(fieldCountMetrics.length).toBeGreaterThan(0);
  });

  it('should render 100-field form within performance budget', () => {
    const renderTime = measureRenderTime(100);

    console.log(`100-field form render time: ${renderTime.toFixed(2)}ms`);

    // 100-field form should render within 1000ms (1 second budget)
    expect(renderTime).toBeLessThan(1000);

    // Check if warning was emitted for exceeding field count limit
    const fieldCountMetrics = performanceMonitor.getMetrics('form_field_count');
    expect(fieldCountMetrics.length).toBeGreaterThan(0);
    const latestMetric = fieldCountMetrics[fieldCountMetrics.length - 1];
    expect(latestMetric.value).toBe(100);
    expect(latestMetric.exceedsThreshold).toBe(true);
  });

  it('should emit performance warnings for large forms', (done) => {
    let warningEmitted = false;

    performanceMonitor.warnings$.subscribe(warning => {
      console.log(`Performance warning: ${warning.message}`);
      warningEmitted = true;

      expect(warning.type).toBeDefined();
      expect(warning.actual).toBeGreaterThan(0);
      expect(warning.threshold).toBeGreaterThan(0);
    });

    // Render 100-field form to trigger warnings
    measureRenderTime(100);

    setTimeout(() => {
      expect(warningEmitted).toBe(true);
      done();
    }, 100);
  });

  it('should track render time metrics', () => {
    performanceMonitor.clearMetrics();

    measureRenderTime(10);

    const metrics = performanceMonitor.getMetrics('form_render_time');
    expect(metrics.length).toBeGreaterThan(0);

    const latestMetric = metrics[metrics.length - 1];
    expect(latestMetric.value).toBeGreaterThan(0);
    expect(latestMetric.metricName).toBe('form_render_time');
  });

  it('should calculate average render time for multiple renders', () => {
    performanceMonitor.clearMetrics();

    // Render same form multiple times
    measureRenderTime(10);
    measureRenderTime(10);
    measureRenderTime(10);

    const avgRenderTime = performanceMonitor.getAverageMetric('form_render_time');
    expect(avgRenderTime).toBeGreaterThan(0);
    console.log(`Average 10-field form render time: ${avgRenderTime.toFixed(2)}ms`);
  });

  it('should handle complex nested forms efficiently', () => {
    const nestedConfig: FormConfig = {
      elements: [
        {
          key: 'tabContainer',
          type: 'tabContainer',
          children: [
            {
              key: 'tab1',
              type: 'tabPane',
              label: 'Tab 1',
              children: [
                {
                  key: 'formGroup1',
                  type: 'formGroup',
                  children: [
                    ...generateFormConfig(20).elements
                  ]
                }
              ]
            },
            {
              key: 'tab2',
              type: 'tabPane',
              label: 'Tab 2',
              children: [
                {
                  key: 'formGroup2',
                  type: 'formGroup',
                  children: [
                    ...generateFormConfig(20).elements
                  ]
                }
              ]
            }
          ]
        }
      ],
      buttons: []
    };

    const startTime = performance.now();
    component.formConfig = nestedConfig;
    component.ngOnInit();
    fixture.detectChanges();
    const renderTime = performance.now() - startTime;

    console.log(`Nested form (40 fields) render time: ${renderTime.toFixed(2)}ms`);

    // Nested forms should still render within reasonable time
    expect(renderTime).toBeLessThan(1000);
  });

  afterEach(() => {
    performanceMonitor.clearMetrics();
  });
});
