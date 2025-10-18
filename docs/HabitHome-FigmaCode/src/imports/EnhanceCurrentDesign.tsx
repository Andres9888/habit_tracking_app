import svgPaths from './svg-vi3ciutu8c';
import { imgGroup, imgVector, imgVector1 } from './svg-qxdry';

function Paragraph() {
  return (
    <div
      className='relative h-[21.006px] w-[37.843px] shrink-0'
      data-name='Paragraph'
    >
      <div className='relative box-border h-[21.006px] w-[37.843px] border-0 border-solid border-[transparent] bg-clip-padding'>
        <p className="absolute left-0 top-[0.1px] whitespace-pre text-nowrap font-['Inter:Semi_Bold',_sans-serif] text-[14px] font-semibold not-italic leading-[21px] text-[#101727]">
          10:55
        </p>
      </div>
    </div>
  );
}

function Clip0Signal() {
  return (
    <div
      className='absolute left-[123.5px] top-0 size-[39.997px]'
      data-name='Container'
    >
      <div
        className='absolute left-[40px] top-[20px] h-[1.998px] w-[21.743px] bg-green-400'
        data-name='Container'
      />
      <div
        className='absolute left-0 top-0 flex size-[39.997px] flex-col content-stretch items-start rounded-[1.75866e+07px] bg-green-400'
        data-name='Button'
      >
        <div
          className='relative h-[39.997px] w-full shrink-0'
          data-name='Container'
        >
          <div className='flex size-full flex-row items-center justify-center'>
            <div className='relative flex h-[39.997px] w-full content-stretch items-center justify-center'>
              <div
                className='relative h-[15.994px] w-[19.999px] shrink-0'
                data-name='HabitCard'
              >
                <div className='relative box-border h-[15.994px] w-[19.999px] overflow-clip rounded-[inherit] border-0 border-solid border-[transparent] bg-clip-padding'>
                  <div
                    className='absolute inset-0 contents'
                    data-name='Clip path group'
                  >
                    <div
                      className='mask-alpha mask-intersect mask-no-clip mask-no-repeat mask-position-[-0.557px_-0.651px] mask-size-[19.999px_15.994px] absolute inset-[4.07%_2.79%]'
                      data-name='Group'
                      style={{ maskImage: `url('${imgGroup}')` }}
                    >
                      <svg
                        className='block size-full'
                        fill='none'
                        preserveAspectRatio='none'
                        viewBox='0 0 19 15'
                      >
                        <g id='Group'>
                          <path
                            d={svgPaths.p30bd5680}
                            fill='var(--fill-0, white)'
                            id='Vector'
                          />
                        </g>
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Group() {
  return (
    <div
      className='absolute bottom-[18.75%] left-0 right-[3.57%] top-[18.75%] contents'
      data-name='Group'
    >
      <div
        className='mask-alpha mask-intersect mask-no-clip mask-no-repeat mask-position-[0px_-2.25px] mask-size-[13.014px_11.998px] absolute bottom-[18.75%] left-0 right-[3.57%] top-[18.75%]'
        data-name='Vector'
        style={{ maskImage: `url('${imgVector}')` }}
      >
        <svg
          className='block size-full'
          fill='none'
          preserveAspectRatio='none'
          viewBox='0 0 14 8'
        >
          <path
            d={svgPaths.pf622b00}
            fill='var(--fill-0, #101727)'
            id='Vector'
          />
        </svg>
      </div>
    </div>
  );
}

function ClipPathGroup() {
  return (
    <div
      className='absolute bottom-0 left-0 right-[3.57%] top-0 contents'
      data-name='Clip path group'
    >
      <Group />
    </div>
  );
}

function Icon() {
  return (
    <div
      className='relative h-[11.998px] w-full shrink-0 overflow-clip'
      data-name='Icon'
    >
      <ClipPathGroup />
    </div>
  );
}

function Container() {
  return (
    <div
      className='relative h-[11.998px] w-[13.496px] shrink-0'
      data-name='Container'
    >
      <div className='relative box-border flex h-[11.998px] w-[13.496px] flex-col content-stretch items-start border-0 border-solid border-[transparent] bg-clip-padding'>
        <Icon />
      </div>
    </div>
  );
}

function Clip0Wifi() {
  return (
    <p className="absolute left-0 top-[-0.43px] whitespace-pre text-nowrap font-['Inter:Regular',_sans-serif] text-[24px] font-normal not-italic leading-[32px] tracking-[0.0703px] text-neutral-950">
      💪
    </p>
  );
}

function Group1() {
  return (
    <div
      className='absolute bottom-[6.25%] left-0 right-[0.02%] top-[6.25%] contents'
      data-name='Group'
    >
      <div
        className='mask-alpha mask-intersect mask-no-clip mask-no-repeat mask-position-[0px_-0.75px] mask-size-[14.995px_11.998px] absolute bottom-[6.25%] left-0 right-[0.02%] top-[6.25%]'
        data-name='Vector'
        style={{ maskImage: `url('${imgVector1}')` }}
      >
        <svg
          className='block size-full'
          fill='none'
          preserveAspectRatio='none'
          viewBox='0 0 15 11'
        >
          <path
            d={svgPaths.p111ee900}
            fill='var(--fill-0, #101727)'
            id='Vector'
          />
        </svg>
      </div>
    </div>
  );
}

function ClipPathGroup1() {
  return (
    <div className='absolute inset-0 contents' data-name='Clip path group'>
      <Group1 />
    </div>
  );
}

function Icon1() {
  return (
    <div
      className='relative h-[11.998px] w-full shrink-0 overflow-clip'
      data-name='Icon'
    >
      <ClipPathGroup1 />
    </div>
  );
}

function Container1() {
  return (
    <div
      className='relative h-[11.998px] w-[14.995px] shrink-0'
      data-name='Container'
    >
      <div className='relative box-border flex h-[11.998px] w-[14.995px] flex-col content-stretch items-start border-0 border-solid border-[transparent] bg-clip-padding'>
        <Icon1 />
      </div>
    </div>
  );
}

function Group2() {
  return (
    <div
      className='absolute bottom-0 left-[5%] right-[5%] top-0 contents'
      data-name='Group'
    >
      <div
        className='mask-alpha mask-intersect mask-no-clip mask-no-repeat mask-position-[-0.75px_0px] mask-size-[14.995px_11.998px] absolute bottom-0 left-[5%] right-[5%] top-0'
        data-name='Vector'
        style={{ maskImage: `url('${imgVector1}')` }}
      >
        <svg
          className='block size-full'
          fill='none'
          preserveAspectRatio='none'
          viewBox='0 0 14 12'
        >
          <path
            d={svgPaths.p3bc3f700}
            fill='var(--fill-0, #101727)'
            id='Vector'
          />
        </svg>
      </div>
    </div>
  );
}

function ClipPathGroup2() {
  return (
    <div className='absolute inset-0 contents' data-name='Clip path group'>
      <Group2 />
    </div>
  );
}

function Icon2() {
  return (
    <div
      className='relative h-[11.998px] w-full shrink-0 overflow-clip'
      data-name='Icon'
    >
      <ClipPathGroup2 />
    </div>
  );
}

function Container2() {
  return (
    <div
      className='relative h-[11.998px] w-[14.995px] shrink-0'
      data-name='Container'
    >
      <div className='relative box-border flex h-[11.998px] w-[14.995px] flex-col content-stretch items-start border-0 border-solid border-[transparent] bg-clip-padding'>
        <Icon2 />
      </div>
    </div>
  );
}

function Container3() {
  return (
    <div
      className='relative h-[11.998px] w-[51.479px] shrink-0'
      data-name='Container'
    >
      <div className='relative box-border flex h-[11.998px] w-[51.479px] content-stretch items-center gap-[3.996px] border-0 border-solid border-[transparent] bg-clip-padding'>
        <Container />
        <Container1 />
        <Container2 />
      </div>
    </div>
  );
}

function Container4() {
  return (
    <div
      className='absolute left-0 top-0 box-border flex h-[35.992px] w-[393.092px] content-stretch items-center justify-between bg-white px-[23.995px] py-0'
      data-name='Container'
    >
      <Paragraph />
      <Container3 />
    </div>
  );
}

function Heading1() {
  return (
    <div
      className='relative h-[39.997px] w-[116.003px] shrink-0'
      data-name='Heading 1'
    >
      <div className='relative box-border h-[39.997px] w-[116.003px] border-0 border-solid border-[transparent] bg-clip-padding'>
        <p className="absolute left-0 top-[-0.1px] whitespace-pre text-nowrap font-['Inter:Extra_Bold',_sans-serif] text-[36px] font-extrabold not-italic leading-[40px] text-[#101727]">
          Habits
        </p>
      </div>
    </div>
  );
}

function Icon3() {
  return (
    <div
      className='relative h-[23.995px] w-full shrink-0 overflow-clip'
      data-name='Icon'
    >
      <div className='absolute inset-[8.41%_12.68%]' data-name='Vector'>
        <div className='absolute inset-[-5.01%_-5.58%]'>
          <svg
            className='block size-full'
            fill='none'
            preserveAspectRatio='none'
            viewBox='0 0 20 22'
          >
            <path
              d={svgPaths.p26a05530}
              id='Vector'
              stroke='var(--stroke-0, #101727)'
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth='1.99958'
            />
          </svg>
        </div>
      </div>
      <div className='absolute inset-[37.5%]' data-name='Vector'>
        <div className='absolute inset-[-16.667%]'>
          <svg
            className='block size-full'
            fill='none'
            preserveAspectRatio='none'
            viewBox='0 0 8 8'
          >
            <path
              d={svgPaths.p30141300}
              id='Vector'
              stroke='var(--stroke-0, #101727)'
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth='1.99958'
            />
          </svg>
        </div>
      </div>
    </div>
  );
}

function SlotClone() {
  return (
    <div
      className='relative size-[39.981px] shrink-0 rounded-[10px]'
      data-name='SlotClone'
    >
      <div className='relative box-border flex size-[39.981px] flex-col content-stretch items-start border-0 border-solid border-[transparent] bg-clip-padding px-[7.993px] pb-0 pt-[7.993px]'>
        <Icon3 />
      </div>
    </div>
  );
}

function Container5() {
  return (
    <div
      className='absolute left-[24px] top-0 flex h-[87.987px] w-[327.003px] content-stretch items-center justify-between'
      data-name='Container'
    >
      <Heading1 />
      <SlotClone />
    </div>
  );
}

function Paragraph1() {
  return (
    <div
      className='relative h-[17.992px] w-[29.736px] shrink-0'
      data-name='Paragraph'
    >
      <div className='relative box-border h-[17.992px] w-[29.736px] border-0 border-solid border-[transparent] bg-clip-padding'>
        <p className="absolute left-[15.5px] top-[0.57px] translate-x-[-50%] whitespace-pre text-nowrap text-center font-['Inter:Semi_Bold',_sans-serif] text-[12px] font-semibold not-italic leading-[18px] tracking-[1.2px] text-[#a0aec0]">
          OCT
        </p>
      </div>
    </div>
  );
}

function Paragraph2() {
  return (
    <div
      className='relative h-[36.001px] w-[14.675px] shrink-0'
      data-name='Paragraph'
    >
      <div className='relative box-border h-[36.001px] w-[14.675px] border-0 border-solid border-[transparent] bg-clip-padding'>
        <p className="absolute left-[7.5px] top-[-0.52px] translate-x-[-50%] whitespace-pre text-nowrap text-center font-['Inter:Bold',_sans-serif] text-[30px] font-bold not-italic leading-[36px] text-[#a0aec0]">
          1
        </p>
      </div>
    </div>
  );
}

function Paragraph3() {
  return (
    <div
      className='relative h-[17.992px] w-[30.301px] shrink-0'
      data-name='Paragraph'
    >
      <div className='relative box-border h-[17.992px] w-[30.301px] border-0 border-solid border-[transparent] bg-clip-padding'>
        <p className="absolute left-0 top-[0.57px] whitespace-pre text-nowrap font-['Inter:Bold',_sans-serif] text-[12px] font-bold not-italic leading-[18px] tracking-[0.6px] text-[#a0aec0]">
          WED
        </p>
      </div>
    </div>
  );
}

function Container6() {
  return (
    <div
      className='relative h-[79.978px] w-[39.997px] shrink-0'
      data-name='Container'
    >
      <div className='relative box-border flex h-[79.978px] w-[39.997px] flex-col content-stretch items-center gap-[3.996px] border-0 border-solid border-[transparent] bg-clip-padding'>
        <Paragraph1 />
        <Paragraph2 />
        <Paragraph3 />
      </div>
    </div>
  );
}

function Paragraph4() {
  return (
    <div
      className='relative h-[17.992px] w-[29.736px] shrink-0'
      data-name='Paragraph'
    >
      <div className='relative box-border h-[17.992px] w-[29.736px] border-0 border-solid border-[transparent] bg-clip-padding'>
        <p className="absolute left-[15.5px] top-[0.57px] translate-x-[-50%] whitespace-pre text-nowrap text-center font-['Inter:Semi_Bold',_sans-serif] text-[12px] font-semibold not-italic leading-[18px] tracking-[1.2px] text-[#a0aec0]">
          OCT
        </p>
      </div>
    </div>
  );
}

function Paragraph5() {
  return (
    <div
      className='relative h-[36.001px] w-[18.893px] shrink-0'
      data-name='Paragraph'
    >
      <div className='relative box-border h-[36.001px] w-[18.893px] border-0 border-solid border-[transparent] bg-clip-padding'>
        <p className="absolute left-[9.5px] top-[-0.52px] translate-x-[-50%] whitespace-pre text-nowrap text-center font-['Inter:Bold',_sans-serif] text-[30px] font-bold not-italic leading-[36px] text-[#a0aec0]">
          2
        </p>
      </div>
    </div>
  );
}

function Paragraph6() {
  return (
    <div
      className='relative h-[17.992px] w-[27.525px] shrink-0'
      data-name='Paragraph'
    >
      <div className='relative box-border h-[17.992px] w-[27.525px] border-0 border-solid border-[transparent] bg-clip-padding'>
        <p className="absolute left-0 top-[0.57px] whitespace-pre text-nowrap font-['Inter:Bold',_sans-serif] text-[12px] font-bold not-italic leading-[18px] tracking-[0.6px] text-[#a0aec0]">
          THU
        </p>
      </div>
    </div>
  );
}

function Container7() {
  return (
    <div
      className='relative h-[79.978px] w-[39.997px] shrink-0'
      data-name='Container'
    >
      <div className='relative box-border flex h-[79.978px] w-[39.997px] flex-col content-stretch items-center gap-[3.996px] border-0 border-solid border-[transparent] bg-clip-padding'>
        <Paragraph4 />
        <Paragraph5 />
        <Paragraph6 />
      </div>
    </div>
  );
}

function Paragraph7() {
  return (
    <div
      className='relative h-[17.992px] w-[29.736px] shrink-0'
      data-name='Paragraph'
    >
      <div className='relative box-border h-[17.992px] w-[29.736px] border-0 border-solid border-[transparent] bg-clip-padding'>
        <p className="absolute left-[15.5px] top-[0.57px] translate-x-[-50%] whitespace-pre text-nowrap text-center font-['Inter:Semi_Bold',_sans-serif] text-[12px] font-semibold not-italic leading-[18px] tracking-[1.2px] text-[#a0aec0]">
          OCT
        </p>
      </div>
    </div>
  );
}

function Paragraph8() {
  return (
    <div
      className='relative h-[36.001px] w-[19.786px] shrink-0'
      data-name='Paragraph'
    >
      <div className='relative box-border h-[36.001px] w-[19.786px] border-0 border-solid border-[transparent] bg-clip-padding'>
        <p className="absolute left-[10px] top-[-0.52px] translate-x-[-50%] whitespace-pre text-nowrap text-center font-['Inter:Bold',_sans-serif] text-[30px] font-bold not-italic leading-[36px] text-[#a0aec0]">
          3
        </p>
      </div>
    </div>
  );
}

function Paragraph9() {
  return (
    <div
      className='relative h-[17.992px] w-[20.056px] shrink-0'
      data-name='Paragraph'
    >
      <div className='relative box-border h-[17.992px] w-[20.056px] border-0 border-solid border-[transparent] bg-clip-padding'>
        <p className="absolute left-0 top-[0.57px] whitespace-pre text-nowrap font-['Inter:Bold',_sans-serif] text-[12px] font-bold not-italic leading-[18px] tracking-[0.6px] text-[#a0aec0]">
          FRI
        </p>
      </div>
    </div>
  );
}

function Container8() {
  return (
    <div
      className='relative h-[79.978px] w-[39.997px] shrink-0'
      data-name='Container'
    >
      <div className='relative box-border flex h-[79.978px] w-[39.997px] flex-col content-stretch items-center gap-[3.996px] border-0 border-solid border-[transparent] bg-clip-padding'>
        <Paragraph7 />
        <Paragraph8 />
        <Paragraph9 />
      </div>
    </div>
  );
}

function Paragraph10() {
  return (
    <div
      className='relative h-[17.992px] w-[29.736px] shrink-0'
      data-name='Paragraph'
    >
      <div className='relative box-border h-[17.992px] w-[29.736px] border-0 border-solid border-[transparent] bg-clip-padding'>
        <p className="absolute left-[15.5px] top-[0.57px] translate-x-[-50%] whitespace-pre text-nowrap text-center font-['Inter:Semi_Bold',_sans-serif] text-[12px] font-semibold not-italic leading-[18px] tracking-[1.2px] text-[#a0aec0]">
          OCT
        </p>
      </div>
    </div>
  );
}

function Paragraph11() {
  return (
    <div
      className='relative h-[36.001px] w-[20.334px] shrink-0'
      data-name='Paragraph'
    >
      <div className='relative box-border h-[36.001px] w-[20.334px] border-0 border-solid border-[transparent] bg-clip-padding'>
        <p className="absolute left-[10.5px] top-[-0.52px] translate-x-[-50%] whitespace-pre text-nowrap text-center font-['Inter:Bold',_sans-serif] text-[30px] font-bold not-italic leading-[36px] text-[#a0aec0]">
          4
        </p>
      </div>
    </div>
  );
}

function Paragraph12() {
  return (
    <div
      className='relative h-[17.992px] w-[25.371px] shrink-0'
      data-name='Paragraph'
    >
      <div className='relative box-border h-[17.992px] w-[25.371px] border-0 border-solid border-[transparent] bg-clip-padding'>
        <p className="absolute left-0 top-[0.57px] whitespace-pre text-nowrap font-['Inter:Bold',_sans-serif] text-[12px] font-bold not-italic leading-[18px] tracking-[0.6px] text-[#a0aec0]">
          SAT
        </p>
      </div>
    </div>
  );
}

function Container9() {
  return (
    <div
      className='relative h-[79.978px] w-[39.997px] shrink-0'
      data-name='Container'
    >
      <div className='relative box-border flex h-[79.978px] w-[39.997px] flex-col content-stretch items-center gap-[3.996px] border-0 border-solid border-[transparent] bg-clip-padding'>
        <Paragraph10 />
        <Paragraph11 />
        <Paragraph12 />
      </div>
    </div>
  );
}

function Paragraph13() {
  return (
    <div
      className='relative h-[17.992px] w-[29.736px] shrink-0'
      data-name='Paragraph'
    >
      <div className='relative box-border h-[17.992px] w-[29.736px] border-0 border-solid border-[transparent] bg-clip-padding'>
        <p className="absolute left-[15.5px] top-[0.57px] translate-x-[-50%] whitespace-pre text-nowrap text-center font-['Inter:Semi_Bold',_sans-serif] text-[12px] font-semibold not-italic leading-[18px] tracking-[1.2px] text-[#a0aec0]">
          OCT
        </p>
      </div>
    </div>
  );
}

function Paragraph14() {
  return (
    <div
      className='relative h-[36.001px] w-[19.335px] shrink-0'
      data-name='Paragraph'
    >
      <div className='relative box-border h-[36.001px] w-[19.335px] border-0 border-solid border-[transparent] bg-clip-padding'>
        <p className="absolute left-[10px] top-[-0.52px] translate-x-[-50%] whitespace-pre text-nowrap text-center font-['Inter:Bold',_sans-serif] text-[30px] font-bold not-italic leading-[36px] text-[#101727]">
          5
        </p>
      </div>
    </div>
  );
}

function Paragraph15() {
  return (
    <div
      className='relative h-[17.992px] w-[27.23px] shrink-0'
      data-name='Paragraph'
    >
      <div className='relative box-border h-[17.992px] w-[27.23px] border-0 border-solid border-[transparent] bg-clip-padding'>
        <p className="absolute left-0 top-[0.57px] whitespace-pre text-nowrap font-['Inter:Bold',_sans-serif] text-[12px] font-bold not-italic leading-[18px] tracking-[0.6px] text-[#a0aec0]">
          SUN
        </p>
      </div>
    </div>
  );
}

function Container10() {
  return (
    <div
      className='relative h-[79.978px] w-[39.997px] shrink-0'
      data-name='Container'
    >
      <div className='relative box-border flex h-[79.978px] w-[39.997px] flex-col content-stretch items-center gap-[3.996px] border-0 border-solid border-[transparent] bg-clip-padding'>
        <Paragraph13 />
        <Paragraph14 />
        <Paragraph15 />
      </div>
    </div>
  );
}

function DateSelector() {
  return (
    <div
      className='absolute left-[43.99px] top-[87.99px] box-border flex h-[79.978px] w-[286.998px] content-stretch items-start justify-between py-0 pl-0 pr-[0.008px]'
      data-name='DateSelector'
    >
      <Container6 />
      <Container7 />
      <Container8 />
      <Container9 />
      <Container10 />
    </div>
  );
}

function Text() {
  return (
    <div
      className='relative h-[32.004px] w-[24.11px] shrink-0'
      data-name='Text'
    >
      <div className='relative box-border h-[32.004px] w-[24.11px] border-0 border-solid border-[transparent] bg-clip-padding'>
        <p className="absolute left-0 top-[-0.43px] whitespace-pre text-nowrap font-['Inter:Regular',_sans-serif] text-[24px] font-normal not-italic leading-[32px] tracking-[0.0703px] text-neutral-950">
          🧘
        </p>
      </div>
    </div>
  );
}

function Heading2() {
  return (
    <div
      className='relative h-[27px] w-[93.646px] shrink-0'
      data-name='Heading 2'
    >
      <div className='relative box-border h-[27px] w-[93.646px] border-0 border-solid border-[transparent] bg-clip-padding'>
        <p className="absolute left-0 top-[0.62px] whitespace-pre text-nowrap font-['Inter:Semi_Bold',_sans-serif] text-[18px] font-semibold not-italic leading-[27px] text-[#101727]">
          Meditation
        </p>
      </div>
    </div>
  );
}

function HabitCard() {
  return (
    <div
      className='relative flex h-[32.004px] w-full shrink-0 content-stretch items-center gap-[11.998px]'
      data-name='HabitCard'
    >
      <Text />
      <Heading2 />
    </div>
  );
}

function Container11() {
  return (
    <div
      className='absolute left-[40px] top-[20px] h-[1.998px] w-[21.743px] bg-green-400'
      data-name='Container'
    />
  );
}

function Group3() {
  return (
    <div
      className='mask-alpha mask-intersect mask-no-clip mask-no-repeat mask-position-[-0.557px_-0.651px] mask-size-[19.999px_15.994px] absolute inset-[4.07%_2.79%]'
      data-name='Group'
      style={{ maskImage: `url('${imgGroup}')` }}
    >
      <svg
        className='block size-full'
        fill='none'
        preserveAspectRatio='none'
        viewBox='0 0 19 15'
      >
        <g id='Group'>
          <path
            d={svgPaths.p30bd5680}
            fill='var(--fill-0, white)'
            id='Vector'
          />
        </g>
      </svg>
    </div>
  );
}

function ClipPathGroup3() {
  return (
    <div className='absolute inset-0 contents' data-name='Clip path group'>
      <Group3 />
    </div>
  );
}

function HabitCard1() {
  return (
    <div
      className='relative h-[15.994px] w-[19.999px] shrink-0'
      data-name='HabitCard'
    >
      <div className='relative box-border h-[15.994px] w-[19.999px] overflow-clip rounded-[inherit] border-0 border-solid border-[transparent] bg-clip-padding'>
        <ClipPathGroup3 />
      </div>
    </div>
  );
}

function Container12() {
  return (
    <div
      className='relative h-[39.997px] w-full shrink-0'
      data-name='Container'
    >
      <div className='flex size-full flex-row items-center justify-center'>
        <div className='relative flex h-[39.997px] w-full content-stretch items-center justify-center'>
          <HabitCard1 />
        </div>
      </div>
    </div>
  );
}

function Button() {
  return (
    <div
      className='absolute left-0 top-0 flex size-[39.997px] flex-col content-stretch items-start rounded-[1.75866e+07px] bg-green-400'
      data-name='Button'
    >
      <Container12 />
    </div>
  );
}

function Container13() {
  return (
    <div
      className='absolute left-0 top-0 size-[39.997px]'
      data-name='Container'
    >
      <Container11 />
      <Button />
    </div>
  );
}

function Container14() {
  return (
    <div
      className='absolute left-[40px] top-[20px] h-[1.998px] w-[21.743px] bg-green-400'
      data-name='Container'
    />
  );
}

function Group4() {
  return (
    <div
      className='mask-alpha mask-intersect mask-no-clip mask-no-repeat mask-position-[-0.557px_-0.651px] mask-size-[19.999px_15.994px] absolute inset-[4.07%_2.79%]'
      data-name='Group'
      style={{ maskImage: `url('${imgGroup}')` }}
    >
      <svg
        className='block size-full'
        fill='none'
        preserveAspectRatio='none'
        viewBox='0 0 19 15'
      >
        <g id='Group'>
          <path
            d={svgPaths.p30bd5680}
            fill='var(--fill-0, white)'
            id='Vector'
          />
        </g>
      </svg>
    </div>
  );
}

function ClipPathGroup4() {
  return (
    <div className='absolute inset-0 contents' data-name='Clip path group'>
      <Group4 />
    </div>
  );
}

function HabitCard2() {
  return (
    <div
      className='relative h-[15.994px] w-[19.999px] shrink-0'
      data-name='HabitCard'
    >
      <div className='relative box-border h-[15.994px] w-[19.999px] overflow-clip rounded-[inherit] border-0 border-solid border-[transparent] bg-clip-padding'>
        <ClipPathGroup4 />
      </div>
    </div>
  );
}

function Container15() {
  return (
    <div
      className='relative h-[39.997px] w-full shrink-0'
      data-name='Container'
    >
      <div className='flex size-full flex-row items-center justify-center'>
        <div className='relative flex h-[39.997px] w-full content-stretch items-center justify-center'>
          <HabitCard2 />
        </div>
      </div>
    </div>
  );
}

function Button1() {
  return (
    <div
      className='absolute left-0 top-0 flex size-[39.997px] flex-col content-stretch items-start rounded-[1.75866e+07px] bg-green-400'
      data-name='Button'
    >
      <Container15 />
    </div>
  );
}

function Container16() {
  return (
    <div
      className='absolute left-[61.75px] top-0 size-[39.997px]'
      data-name='Container'
    >
      <Container14 />
      <Button1 />
    </div>
  );
}

function Container20() {
  return (
    <div
      className='absolute left-[40px] top-[20px] h-[1.998px] w-[21.743px] bg-green-400'
      data-name='Container'
    />
  );
}

function Group6() {
  return (
    <div
      className='mask-alpha mask-intersect mask-no-clip mask-no-repeat mask-position-[-0.557px_-0.651px] mask-size-[19.999px_15.994px] absolute inset-[4.07%_2.79%]'
      data-name='Group'
      style={{ maskImage: `url('${imgGroup}')` }}
    >
      <svg
        className='block size-full'
        fill='none'
        preserveAspectRatio='none'
        viewBox='0 0 19 15'
      >
        <g id='Group'>
          <path
            d={svgPaths.p30bd5680}
            fill='var(--fill-0, white)'
            id='Vector'
          />
        </g>
      </svg>
    </div>
  );
}

function ClipPathGroup6() {
  return (
    <div className='absolute inset-0 contents' data-name='Clip path group'>
      <Group6 />
    </div>
  );
}

function HabitCard4() {
  return (
    <div
      className='relative h-[15.994px] w-[19.999px] shrink-0'
      data-name='HabitCard'
    >
      <div className='relative box-border h-[15.994px] w-[19.999px] overflow-clip rounded-[inherit] border-0 border-solid border-[transparent] bg-clip-padding'>
        <ClipPathGroup6 />
      </div>
    </div>
  );
}

function Container21() {
  return (
    <div
      className='relative h-[39.997px] w-full shrink-0'
      data-name='Container'
    >
      <div className='flex size-full flex-row items-center justify-center'>
        <div className='relative flex h-[39.997px] w-full content-stretch items-center justify-center'>
          <HabitCard4 />
        </div>
      </div>
    </div>
  );
}

function Button3() {
  return (
    <div
      className='absolute left-0 top-0 flex size-[39.997px] flex-col content-stretch items-start rounded-[1.75866e+07px] bg-green-400'
      data-name='Button'
    >
      <Container21 />
    </div>
  );
}

function Container22() {
  return (
    <div
      className='absolute left-[185.25px] top-0 size-[39.997px]'
      data-name='Container'
    >
      <Container20 />
      <Button3 />
    </div>
  );
}

function Group7() {
  return (
    <div
      className='mask-alpha mask-intersect mask-no-clip mask-no-repeat mask-position-[-0.557px_-0.651px] mask-size-[19.999px_15.994px] absolute inset-[4.07%_2.79%]'
      data-name='Group'
      style={{ maskImage: `url('${imgGroup}')` }}
    >
      <svg
        className='block size-full'
        fill='none'
        preserveAspectRatio='none'
        viewBox='0 0 19 15'
      >
        <g id='Group'>
          <path
            d={svgPaths.p30bd5680}
            fill='var(--fill-0, white)'
            id='Vector'
          />
        </g>
      </svg>
    </div>
  );
}

function ClipPathGroup7() {
  return (
    <div className='absolute inset-0 contents' data-name='Clip path group'>
      <Group7 />
    </div>
  );
}

function HabitCard5() {
  return (
    <div
      className='relative h-[15.994px] w-[19.999px] shrink-0'
      data-name='HabitCard'
    >
      <div className='relative box-border h-[15.994px] w-[19.999px] overflow-clip rounded-[inherit] border-0 border-solid border-[transparent] bg-clip-padding'>
        <ClipPathGroup7 />
      </div>
    </div>
  );
}

function Container23() {
  return (
    <div
      className='relative h-[39.997px] w-full shrink-0'
      data-name='Container'
    >
      <div className='flex size-full flex-row items-center justify-center'>
        <div className='relative flex h-[39.997px] w-full content-stretch items-center justify-center'>
          <HabitCard5 />
        </div>
      </div>
    </div>
  );
}

function Button4() {
  return (
    <div
      className='absolute left-[246.99px] top-0 flex size-[39.997px] flex-col content-stretch items-start rounded-[1.75866e+07px] bg-green-400'
      data-name='Button'
    >
      <Container23 />
    </div>
  );
}

function HabitCard6() {
  return (
    <div
      className='relative h-[39.997px] w-full shrink-0'
      data-name='HabitCard'
    >
      <Container13 />
      <Container16 />
      <Clip0Signal />
      <Container22 />
      <Button4 />
    </div>
  );
}

function HabitCard7() {
  return (
    <div
      className='relative h-[17.992px] w-full shrink-0'
      data-name='HabitCard'
    >
      <p className="absolute left-0 top-[0.57px] w-[121px] font-['Inter:Semi_Bold',_sans-serif] text-[12px] font-semibold not-italic leading-[18px] tracking-[1.2px] text-[#a0aec0]">
        STREAK • 5 DAYS
      </p>
    </div>
  );
}

function Container24() {
  return (
    <div
      className='relative h-[161.979px] w-[326.995px] shrink-0 rounded-[16px] bg-white shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)]'
      data-name='Container'
    >
      <div className='relative box-border flex h-[161.979px] w-[326.995px] flex-col content-stretch items-start gap-[15.994px] border-0 border-solid border-[transparent] bg-clip-padding px-[19.999px] pb-0 pt-[19.999px]'>
        <HabitCard />
        <HabitCard6 />
        <HabitCard7 />
      </div>
    </div>
  );
}

function Text1() {
  return (
    <div
      className='relative h-[32.004px] w-[24.11px] shrink-0'
      data-name='Text'
    >
      <div className='relative box-border h-[32.004px] w-[24.11px] border-0 border-solid border-[transparent] bg-clip-padding'>
        <p className="absolute left-0 top-[-0.43px] whitespace-pre text-nowrap font-['Inter:Regular',_sans-serif] text-[24px] font-normal not-italic leading-[32px] tracking-[0.0703px] text-neutral-950">
          📚
        </p>
      </div>
    </div>
  );
}

function Heading3() {
  return (
    <div
      className='relative h-[27px] w-[70.838px] shrink-0'
      data-name='Heading 2'
    >
      <div className='relative box-border h-[27px] w-[70.838px] border-0 border-solid border-[transparent] bg-clip-padding'>
        <p className="absolute left-0 top-[0.62px] whitespace-pre text-nowrap font-['Inter:Semi_Bold',_sans-serif] text-[18px] font-semibold not-italic leading-[27px] text-[#101727]">
          Reading
        </p>
      </div>
    </div>
  );
}

function HabitCard8() {
  return (
    <div
      className='relative flex h-[32.004px] w-full shrink-0 content-stretch items-center gap-[11.998px]'
      data-name='HabitCard'
    >
      <Text1 />
      <Heading3 />
    </div>
  );
}

function Container25() {
  return (
    <div
      className='absolute left-[40px] top-[20px] h-[1.998px] w-[21.743px] bg-green-400'
      data-name='Container'
    />
  );
}

function Group8() {
  return (
    <div
      className='mask-alpha mask-intersect mask-no-clip mask-no-repeat mask-position-[-0.557px_-0.651px] mask-size-[19.999px_15.994px] absolute inset-[4.07%_2.79%]'
      data-name='Group'
      style={{ maskImage: `url('${imgGroup}')` }}
    >
      <svg
        className='block size-full'
        fill='none'
        preserveAspectRatio='none'
        viewBox='0 0 19 15'
      >
        <g id='Group'>
          <path
            d={svgPaths.p30bd5680}
            fill='var(--fill-0, white)'
            id='Vector'
          />
        </g>
      </svg>
    </div>
  );
}

function ClipPathGroup8() {
  return (
    <div className='absolute inset-0 contents' data-name='Clip path group'>
      <Group8 />
    </div>
  );
}

function HabitCard9() {
  return (
    <div
      className='relative h-[15.994px] w-[19.999px] shrink-0'
      data-name='HabitCard'
    >
      <div className='relative box-border h-[15.994px] w-[19.999px] overflow-clip rounded-[inherit] border-0 border-solid border-[transparent] bg-clip-padding'>
        <ClipPathGroup8 />
      </div>
    </div>
  );
}

function Container26() {
  return (
    <div
      className='relative h-[39.997px] w-full shrink-0'
      data-name='Container'
    >
      <div className='flex size-full flex-row items-center justify-center'>
        <div className='relative flex h-[39.997px] w-full content-stretch items-center justify-center'>
          <HabitCard9 />
        </div>
      </div>
    </div>
  );
}

function Button5() {
  return (
    <div
      className='absolute left-0 top-0 flex size-[39.997px] flex-col content-stretch items-start rounded-[1.75866e+07px] bg-green-400'
      data-name='Button'
    >
      <Container26 />
    </div>
  );
}

function Container27() {
  return (
    <div
      className='absolute left-0 top-0 size-[39.997px]'
      data-name='Container'
    >
      <Container25 />
      <Button5 />
    </div>
  );
}

function Container28() {
  return (
    <div
      className='absolute left-[40px] top-[20px] h-[1.998px] w-[21.743px] bg-green-400'
      data-name='Container'
    />
  );
}

function Group9() {
  return (
    <div
      className='mask-alpha mask-intersect mask-no-clip mask-no-repeat mask-position-[-0.557px_-0.651px] mask-size-[19.999px_15.994px] absolute inset-[4.07%_2.79%]'
      data-name='Group'
      style={{ maskImage: `url('${imgGroup}')` }}
    >
      <svg
        className='block size-full'
        fill='none'
        preserveAspectRatio='none'
        viewBox='0 0 19 15'
      >
        <g id='Group'>
          <path
            d={svgPaths.p30bd5680}
            fill='var(--fill-0, white)'
            id='Vector'
          />
        </g>
      </svg>
    </div>
  );
}

function ClipPathGroup9() {
  return (
    <div className='absolute inset-0 contents' data-name='Clip path group'>
      <Group9 />
    </div>
  );
}

function HabitCard10() {
  return (
    <div
      className='relative h-[15.994px] w-[19.999px] shrink-0'
      data-name='HabitCard'
    >
      <div className='relative box-border h-[15.994px] w-[19.999px] overflow-clip rounded-[inherit] border-0 border-solid border-[transparent] bg-clip-padding'>
        <ClipPathGroup9 />
      </div>
    </div>
  );
}

function Container29() {
  return (
    <div
      className='relative h-[39.997px] w-full shrink-0'
      data-name='Container'
    >
      <div className='flex size-full flex-row items-center justify-center'>
        <div className='relative flex h-[39.997px] w-full content-stretch items-center justify-center'>
          <HabitCard10 />
        </div>
      </div>
    </div>
  );
}

function Button6() {
  return (
    <div
      className='absolute left-0 top-0 flex size-[39.997px] flex-col content-stretch items-start rounded-[1.75866e+07px] bg-green-400'
      data-name='Button'
    >
      <Container29 />
    </div>
  );
}

function Container30() {
  return (
    <div
      className='absolute left-[61.75px] top-0 size-[39.997px]'
      data-name='Container'
    >
      <Container28 />
      <Button6 />
    </div>
  );
}

function Group10() {
  return (
    <div
      className='mask-alpha mask-intersect mask-no-clip mask-no-repeat mask-position-[-0.557px_-0.651px] mask-size-[19.999px_15.994px] absolute inset-[4.07%_2.79%]'
      data-name='Group'
      style={{ maskImage: `url('${imgGroup}')` }}
    >
      <svg
        className='block size-full'
        fill='none'
        preserveAspectRatio='none'
        viewBox='0 0 19 15'
      >
        <g id='Group'>
          <path
            d={svgPaths.p30bd5680}
            fill='var(--fill-0, white)'
            id='Vector'
          />
        </g>
      </svg>
    </div>
  );
}

function ClipPathGroup10() {
  return (
    <div className='absolute inset-0 contents' data-name='Clip path group'>
      <Group10 />
    </div>
  );
}

function HabitCard11() {
  return (
    <div
      className='relative h-[15.994px] w-[19.999px] shrink-0'
      data-name='HabitCard'
    >
      <div className='relative box-border h-[15.994px] w-[19.999px] overflow-clip rounded-[inherit] border-0 border-solid border-[transparent] bg-clip-padding'>
        <ClipPathGroup10 />
      </div>
    </div>
  );
}

function Container31() {
  return (
    <div
      className='relative h-[39.997px] w-full shrink-0'
      data-name='Container'
    >
      <div className='flex size-full flex-row items-center justify-center'>
        <div className='relative flex h-[39.997px] w-full content-stretch items-center justify-center'>
          <HabitCard11 />
        </div>
      </div>
    </div>
  );
}

function Button7() {
  return (
    <div
      className='absolute left-[123.5px] top-0 flex size-[39.997px] flex-col content-stretch items-start rounded-[1.75866e+07px] bg-green-400'
      data-name='Button'
    >
      <Container31 />
    </div>
  );
}

function Button8() {
  return (
    <div
      className='absolute left-[185.25px] top-0 size-[39.997px] rounded-[1.75866e+07px] bg-[#dde3ed]'
      data-name='Button'
    />
  );
}

function Button9() {
  return (
    <div
      className='absolute left-[246.99px] top-0 size-[39.997px] rounded-[1.75866e+07px] bg-[#dde3ed]'
      data-name='Button'
    />
  );
}

function HabitCard12() {
  return (
    <div
      className='relative h-[39.997px] w-full shrink-0'
      data-name='HabitCard'
    >
      <Container27 />
      <Container30 />
      <Button7 />
      <Button8 />
      <Button9 />
    </div>
  );
}

function Container32() {
  return (
    <div
      className='relative h-[127.992px] w-[326.995px] shrink-0 rounded-[16px] bg-white shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)]'
      data-name='Container'
    >
      <div className='relative box-border flex h-[127.992px] w-[326.995px] flex-col content-stretch items-start gap-[15.994px] border-0 border-solid border-[transparent] bg-clip-padding px-[19.999px] pb-0 pt-[19.999px]'>
        <HabitCard8 />
        <HabitCard12 />
      </div>
    </div>
  );
}

function Text2() {
  return (
    <div
      className='relative h-[32.004px] w-[24.11px] shrink-0'
      data-name='Text'
    >
      <div className='relative box-border h-[32.004px] w-[24.11px] border-0 border-solid border-[transparent] bg-clip-padding'>
        <Clip0Wifi />
      </div>
    </div>
  );
}

function Heading4() {
  return (
    <div
      className='relative h-[27px] w-[73.713px] shrink-0'
      data-name='Heading 2'
    >
      <div className='relative box-border h-[27px] w-[73.713px] border-0 border-solid border-[transparent] bg-clip-padding'>
        <p className="absolute left-0 top-[0.62px] whitespace-pre text-nowrap font-['Inter:Semi_Bold',_sans-serif] text-[18px] font-semibold not-italic leading-[27px] text-[#101727]">
          Exercise
        </p>
      </div>
    </div>
  );
}

function HabitCard13() {
  return (
    <div
      className='relative flex h-[32.004px] w-full shrink-0 content-stretch items-center gap-[11.998px]'
      data-name='HabitCard'
    >
      <Text2 />
      <Heading4 />
    </div>
  );
}

function Button10() {
  return (
    <div
      className='absolute left-0 top-0 size-[39.997px] rounded-[1.75866e+07px] bg-[#dde3ed]'
      data-name='Button'
    />
  );
}

function Container33() {
  return (
    <div
      className='absolute left-[40px] top-[20px] h-[1.998px] w-[21.743px] bg-green-400'
      data-name='Container'
    />
  );
}

function Group11() {
  return (
    <div
      className='mask-alpha mask-intersect mask-no-clip mask-no-repeat mask-position-[-0.557px_-0.651px] mask-size-[19.999px_15.994px] absolute inset-[4.07%_2.79%]'
      data-name='Group'
      style={{ maskImage: `url('${imgGroup}')` }}
    >
      <svg
        className='block size-full'
        fill='none'
        preserveAspectRatio='none'
        viewBox='0 0 19 15'
      >
        <g id='Group'>
          <path
            d={svgPaths.p30bd5680}
            fill='var(--fill-0, white)'
            id='Vector'
          />
        </g>
      </svg>
    </div>
  );
}

function ClipPathGroup11() {
  return (
    <div className='absolute inset-0 contents' data-name='Clip path group'>
      <Group11 />
    </div>
  );
}

function HabitCard14() {
  return (
    <div
      className='relative h-[15.994px] w-[19.999px] shrink-0'
      data-name='HabitCard'
    >
      <div className='relative box-border h-[15.994px] w-[19.999px] overflow-clip rounded-[inherit] border-0 border-solid border-[transparent] bg-clip-padding'>
        <ClipPathGroup11 />
      </div>
    </div>
  );
}

function Container34() {
  return (
    <div
      className='relative h-[39.997px] w-full shrink-0'
      data-name='Container'
    >
      <div className='flex size-full flex-row items-center justify-center'>
        <div className='relative flex h-[39.997px] w-full content-stretch items-center justify-center'>
          <HabitCard14 />
        </div>
      </div>
    </div>
  );
}

function Button11() {
  return (
    <div
      className='absolute left-0 top-0 flex size-[39.997px] flex-col content-stretch items-start rounded-[1.75866e+07px] bg-green-400'
      data-name='Button'
    >
      <Container34 />
    </div>
  );
}

function Container35() {
  return (
    <div
      className='absolute left-[61.75px] top-0 size-[39.997px]'
      data-name='Container'
    >
      <Container33 />
      <Button11 />
    </div>
  );
}

function Container36() {
  return (
    <div
      className='absolute left-[40px] top-[20px] h-[1.998px] w-[21.743px] bg-green-400'
      data-name='Container'
    />
  );
}

function Group12() {
  return (
    <div
      className='mask-alpha mask-intersect mask-no-clip mask-no-repeat mask-position-[-0.557px_-0.651px] mask-size-[19.999px_15.994px] absolute inset-[4.07%_2.79%]'
      data-name='Group'
      style={{ maskImage: `url('${imgGroup}')` }}
    >
      <svg
        className='block size-full'
        fill='none'
        preserveAspectRatio='none'
        viewBox='0 0 19 15'
      >
        <g id='Group'>
          <path
            d={svgPaths.p30bd5680}
            fill='var(--fill-0, white)'
            id='Vector'
          />
        </g>
      </svg>
    </div>
  );
}

function ClipPathGroup12() {
  return (
    <div className='absolute inset-0 contents' data-name='Clip path group'>
      <Group12 />
    </div>
  );
}

function HabitCard15() {
  return (
    <div
      className='relative h-[15.994px] w-[19.999px] shrink-0'
      data-name='HabitCard'
    >
      <div className='relative box-border h-[15.994px] w-[19.999px] overflow-clip rounded-[inherit] border-0 border-solid border-[transparent] bg-clip-padding'>
        <ClipPathGroup12 />
      </div>
    </div>
  );
}

function Container37() {
  return (
    <div
      className='relative h-[39.997px] w-full shrink-0'
      data-name='Container'
    >
      <div className='flex size-full flex-row items-center justify-center'>
        <div className='relative flex h-[39.997px] w-full content-stretch items-center justify-center'>
          <HabitCard15 />
        </div>
      </div>
    </div>
  );
}

function Button12() {
  return (
    <div
      className='absolute left-0 top-0 flex size-[39.997px] flex-col content-stretch items-start rounded-[1.75866e+07px] bg-green-400'
      data-name='Button'
    >
      <Container37 />
    </div>
  );
}

function Container38() {
  return (
    <div
      className='absolute left-[123.5px] top-0 size-[39.997px]'
      data-name='Container'
    >
      <Container36 />
      <Button12 />
    </div>
  );
}

function Group13() {
  return (
    <div
      className='mask-alpha mask-intersect mask-no-clip mask-no-repeat mask-position-[-0.557px_-0.651px] mask-size-[19.999px_15.994px] absolute inset-[4.07%_2.79%]'
      data-name='Group'
      style={{ maskImage: `url('${imgGroup}')` }}
    >
      <svg
        className='block size-full'
        fill='none'
        preserveAspectRatio='none'
        viewBox='0 0 19 15'
      >
        <g id='Group'>
          <path
            d={svgPaths.p30bd5680}
            fill='var(--fill-0, white)'
            id='Vector'
          />
        </g>
      </svg>
    </div>
  );
}

function ClipPathGroup13() {
  return (
    <div className='absolute inset-0 contents' data-name='Clip path group'>
      <Group13 />
    </div>
  );
}

function HabitCard16() {
  return (
    <div
      className='relative h-[15.994px] w-[19.999px] shrink-0'
      data-name='HabitCard'
    >
      <div className='relative box-border h-[15.994px] w-[19.999px] overflow-clip rounded-[inherit] border-0 border-solid border-[transparent] bg-clip-padding'>
        <ClipPathGroup13 />
      </div>
    </div>
  );
}

function Container39() {
  return (
    <div
      className='relative h-[39.997px] w-full shrink-0'
      data-name='Container'
    >
      <div className='flex size-full flex-row items-center justify-center'>
        <div className='relative flex h-[39.997px] w-full content-stretch items-center justify-center'>
          <HabitCard16 />
        </div>
      </div>
    </div>
  );
}

function Button13() {
  return (
    <div
      className='absolute left-[185.25px] top-0 flex size-[39.997px] flex-col content-stretch items-start rounded-[1.75866e+07px] bg-green-400'
      data-name='Button'
    >
      <Container39 />
    </div>
  );
}

function Button14() {
  return (
    <div
      className='absolute left-[246.99px] top-0 size-[39.997px] rounded-[1.75866e+07px] bg-[#dde3ed]'
      data-name='Button'
    />
  );
}

function HabitCard17() {
  return (
    <div
      className='relative h-[39.997px] w-full shrink-0'
      data-name='HabitCard'
    >
      <Button10 />
      <Container35 />
      <Container38 />
      <Button13 />
      <Button14 />
    </div>
  );
}

function Container40() {
  return (
    <div
      className='relative h-[127.992px] w-[326.995px] shrink-0 rounded-[16px] bg-white shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)]'
      data-name='Container'
    >
      <div className='relative box-border flex h-[127.992px] w-[326.995px] flex-col content-stretch items-start gap-[15.994px] border-0 border-solid border-[transparent] bg-clip-padding px-[19.999px] pb-0 pt-[19.999px]'>
        <HabitCard13 />
        <HabitCard17 />
      </div>
    </div>
  );
}

function Container41() {
  return (
    <div
      className='absolute left-[24px] top-[199.96px] flex h-[449.951px] w-[327.003px] flex-col content-stretch items-start gap-[15.994px]'
      data-name='Container'
    >
      <Container24 />
      <Container32 />
      <Container40 />
    </div>
  );
}

function Container42() {
  return (
    <div
      className='absolute left-[10px] top-[36px] h-[729.906px] w-[374.993px]'
      data-name='Container'
    >
      <Container5 />
      <DateSelector />
      <Container41 />
    </div>
  );
}

function Frame() {
  return (
    <div className='relative h-[24px] w-[21px] shrink-0' data-name='Frame'>
      <svg
        className='block size-full'
        fill='none'
        preserveAspectRatio='none'
        viewBox='0 0 21 24'
      >
        <g id='Frame'>
          <path d='M21 24H0V0H21V24Z' stroke='var(--stroke-0, #E5E7EB)' />
          <path
            d={svgPaths.p3c209b00}
            fill='var(--fill-0, white)'
            id='Vector'
          />
        </g>
      </svg>
    </div>
  );
}

function Svg() {
  return (
    <div
      className='absolute left-0 top-[3px] flex h-[24px] w-[21px] content-stretch items-center justify-center'
      data-name='svg'
    >
      <Frame />
    </div>
  );
}

function I() {
  return (
    <div
      className='absolute left-[21.5px] top-[16px] h-[32px] w-[21px] bg-[rgba(0,0,0,0)]'
      data-name='i'
    >
      <div
        aria-hidden='true'
        className='pointer-events-none absolute inset-0 border-0 border-solid border-gray-200'
      />
      <Svg />
    </div>
  );
}

function Button15() {
  return (
    <div
      className='absolute left-[318px] top-[766px] size-[64px] rounded-[9999px] bg-[#101727]'
      data-name='button'
    >
      <div
        aria-hidden='true'
        className='pointer-events-none absolute inset-0 rounded-[9999px] border-0 border-solid border-gray-200 shadow-[0px_4px_6px_0px_rgba(0,0,0,0.1),0px_10px_15px_0px_rgba(0,0,0,0.1)]'
      />
      <I />
    </div>
  );
}

export default function EnhanceCurrentDesign() {
  return (
    <div
      className='relative size-full bg-[#f7f8fa]'
      data-name='Enhance Current Design'
    >
      <Container4 />
      <Container42 />
      <Button15 />
    </div>
  );
}
