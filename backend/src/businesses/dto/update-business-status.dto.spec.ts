import { validate } from 'class-validator';
import {
  BUSINESS_STATUSES,
  UpdateBusinessStatusDto,
} from './update-business-status.dto';

describe('UpdateBusinessStatusDto', () => {
  it.each(BUSINESS_STATUSES)(
    'accepts the supported status %s',
    async (status) => {
      const dto = Object.assign(new UpdateBusinessStatusDto(), { status });
      await expect(validate(dto)).resolves.toHaveLength(0);
    },
  );

  it('rejects an unsupported status', async () => {
    const dto = Object.assign(new UpdateBusinessStatusDto(), {
      status: 'DELETED',
    });
    await expect(validate(dto)).resolves.not.toHaveLength(0);
  });
});
