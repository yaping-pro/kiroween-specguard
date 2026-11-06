import type { InvariantReport, PbtRunResult } from "./types";

export interface RadarTheme {
  primary: string;
  accent: string;
  bg: string;
  surface: string;
  text: string;
}

export class PbtRadarWidget {
  private container: HTMLElement;
  private reports: InvariantReport[] = [];
  private pbtResults: PbtRunResult[] = [];

  constructor(targetElementId: string) {
    const el = document.getElementById(targetElementId);
    if (!el) throw new Error(`Target element #${targetElementId} not found`);
    this.container = el;
    this.render();
  }

  public updateReport(report: InvariantReport): void {
    this.reports.unshift(report);
    if (this.reports.length > 20) this.reports.pop();
    this.render();
  }

  public updatePbtResults(results: PbtRunResult[]): void {
    this.pbtResults = results;
    this.render();
  }

  public render(): void {
    const latest = this.reports[0];
    const totalViolations = this.reports.reduce((acc, r) => acc + r.violations.length, 0);

    this.container.innerHTML = `
      <div style="font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace; background: #0c0a09; border: 1px solid #292524; border-radius: 8px; padding: 16px; color: #e7e5e4; box-shadow: 0 4px 20px rgba(0,0,0,0.5);">
        <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #292524; padding-bottom: 10px; margin-bottom: 12px;">
          <div style="display: flex; align-items: center; gap: 8px;">
            <span style="display: inline-block; width: 10px; height: 10px; border-radius: 50%; background: ${latest?.passed ? '#22c55e' : '#f97316'}; box-shadow: 0 0 10px ${latest?.passed ? '#22c55e' : '#f97316'};"></span>
            <strong style="color: #fafaf9; letter-spacing: 0.5px; font-size: 14px;">SPEC-GUARD INVARIANT RADAR</strong>
          </div>
          <span style="font-size: 11px; color: #a8a29e; background: #1c1917; padding: 2px 8px; border-radius: 4px; border: 1px solid #292524;">KIRO PBT KERNEL</span>
        </div>

        <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; margin-bottom: 14px;">
          <div style="background: #1c1917; padding: 10px; border-radius: 6px; border: 1px solid #292524;">
            <div style="font-size: 11px; color: #78716c;">ACTIVE INVARIANTS</div>
            <div style="font-size: 18px; font-weight: bold; color: #f97316; margin-top: 2px;">${latest?.totalChecked ?? 0} active</div>
          </div>
          <div style="background: #1c1917; padding: 10px; border-radius: 6px; border: 1px solid #292524;">
            <div style="font-size: 11px; color: #78716c;">VIOLATIONS DETECTED</div>
            <div style="font-size: 18px; font-weight: bold; color: ${totalViolations === 0 ? '#22c55e' : '#ef4444'}; margin-top: 2px;">${totalViolations}</div>
          </div>
          <div style="background: #1c1917; padding: 10px; border-radius: 6px; border: 1px solid #292524;">
            <div style="font-size: 11px; color: #78716c;">CHECK LATENCY</div>
            <div style="font-size: 18px; font-weight: bold; color: #38bdf8; margin-top: 2px;">${latest?.latencyMs ?? 0} ms</div>
          </div>
        </div>

        ${this.pbtResults.length > 0 ? `
          <div style="margin-top: 10px;">
            <div style="font-size: 12px; font-weight: bold; color: #d6d3d1; margin-bottom: 6px;">GENERATIVE PBT STRESS PASSES (1,000 RUNS/EACH):</div>
            <div style="display: flex; flex-direction: column; gap: 6px;">
              ${this.pbtResults.map(p => `
                <div style="display: flex; justify-content: space-between; align-items: center; background: #141210; padding: 6px 10px; border-radius: 4px; font-size: 11px; border-left: 3px solid ${p.passed ? '#22c55e' : '#ef4444'};">
                  <span>${p.suiteName}</span>
                  <span style="color: ${p.passed ? '#4ade80' : '#f87171'}; font-weight: bold;">
                    ${p.passed ? `✓ ${p.totalRuns} passed in ${p.durationMs}ms` : `✗ FAILED: ${p.counterexample}`}
                  </span>
                </div>
              `).join('')}
            </div>
          </div>
        ` : ''}
      </div>
    `;
  }
}
