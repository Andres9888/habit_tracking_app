import {
  captureTemplatesModalFirstVisible,
  getLastTemplatesModalVisibleMeasures,
  markTemplatesModalOpenIntent,
  resetTemplatesModalOpenPerformanceForTest,
} from '../templatesModalOpenPerformance';
import { getSentryReporter } from '../../../lib/sentry/reporter';

jest.mock('../../../lib/sentry/reporter', () => ({
  getSentryReporter: jest.fn(),
}));

const mockAddBreadcrumb = jest.fn();
const mockGetSentryReporter = getSentryReporter as jest.MockedFunction<
  typeof getSentryReporter
>;

describe('templates modal click-to-visible performance', () => {
  beforeEach(() => {
    resetTemplatesModalOpenPerformanceForTest();
    mockAddBreadcrumb.mockReset();
    mockGetSentryReporter.mockReturnValue({
      addBreadcrumb: mockAddBreadcrumb,
      captureError: jest.fn(),
      captureMessage: jest.fn(),
      capturePerformanceIssue: jest.fn(),
      finishTransaction: jest.fn(),
      setUser: jest.fn(),
      startTransaction: jest.fn(),
    });
    jest.spyOn(console, 'info').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('captures pending open intents when the modal first becomes visible', () => {
    markTemplatesModalOpenIntent('bottomActionBar');
    markTemplatesModalOpenIntent('modalState');

    const measures = captureTemplatesModalFirstVisible('modal');

    expect(measures).toHaveLength(2);
    expect(measures.map((measure) => measure.source)).toEqual([
      'bottomActionBar',
      'modalState',
    ]);
    expect(measures.every((measure) => measure.duration >= 0)).toBe(true);
    expect(getLastTemplatesModalVisibleMeasures()).toEqual(measures);
    expect(mockAddBreadcrumb).toHaveBeenCalledWith(
      expect.objectContaining({
        category: 'performance',
        data: expect.objectContaining({
          source: 'bottomActionBar',
          visibleSurface: 'modal',
        }),
        message: 'Templates modal click-to-visible',
      })
    );
  });

  it('captures each intent only once', () => {
    markTemplatesModalOpenIntent('bottomActionBar');

    expect(captureTemplatesModalFirstVisible('modal')).toHaveLength(1);
    expect(captureTemplatesModalFirstVisible('modal')).toEqual([]);
  });
});
