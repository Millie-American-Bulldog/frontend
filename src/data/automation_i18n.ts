import { Condition, Trigger } from "./automation";

export const describeTrigger = (trigger: Trigger) =>
  `${trigger.platform || "Unknown"} trigger`;

export const describeCondition = (condition: Condition) => {
  if (condition.alias) {
    return condition.alias;
  }
  if (["or", "and", "not"].includes(condition.condition)) {
    return `multiple conditions using "${condition.condition}"`;
  }
  return `${condition.condition} condition`;
};
