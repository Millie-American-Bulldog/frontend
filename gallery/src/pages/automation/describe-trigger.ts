import { dump } from "js-yaml";
import { html, css, LitElement, TemplateResult } from "lit";
import { customElement, state } from "lit/decorators";
import "../../../../src/components/ha-card";
import "../../../../src/components/ha-yaml-editor";
import { Trigger } from "../../../../src/data/automation";
import { describeTrigger } from "../../../../src/data/automation_i18n";

const triggers = [
  { platform: "state" },
  { platform: "mqtt" },
  { platform: "geo_location" },
  { platform: "homeassistant" },
  { platform: "numeric_state" },
  { platform: "sun" },
  { platform: "time_pattern" },
  { platform: "webhook" },
  { platform: "zone" },
  { platform: "tag" },
  { platform: "time" },
  { platform: "template" },
  { platform: "event" },
];

const initialTrigger: Trigger = {
  platform: "state",
  entity_id: "light.kitchen",
};

@customElement("demo-automation-describe-trigger")
export class DemoAutomationDescribeTrigger extends LitElement {
  @state() _trigger = initialTrigger;

  protected render(): TemplateResult {
    return html`
      <ha-card header="Triggers">
        <div class="trigger">
          <span>
            ${this._trigger ? describeTrigger(this._trigger) : "<invalid YAML>"}
          </span>
          <ha-yaml-editor
            label="Trigger Config"
            .defaultValue=${initialTrigger}
            @value-changed=${this._dataChanged}
          ></ha-yaml-editor>
        </div>
        ${triggers.map(
          (conf) => html`
            <div class="trigger">
              <span>${describeTrigger(conf as any)}</span>
              <pre>${dump(conf)}</pre>
            </div>
          `
        )}
      </ha-card>
    `;
  }

  private _dataChanged(ev: CustomEvent): void {
    ev.stopPropagation();
    this._trigger = ev.detail.isValid ? ev.detail.value : undefined;
  }

  static get styles() {
    return css`
      ha-card {
        max-width: 600px;
        margin: 24px auto;
      }
      .trigger {
        padding: 16px;
        display: flex;
        align-items: center;
        justify-content: space-between;
      }
      span {
        margin-right: 16px;
      }
      ha-yaml-editor {
        width: 50%;
      }
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "demo-automation-describe-trigger": DemoAutomationDescribeTrigger;
  }
}
