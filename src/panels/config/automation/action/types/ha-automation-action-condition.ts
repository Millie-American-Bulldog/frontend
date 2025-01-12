import { css, html, LitElement } from "lit";
import { customElement, property } from "lit/decorators";
import memoizeOne from "memoize-one";
import { fireEvent } from "../../../../../common/dom/fire_event";
import { stringCompare } from "../../../../../common/string/compare";
import type { LocalizeFunc } from "../../../../../common/translations/localize";
import "../../../../../components/ha-select";
import type { HaSelect } from "../../../../../components/ha-select";
import type { Condition } from "../../../../../data/automation";
import { CONDITION_TYPES } from "../../../../../data/condition";
import { HomeAssistant } from "../../../../../types";
import "../../condition/ha-automation-condition-editor";
import type { ActionElement } from "../ha-automation-action-row";

@customElement("ha-automation-action-condition")
export class HaConditionAction extends LitElement implements ActionElement {
  @property({ attribute: false }) public hass!: HomeAssistant;

  @property() public action!: Condition;

  public static get defaultConfig() {
    return { condition: "state" };
  }

  protected render() {
    return html`
      <ha-select
        fixedMenuPosition
        .label=${this.hass.localize(
          "ui.panel.config.automation.editor.conditions.type_select"
        )}
        .value=${this.action.condition}
        naturalMenuWidth
        @selected=${this._typeChanged}
      >
        ${this._processedTypes(this.hass.localize).map(
          ([opt, label]) => html`
            <mwc-list-item .value=${opt}>${label}</mwc-list-item>
          `
        )}
      </ha-select>
      <ha-automation-condition-editor
        .condition=${this.action}
        .hass=${this.hass}
        @value-changed=${this._conditionChanged}
      ></ha-automation-condition-editor>
    `;
  }

  private _processedTypes = memoizeOne(
    (localize: LocalizeFunc): [string, string][] =>
      CONDITION_TYPES.map(
        (condition) =>
          [
            condition,
            localize(
              `ui.panel.config.automation.editor.conditions.type.${condition}.label`
            ),
          ] as [string, string]
      ).sort((a, b) => stringCompare(a[1], b[1]))
  );

  private _conditionChanged(ev: CustomEvent) {
    ev.stopPropagation();

    fireEvent(this, "value-changed", {
      value: ev.detail.value,
    });
  }

  private _typeChanged(ev: CustomEvent) {
    const type = (ev.target as HaSelect).value;

    if (!type) {
      return;
    }

    const elClass = customElements.get(
      `ha-automation-condition-${type}`
    ) as CustomElementConstructor & {
      defaultConfig: Omit<Condition, "condition">;
    };

    if (type !== this.action.condition) {
      fireEvent(this, "value-changed", {
        value: {
          condition: type,
          ...elClass.defaultConfig,
        },
      });
    }
  }

  static get styles() {
    return css`
      ha-select {
        margin-bottom: 24px;
      }
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "ha-automation-action-condition": HaConditionAction;
  }
}
