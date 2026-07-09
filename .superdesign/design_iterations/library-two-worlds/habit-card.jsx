// HabitCard — faithful HTML mock of src/components/HabitCard
const { useState } = React;

window.Icon = {
  link: (c = '#fff', s = 22) => (
    <svg
      width={s}
      height={s}
      viewBox='0 0 24 24'
      fill='none'
      stroke={c}
      strokeWidth='2'
      strokeLinecap='round'
      strokeLinejoin='round'
    >
      <path d='M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71' />
      <path d='M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71' />
    </svg>
  ),
  check: (c = '#fff', s = 20) => (
    <svg
      width={s}
      height={s}
      viewBox='0 0 24 24'
      fill='none'
      stroke={c}
      strokeWidth='3'
      strokeLinecap='round'
      strokeLinejoin='round'
    >
      <polyline points='4 12 10 18 20 6' />
    </svg>
  ),
  plus: (c = '#fff', s = 20) => (
    <svg
      width={s}
      height={s}
      viewBox='0 0 24 24'
      fill='none'
      stroke={c}
      strokeWidth='2.5'
      strokeLinecap='round'
    >
      <line x1='12' y1='5' x2='12' y2='19' />
      <line x1='5' y1='12' x2='19' y2='12' />
    </svg>
  ),
  chevron: (c = T.g400, s = 14) => (
    <svg
      width={s}
      height={s}
      viewBox='0 0 24 24'
      fill='none'
      stroke={c}
      strokeWidth='2.5'
      strokeLinecap='round'
    >
      <polyline points='9 18 15 12 9 6' />
    </svg>
  ),
  search: (c = T.g500, s = 18) => (
    <svg
      width={s}
      height={s}
      viewBox='0 0 24 24'
      fill='none'
      stroke={c}
      strokeWidth='2'
      strokeLinecap='round'
    >
      <circle cx='11' cy='11' r='7' />
      <line x1='21' y1='21' x2='16' y2='16' />
    </svg>
  ),
  more: (c = T.g500, s = 20) => (
    <svg width={s} height={s} viewBox='0 0 24 24' fill={c}>
      <circle cx='5' cy='12' r='2' />
      <circle cx='12' cy='12' r='2' />
      <circle cx='19' cy='12' r='2' />
    </svg>
  ),
};

window.strengthColor = (p) => {
  if (p >= 80) return { c: T.strAuto, bg: T.strAutoLight, label: 'Automatic' };
  if (p >= 60) return { c: T.strStrong, bg: T.strStrongLight, label: 'Strong' };
  if (p >= 40)
    return { c: T.strBuilding, bg: T.strBuildingLight, label: 'Building' };
  if (p >= 20)
    return {
      c: T.strDeveloping,
      bg: T.strDevelopingLight,
      label: 'Developing',
    };
  return { c: T.strStarting, bg: T.strStartingLight, label: 'Starting' };
};

