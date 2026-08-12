import type { Prisma } from '@prisma/client';

const PROPOSAL_PAYLOAD_VERSION = 1;

export interface ProposalPayload {
  changes: Prisma.JsonObject;
  baseValues: Prisma.JsonObject;
}

const isJsonObject = (value: Prisma.JsonValue): value is Prisma.JsonObject =>
  typeof value === 'object' && value !== null && !Array.isArray(value);

export function createProposalPayload(
  changes: Prisma.InputJsonObject,
  baseValues: Prisma.InputJsonObject,
): Prisma.InputJsonObject {
  return {
    schemaVersion: PROPOSAL_PAYLOAD_VERSION,
    changes,
    baseValues,
  };
}

export function parseProposalPayload(
  value: Prisma.JsonValue,
): ProposalPayload | null {
  const changes = isJsonObject(value) ? value.changes : undefined;
  const baseValues = isJsonObject(value) ? value.baseValues : undefined;
  if (
    !isJsonObject(value) ||
    value.schemaVersion !== PROPOSAL_PAYLOAD_VERSION ||
    changes === undefined ||
    baseValues === undefined ||
    !isJsonObject(changes) ||
    !isJsonObject(baseValues)
  ) {
    return null;
  }

  return {
    changes,
    baseValues,
  };
}

export function publicProposalChanges(
  value: Prisma.JsonValue,
): Prisma.JsonValue {
  return parseProposalPayload(value)?.changes ?? value;
}
