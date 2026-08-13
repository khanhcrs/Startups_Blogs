function valuesEqual(left: unknown, right: unknown): boolean {
  if (Object.is(left, right)) return true;

  if (Array.isArray(left) && Array.isArray(right)) {
    return (
      left.length === right.length &&
      left.every((value, index) => valuesEqual(value, right[index]))
    );
  }

  if (
    left &&
    right &&
    typeof left === 'object' &&
    typeof right === 'object'
  ) {
    const leftRecord = left as Record<string, unknown>;
    const rightRecord = right as Record<string, unknown>;
    const leftKeys = Object.keys(leftRecord).sort();
    const rightKeys = Object.keys(rightRecord).sort();

    return (
      valuesEqual(leftKeys, rightKeys) &&
      leftKeys.every((key) => valuesEqual(leftRecord[key], rightRecord[key]))
    );
  }

  return false;
}

export function createProposalDiff(
  original: Record<string, unknown>,
  current: Record<string, unknown>,
  allowedFields: readonly string[],
): Record<string, unknown> {
  return allowedFields.reduce<Record<string, unknown>>((changes, field) => {
    if (
      current[field] !== undefined &&
      !valuesEqual(original[field], current[field])
    ) {
      changes[field] = current[field];
    }
    return changes;
  }, {});
}
