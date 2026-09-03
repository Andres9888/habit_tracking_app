import {
  ladderAnchor,
  ladderLabelStyle,
  ladderMarkContainerStyle,
} from '../ladderMarkLayout';

describe('ladderMarkLayout', () => {
  it('anchors marks at the track ends to the edge, others to centre', () => {
    expect(ladderAnchor(0)).toBe('start');
    expect(ladderAnchor(1.5)).toBe('start');
    expect(ladderAnchor(24)).toBe('center');
    expect(ladderAnchor(98.5)).toBe('end');
    expect(ladderAnchor(100)).toBe('end');
  });

  it('pins the start mark to left: 0 with a left-aligned label', () => {
    expect(ladderMarkContainerStyle(0)).toMatchObject({
      alignItems: 'flex-start',
      left: 0,
      marginLeft: -9,
    });
    expect(ladderLabelStyle(0)).toEqual({ paddingLeft: 9 });
  });

  it('pins the end mark to right: 0 with a right-aligned label', () => {
    expect(ladderMarkContainerStyle(100)).toMatchObject({
      alignItems: 'flex-end',
      right: 0,
      marginRight: -9,
    });
    expect(ladderLabelStyle(100)).toEqual({ paddingRight: 9 });
  });

  it('centres mid-track marks on their percentage', () => {
    expect(ladderMarkContainerStyle(24)).toMatchObject({
      alignItems: 'center',
      left: '24%',
      marginLeft: -24,
    });
    expect(ladderLabelStyle(24)).toEqual({});
  });
});