window.HabitCardBefore = function ({
  icon,
  name,
  streak,
  strength,
  completed,
  accent = T.primary600,
  atRisk,
}) {
  const s = strengthColor(strength);
  return (
    <div
      style={{
        position: 'relative',
        overflow: 'hidden',
        background: '#FFFFFF',
        border: `1px solid ${T.borderMuted}`,
        borderRadius: 20,
        padding: 20,
        minHeight: 76,
        margin: '10px 16px',
        boxShadow: T.shadowCard,
        display: 'flex',
        flexDirection: 'column',
        gap: 6,
      }}
    >
      <div
        style={{
          position: 'absolute',
          inset: 0,
          width: `${strength}%`,
          background: s.bg,
          opacity: 0.55,
        }}
      />
      <div
        style={{
          position: 'absolute',
          top: 0,
          bottom: 0,
          left: 0,
          width: 3,
          background: accent,
        }}
      />
      <div
        style={{
          position: 'relative',
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          gap: 12,
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            flex: 1,
            minWidth: 0,
          }}
        >
          <span style={{ fontSize: 26 }}>{icon}</span>
          <span
            style={{
              fontFamily: '"DM Sans", sans-serif',
              fontSize: 28,
              fontWeight: 800,
              letterSpacing: -0.5,
              color: T.g800,
              textDecoration: completed ? 'line-through' : 'none',
              opacity: completed ? 0.55 : 1,
            }}
          >
            {name}
          </span>
        </div>
        <div
          style={{
            width: 32,
            height: 32,
            borderRadius: 16,
            background: completed ? T.primary600 : atRisk ? '#FCD34D' : T.g200,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}
        >
          {completed
            ? Icon.check('#fff', 18)
            : Icon.link(atRisk ? '#92400e' : T.g500, 16)}
        </div>
      </div>
      <div
        style={{
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          gap: 6,
          marginTop: 2,
        }}
      >
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 5,
            padding: '4px 10px',
            background: '#FEF3CD',
            borderRadius: 9999,
          }}
        >
          <span style={{ fontSize: 13 }}>🔥</span>
          <span style={{ fontSize: 13, fontWeight: 700, color: '#92400e' }}>
            {streak} Day{streak === 1 ? '' : 's'} Streak
          </span>
        </div>
      </div>
      <div
        style={{
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          marginTop: 6,
        }}
      >
        <span style={{ fontSize: 14 }}>
          {s.label === 'Starting'
            ? '🌱'
            : s.label === 'Developing'
              ? '🌿'
              : s.label === 'Building'
                ? '🌳'
                : s.label === 'Strong'
                  ? '💪'
                  : '⭐'}
        </span>
        <div
          style={{
            flex: 1,
            height: 6,
            background: T.g200,
            borderRadius: 3,
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              height: '100%',
              width: `${strength}%`,
              background: s.c,
              borderRadius: 3,
            }}
          />
        </div>
        <span style={{ fontSize: 12, fontWeight: 700, color: T.g600 }}>
          {strength}%
        </span>
      </div>
    </div>
  );
};

window.HabitCardAfter = function ({
  icon,
  name,
  streak,
  strength,
  completed,
  accent = T.primary600,
  atRisk,
  bestStreak,
  newRecord,
}) {
  const s = strengthColor(strength);
  return (
    <div
      style={{
        position: 'relative',
        overflow: 'hidden',
        background: T.cardWhite,
        border: `1px solid ${T.borderMuted}`,
        borderRadius: T.rLg,
        padding: T.base,
        minHeight: 76,
        margin: `${T.sm}px ${T.base}px`,
        boxShadow: T.shadowCard,
        display: 'flex',
        flexDirection: 'column',
        gap: T.xs,
      }}
    >
      <div
        style={{
          position: 'absolute',
          inset: 0,
          width: `${strength}%`,
          background: s.bg,
          opacity: 0.55,
        }}
      />
      <div
        style={{
          position: 'absolute',
          top: 0,
          bottom: 0,
          left: 0,
          width: 3,
          background: accent,
        }}
      />

      <div
        style={{
          position: 'relative',
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          gap: T.md,
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: T.md,
            flex: 1,
            minWidth: 0,
          }}
        >
          <span style={{ fontSize: 26, lineHeight: 1 }}>{icon}</span>
          <span
            style={{
              ...Ty.heading3,
              color: T.g800,
              textDecoration: completed ? 'line-through' : 'none',
              opacity: completed ? 0.55 : 1,
            }}
          >
            {name}
          </span>
        </div>
        <div
          style={{
            width: 32,
            height: 32,
            borderRadius: 16,
            background: completed
              ? T.primary600
              : atRisk
                ? T.streak100
                : T.g200,
            border:
              atRisk && !completed ? `1.5px solid ${T.streak500}` : 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
            transition: 'all .2s',
          }}
        >
          {completed
            ? Icon.check(T.textInverse, 18)
            : Icon.link(atRisk ? T.streak700 : T.g500, 16)}
        </div>
      </div>

      <div
        style={{
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          gap: T.sm,
          marginTop: 2,
          flexWrap: 'wrap',
        }}
      >
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 5,
            padding: '3px 10px',
            background: T.streak100,
            borderRadius: T.rFull,
          }}
        >
          <span style={{ fontSize: 13 }}>🔥</span>
          <span
            style={{ ...Ty.bodySmall, fontWeight: 600, color: T.streak700 }}
          >
            {streak} Day{streak === 1 ? '' : 's'} Streak
          </span>
        </div>
        {bestStreak ? (
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 4,
              padding: '3px 8px',
              background: newRecord ? T.streak100 : T.g100,
              border: `1px solid ${newRecord ? T.streak300 : T.border}`,
              borderRadius: T.rFull,
            }}
          >
            <span style={{ fontSize: 11 }}>🏅</span>
            <span
              style={{ ...Ty.caption, color: newRecord ? T.streak700 : T.g500 }}
            >
              {newRecord ? 'New Record!' : `Best: ${bestStreak}`}
            </span>
          </div>
        ) : null}
      </div>

      <div
        style={{
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          gap: T.sm,
          marginTop: T.xs,
        }}
      >
        <span style={{ fontSize: 14 }}>
          {s.label === 'Starting'
            ? '🌱'
            : s.label === 'Developing'
              ? '🌿'
              : s.label === 'Building'
                ? '🌳'
                : s.label === 'Strong'
                  ? '💪'
                  : '⭐'}
        </span>
        <div
          style={{
            flex: 1,
            height: 6,
            background: T.g200,
            borderRadius: T.rXs,
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              height: '100%',
              width: `${strength}%`,
              background: s.c,
              borderRadius: T.rXs,
            }}
          />
        </div>
        <span
          style={{
            ...Ty.caption,
            color: T.g600,
            fontVariantNumeric: 'tabular-nums',
          }}
        >
          {strength}%
        </span>
      </div>
    </div>
  );
};

