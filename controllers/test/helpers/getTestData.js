import { logger } from '~/utils';
import { status } from '~/constants';

export const getTestData = (_, res) => {
  const { OK, SERVER_ERROR } = status;
  try {
    return res.json({
      success: true,
      data: {
        code: OK,
        message: 'Working',
      },
    });
  } catch (e) {
    logger('error', 'Error:', e.message);
    return res.json({
      status: SERVER_ERROR,
      success: false,
      message: 'Internal Server Error',
    });
  }
};
