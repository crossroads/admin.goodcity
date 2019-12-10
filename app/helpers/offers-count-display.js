import { helper as buildHelper } from "@ember/component/helper";

function applyIcon(stateCount, isPriority) {
  if (!stateCount) {
    return;
  }
  const priorityIcon = `<i class="fa fa-exclamation-triangle"></i> ${stateCount}`;
  return isPriority ? priorityIcon : stateCount;
}

function applyCheckIconOrCountZero(isPriority) {
  return isPriority ? `<i class="fa fa-check"></i>` : 0;
}

export default buildHelper(function(states) {
  const [statesObject, state, isSelfReviewer, isPriority] = states;
  let priorityOrNormalState = isPriority ? `priority_${state}` : state;
  let searchState = isSelfReviewer
    ? `reviewer_${priorityOrNormalState}`
    : priorityOrNormalState;
  return (
    applyIcon(statesObject[searchState], isPriority) ||
    applyCheckIconOrCountZero(isPriority)
  );
});
