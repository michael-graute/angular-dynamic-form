/**
 * Performance monitoring service for dynamic forms
 * Tracks rendering times, field counts, and provides warnings for performance budgets
 */

import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

export interface PerformanceMetric {
  metricName: string;
  value: number;
  timestamp: number;
  threshold?: number;
  exceedsThreshold?: boolean;
}

export interface PerformanceBudgetWarning {
  type: 'field_count' | 'render_time' | 'interaction_time';
  message: string;
  actual: number;
  threshold: number;
  timestamp: number;
}

@Injectable({
  providedIn: 'root'
})
export class PerformanceMonitorService {
  /**
   * Observable stream of performance budget warnings
   */
  public warnings$ = new Subject<PerformanceBudgetWarning>();

  /**
   * Observable stream of performance metrics
   */
  public metrics$ = new Subject<PerformanceMetric>();

  /**
   * Performance budget thresholds (from spec requirements)
   */
  private readonly budgets = {
    maxFields: 100,                    // Maximum recommended field count
    maxFieldsWarning: 50,              // Warning threshold for field count
    maxRenderTime: 1000,               // Maximum render time in ms (1 second)
    maxInteractionTime: 200,           // Maximum interaction time in ms
    maxAsyncOperationTime: 2000        // Maximum async operation time in ms (2 seconds)
  };

  private renderStartTime: number | null = null;
  private metrics: Map<string, PerformanceMetric[]> = new Map();

  constructor() {}

  /**
   * Starts tracking form rendering performance
   */
  startRenderTracking(): void {
    this.renderStartTime = performance.now();
  }

  /**
   * Ends render tracking and records the metric
   * @param fieldCount - Number of fields in the form
   * @returns The render time in milliseconds
   */
  endRenderTracking(fieldCount: number): number {
    if (this.renderStartTime === null) {
      console.warn('Render tracking was not started');
      return 0;
    }

    const renderTime = performance.now() - this.renderStartTime;
    this.renderStartTime = null;

    // Record metric
    this.recordMetric('form_render_time', renderTime, this.budgets.maxRenderTime);

    // Check field count budget
    this.checkFieldCountBudget(fieldCount);

    // Check render time budget
    if (renderTime > this.budgets.maxRenderTime) {
      this.emitWarning({
        type: 'render_time',
        message: `Form render time (${Math.round(renderTime)}ms) exceeds recommended budget of ${this.budgets.maxRenderTime}ms. Consider optimizing or reducing field count.`,
        actual: renderTime,
        threshold: this.budgets.maxRenderTime,
        timestamp: Date.now()
      });
    }

    return renderTime;
  }

  /**
   * Records a performance metric
   * @param name - Name of the metric
   * @param value - Numeric value of the metric
   * @param threshold - Optional threshold for warnings
   */
  recordMetric(name: string, value: number, threshold?: number): void {
    const metric: PerformanceMetric = {
      metricName: name,
      value,
      timestamp: Date.now(),
      threshold,
      exceedsThreshold: threshold !== undefined && value > threshold
    };

    if (!this.metrics.has(name)) {
      this.metrics.set(name, []);
    }

    this.metrics.get(name)!.push(metric);
    this.metrics$.next(metric);
  }

  /**
   * Checks if field count exceeds performance budgets
   * @param fieldCount - Number of fields in the form
   */
  checkFieldCountBudget(fieldCount: number): void {
    // Warning threshold (50+ fields)
    if (fieldCount >= this.budgets.maxFieldsWarning && fieldCount < this.budgets.maxFields) {
      this.emitWarning({
        type: 'field_count',
        message: `Form has ${fieldCount} fields, approaching the recommended limit of ${this.budgets.maxFields}. Consider splitting into multiple forms or using tabs/sections.`,
        actual: fieldCount,
        threshold: this.budgets.maxFieldsWarning,
        timestamp: Date.now()
      });
    }

    // Error threshold (100+ fields)
    if (fieldCount >= this.budgets.maxFields) {
      this.emitWarning({
        type: 'field_count',
        message: `Form has ${fieldCount} fields, exceeding the recommended limit of ${this.budgets.maxFields}. Performance degradation likely. Strongly consider refactoring.`,
        actual: fieldCount,
        threshold: this.budgets.maxFields,
        timestamp: Date.now()
      });
    }

    this.recordMetric('form_field_count', fieldCount, this.budgets.maxFieldsWarning);
  }

  /**
   * Tracks interaction time (e.g., form submission, field updates)
   * @param operationType - Description of the operation
   * @param duration - Duration in milliseconds
   */
  trackInteraction(operationType: string, duration: number): void {
    this.recordMetric(`interaction_${operationType}`, duration, this.budgets.maxInteractionTime);

    if (duration > this.budgets.maxInteractionTime) {
      this.emitWarning({
        type: 'interaction_time',
        message: `${operationType} took ${Math.round(duration)}ms, exceeding the recommended ${this.budgets.maxInteractionTime}ms budget.`,
        actual: duration,
        threshold: this.budgets.maxInteractionTime,
        timestamp: Date.now()
      });
    }
  }

  /**
   * Gets all recorded metrics for a specific metric name
   * @param name - Name of the metric
   * @returns Array of metrics
   */
  getMetrics(name: string): PerformanceMetric[] {
    return this.metrics.get(name) || [];
  }

  /**
   * Gets average value for a specific metric
   * @param name - Name of the metric
   * @returns Average value or 0 if no metrics recorded
   */
  getAverageMetric(name: string): number {
    const metrics = this.getMetrics(name);
    if (metrics.length === 0) return 0;

    const sum = metrics.reduce((acc, metric) => acc + metric.value, 0);
    return sum / metrics.length;
  }

  /**
   * Clears all recorded metrics
   */
  clearMetrics(): void {
    this.metrics.clear();
  }

  /**
   * Emits a performance budget warning
   * @param warning - The warning to emit
   */
  private emitWarning(warning: PerformanceBudgetWarning): void {
    console.warn(`[Performance Warning] ${warning.message}`);
    this.warnings$.next(warning);
  }

  /**
   * Gets current performance budgets
   */
  getBudgets() {
    return { ...this.budgets };
  }
}
