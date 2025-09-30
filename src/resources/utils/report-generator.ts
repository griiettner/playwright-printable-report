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
          .feature-header h4 { display: flex; flex-wrap: wrap; align-items: center; gap: 8px; }
          .feature-header .feature-name { font-weight: 600; }
          .feature-tags { display: inline-flex; gap: 6px; flex-wrap: wrap; }
          .feature-tag { background-color: #eef4ff; color: #1c3d8f; border-radius: 999px; padding: 2px 10px; font-size: 0.8em; }
          .feature-status { margin-left: auto; font-weight: 600; }

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
      const { title, tags } = this.prepareSpecHeader(spec);
      const tagsMarkup = tags.length
        ? `<span class="feature-tags">${tags.map(tag => `<span class="feature-tag">${tag}</span>`).join('')}</span>`
        : '';
      return `
        <div class="feature">
          <div class="feature-header">
            <h4>
              <span class="feature-name">${title}</span>
              ${tagsMarkup}
              <span class="${spec.ok ? 'passed' : 'failed'} feature-status">
                ${spec.ok ? 'PASSED' : 'FAILED'}
              </span>
            </h4>
          </div>
          <div class="collapsible-content">
            ${result.steps.map(this.renderStep.bind(this)).join('')}
          </div>
        </div>
      `;
    }).join('');
  }

  private prepareSpecHeader(spec: ReportSpec): { title: string; tags: string[] } {
    const rawTitle = (spec.title || '').trim();
    const tagsFromSpec = (spec.tags || []).map(tag => this.normalizeTag(tag));
    const titleTagMatches = rawTitle.match(/@[^\s]+/g) || [];
    const tagsFromTitle = titleTagMatches.map(tag => this.normalizeTag(tag));
    const cleanTitle = rawTitle.replace(/@[^\s]+/g, '').replace(/\s+/g, ' ').trim();

    const uniqueTags = Array.from(new Set([...tagsFromSpec, ...tagsFromTitle])).filter(Boolean);

    return {
      title: cleanTitle || rawTitle,
      tags: uniqueTags,
    };
  }

  private normalizeTag(tag: string): string {
    return tag.replace(/^@/, '').trim();
  }

  private renderStep(step: ReportStep): string {
    let subSteps = '';
    if (step.steps && step.steps.length > 0) {
      subSteps = `<div class="step">${step.steps.map(this.renderStep.bind(this)).join('')}</div>`;
    }

    const title = this.formatStepTitle(step);

    return `
        <p>${title} <span class="${step.error ? 'failed' : 'passed'}">${step.error ? 'FAILED' : 'PASSED'}</span> (${step.duration}ms)</p>
        ${subSteps}
    `;
  }

  private formatStepTitle(step: ReportStep): string {
    const rawTitle = (step.title || '').trim();
    if (!rawTitle) return 'Step';

    const expectMatch = rawTitle.match(/^Expect\s+"?(.+?)"?$/i);
    if (expectMatch) {
      return this.describeExpectation(expectMatch[1], step);
    }

    return rawTitle;
  }

  private describeExpectation(expectation: string, step: ReportStep): string {
    const normalized = expectation.replace(/\s+/g, ' ').trim();
    const lower = normalized.toLowerCase();

    const mappings: Array<{ match: RegExp; message: string }> = [
      { match: /poll to ?match/, message: 'Verify value eventually matches the expected text' },
      { match: /tohavetext/, message: 'Verify element text matches the expected value' },
      { match: /tocontaintext/, message: 'Verify element text contains the expected value' },
      { match: /tobevisible/, message: 'Verify element is visible' },
      { match: /tobeenabled/, message: 'Verify element is enabled' },
      { match: /tobedisabled/, message: 'Verify element is disabled' },
      { match: /toequal/, message: 'Verify values are equal' },
      { match: /tocontain/, message: 'Verify collection contains the expected item' },
      { match: /tobe(truthy|true)/, message: 'Verify value is true' },
      { match: /tobe(falsy|false)/, message: 'Verify value is false' },
      { match: /tobedefined/, message: 'Verify value is defined' },
      { match: /tobenull/, message: 'Verify value is null' },
      { match: /tohavecount/, message: 'Verify element count matches the expected value' },
      { match: /tohaveselected/, message: 'Verify the option is selected' },
      { match: /tohavevalue/, message: 'Verify element value matches the expected value' },
    ];

    const found = mappings.find(({ match }) => match.test(lower));
    if (found) {
      return `${found.message}${this.buildExpectationDetail(step)}`.trim();
    }

    const humanized = normalized
      .replace(/["']/g, '')
      .replace(/([a-z])([A-Z])/g, '$1 $2')
      .toLowerCase();

    return `Verify expectation (${humanized})${this.buildExpectationDetail(step)}`.trim();
  }

  private buildExpectationDetail(step: ReportStep): string {
    const message = this.extractExpectationMessage(step);
    return message ? ` - ${message}` : '';
  }

  private extractExpectationMessage(step: ReportStep): string | null {
    const rawMessage = typeof step.error?.message === 'string' ? step.error.message : '';
    if (!rawMessage) return null;

    const cleanMessage = rawMessage.replace(/\u001b\[[0-9;]*m/g, '').trim();

    const expectedActual = cleanMessage.match(/Expected:?\s*([^\n]+)\n[\s\S]*?(Received|Actual):?\s*([^\n]+)/i);
    if (expectedActual) {
      const [, expected, , actual] = expectedActual;
      return `expected ${expected.trim()} but received ${actual.trim()}`;
    }

    const singleLine = cleanMessage.split('\n').find((line: { trim: () => { length: number } }) => line.trim().length > 0);
    return singleLine ? singleLine.trim() : null;
  }
}

export default BddReporter;
