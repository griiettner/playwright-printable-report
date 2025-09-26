import { Reporter, FullResult } from '@playwright/test/reporter';
import * as fs from 'fs';
import * as path from 'path';

// Interfaces for the Playwright JSON report structure
interface PlaywrightReport {
  config: any;
  suites: ReportSuite[];
  stats: ReportStats;
}

interface ReportSuite {
  title: string;
  file: string;
  specs: ReportSpec[];
  suites?: ReportSuite[];
}

interface ReportSpec {
  title: string;
  ok: boolean;
  tags: string[];
  tests: ReportTest[];
}

interface ReportTest {
  timeout: number;
  annotations: { type: string; description: string }[];
  expectedStatus: string;
  projectId: string;
  projectName: string;
  results: ReportResult[];
  status: string;
}

interface ReportResult {
  workerIndex: number;
  status: string;
  duration: number;
  error?: any;
  stdout: any[];
  stderr: any[];
  retry: number;
  steps: ReportStep[];
  attachments: ReportAttachment[];
}

interface ReportStep {
  title: string;
  duration: number;
  error?: any;
  steps?: ReportStep[];
}

interface ReportAttachment {
  name: string;
  contentType: string;
  path: string;
}

interface ReportStats {
  startTime: string;
  duration: number;
  expected: number;
  skipped: number;
  unexpected: number;
  flaky: number;
}

class BddReporter implements Reporter {
  private outputFile: string;

  constructor(options: { outputFile?: string } = {}) {
    this.outputFile = options.outputFile || 'reports/bdd-audit-report.html';
  }

  onEnd() {
    const jsonReportPath = path.join('reports', 'playwright.json');
    if (fs.existsSync(jsonReportPath)) {
      const reportData: PlaywrightReport = JSON.parse(fs.readFileSync(jsonReportPath, 'utf-8'));
      const htmlContent = this.generateHtmlReport(reportData);
      const outputDir = path.dirname(this.outputFile);
      if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
      }
      fs.writeFileSync(this.outputFile, htmlContent);
      console.log(`\nBDD audit report generated at: ${this.outputFile}`);
    } else {
      console.error('\nplaywright.json not found!');
    }
  }

  private generateHtmlReport(report: PlaywrightReport): string {
    const { stats } = report;
    const passed = stats.expected;
    const failed = stats.unexpected;
    const total = passed + failed + stats.skipped;

    return `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>BDD Audit Report</title>
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif; margin: 0; background-color: #f7f7f7; }
          .container { max-width: 1200px; margin: auto; padding: 20px; }
          .header { background-color: #fff; padding: 20px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); margin-bottom: 20px; }
          .header > p { margin-bottom: 0 }
          .stats-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px; }
          .stat-card { background-color: #fff; padding: 20px; border-radius: 8px; text-align: center; }
          .stat-card h3 { margin: 0; font-size: 1.5em; }
          .stat-card p { color: #666; }
          .progress-bar { background-color: #e9ecef; border-radius: .25rem; height: 1.5rem; }
          .progress-bar-fill { background-color: #28a745; height: 100%; border-radius: .25rem; text-align: center; color: white; line-height: 1.5rem; }
          .feature { background-color: #fff; border-radius: 8px; margin-bottom: 20px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
          .feature-header { padding: 15px; cursor: pointer; border-bottom: 1px solid #eee; }
          .scenario { padding: 10px 15px; border-top: 1px solid #eee; }
          .step { margin-left: 4px; padding-left: 15px; border-left: 1px solid #ddd; }
          .passed { color: #28a745; }
          .failed { color: #dc3545; }
          .collapsible-content { display: none; padding: 0 15px 1px; }
          h4 { margin: 0 }
          h1 { margin-top: 0 }

          @media print {
            body {
              font-size: 10pt;
            }
            .collapsible-content {
              display: block !important;
            }
            .feature-header {
              cursor: default;
            }
            .feature {
              page-break-inside: avoid;
            }
            .stats-grid, .progress-bar {
              display: none;
            }
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>BDD Audit Report</h1>
            <p>Generated on: ${new Date().toLocaleString()}</p>
          </div>
          <div class="stats-grid">
            <div class="stat-card">
              <h3>${total}</h3>
              <p>Total Tests</p>
            </div>
            <div class="stat-card">
              <h3 class="passed">${passed}</h3>
              <p>Passed</p>
            </div>
            <div class="stat-card">
              <h3 class="failed">${failed}</h3>
              <p>Failed</p>
            </div>
            <div class="stat-card">
              <h3>${(stats.duration / 1000).toFixed(2)}s</h3>
              <p>Total Duration</p>
            </div>
          </div>
          <div class="progress-bar" style="margin-top: 20px;">
            <div class="progress-bar-fill" style="width: ${(passed / total) * 100}%;">
              ${Math.round((passed / total) * 100)}% Passed
            </div>
          </div>
          <div style="margin-top: 20px;">
            ${report.suites.map(this.renderSuite.bind(this)).join('')}
          </div>
        </div>
        <script>
          document.querySelectorAll('.feature-header').forEach(header => {
            header.addEventListener('click', () => {
              const content = header.nextElementSibling;
              content.style.display = content.style.display === 'block' ? 'none' : 'block';
            });
          });
        </script>
      </body>
      </html>
    `;
  }

  private renderSuite(suite: ReportSuite): string {
    return suite.specs.map(spec => {
      const test = spec.tests[0];
      const result = test.results[0];
      return `
        <div class="feature">
          <div class="feature-header">
            <h4>${spec.title} <span class="${spec.ok ? 'passed' : 'failed'}">${spec.ok ? 'PASSED' : 'FAILED'}</span></h4>
          </div>
          <div class="collapsible-content">
            ${result.steps.map(this.renderStep.bind(this)).join('')}
          </div>
        </div>
      `;
    }).join('');
  }

  private renderStep(step: ReportStep): string {
    let subSteps = '';
    if (step.steps && step.steps.length > 0) {
      subSteps = `<div class="step">${step.steps.map(this.renderStep.bind(this)).join('')}</div>`;
    }
    return `
        <p>${step.title} <span class="${step.error ? 'failed' : 'passed'}">${step.error ? 'FAILED' : 'PASSED'}</span> (${step.duration}ms)</p>
        ${subSteps}
    `;
  }
}

export default BddReporter;