// Phone shell — reusable
window.Phone = function ({
  children,
  label,
  width = 390,
  height = 780,
  dark = false,
}) {
  return (
    <div
      style={{
        width,
        height,
        borderRadius: 44,
        overflow: 'hidden',
        position: 'relative',
        background: dark ? '#1A1816' : T.bg,
        boxShadow:
          '0 40px 80px rgba(0,0,0,0.18), 0 0 0 1px rgba(0,0,0,0.12), inset 0 0 0 8px #0A0908',
        padding: 8,
        boxSizing: 'border-box',
      }}
    >
      <div
        style={{
          width: '100%',
          height: '100%',
          borderRadius: 36,
          overflow: 'hidden',
          background: dark ? '#1A1816' : T.bg,
          position: 'relative',
        }}
      >
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: 44,
            zIndex: 10,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0 24px',
          }}
        >
          <div
            style={{
              ...Ty.bodySmall,
              fontWeight: 600,
              color: dark ? '#fff' : T.g800,
              paddingTop: 14,
            }}
          >
            9:41
          </div>
          <div
            style={{
              position: 'absolute',
              top: 11,
              left: '50%',
              transform: 'translateX(-50%)',
              width: 110,
              height: 30,
              borderRadius: 20,
              background: '#000',
            }}
          />
          <div
            style={{
              display: 'flex',
              gap: 5,
              alignItems: 'center',
              paddingTop: 14,
            }}
          >
            <svg width='17' height='11' viewBox='0 0 17 11'>
              <rect
                x='0'
                y='6'
                width='3'
                height='5'
                rx='0.6'
                fill={dark ? '#fff' : T.g800}
              />
              <rect
                x='4.5'
                y='4'
                width='3'
                height='7'
                rx='0.6'
                fill={dark ? '#fff' : T.g800}
              />
              <rect
                x='9'
                y='2'
                width='3'
                height='9'
                rx='0.6'
                fill={dark ? '#fff' : T.g800}
              />
              <rect
                x='13.5'
                y='0'
                width='3'
                height='11'
                rx='0.6'
                fill={dark ? '#fff' : T.g800}
              />
            </svg>
            <svg width='24' height='11' viewBox='0 0 24 11'>
              <rect
                x='0.5'
                y='0.5'
                width='21'
                height='10'
                rx='2.5'
                stroke={dark ? '#fff' : T.g800}
                strokeOpacity='0.4'
                fill='none'
              />
              <rect
                x='2'
                y='2'
                width='16'
                height='7'
                rx='1.2'
                fill={dark ? '#fff' : T.g800}
              />
            </svg>
          </div>
        </div>
        <div
          style={{
            width: '100%',
            height: '100%',
            overflow: 'hidden',
            paddingTop: 44,
            boxSizing: 'border-box',
          }}
        >
          {children}
        </div>
      </div>
    </div>
  );
};
