import React from 'react'
import styled from 'styled-components'

interface SliderProps {
  min: number
  max: number
  value: number
  range: [number, number]
  onChange: (value: number) => void
  disabled?: boolean
}

const Wrap = styled.div`
  position: relative;
  width: 100%;
  padding-bottom: 28px;
`

const BarOuter = styled.div`
  position: relative;
  height: 12px;
  border-radius: 6px;
  overflow: hidden;
  background: var(--lose, #EF4444);
`

const BarWin = styled.div`
  height: 100%;
  background: var(--win, #22C55E);
  border-radius: 6px 0 0 6px;
  transition: width .08s;
`

const Input = styled.input`
  position: absolute;
  left: 0; top: 0;
  width: 100%; height: 12px;
  -webkit-appearance: none;
  appearance: none;
  background: transparent;
  outline: none;
  margin: 0; padding: 0;
  cursor: pointer;
  &:disabled { cursor: default; }

  &::-webkit-slider-thumb {
    -webkit-appearance: none;
    width: 18px; height: 18px;
    border-radius: 50%;
    background: var(--gold, #E0B44A);
    box-shadow: 0 0 0 4px var(--bg, #08090C);
    cursor: pointer;
  }
  &::-moz-range-thumb {
    width: 18px; height: 18px;
    border-radius: 50%;
    background: var(--gold, #E0B44A);
    box-shadow: 0 0 0 4px var(--bg, #08090C);
    border: none;
    cursor: pointer;
  }
`

const Ticks = styled.div`
  position: absolute;
  bottom: 0; left: 0; right: 0;
  display: flex;
  justify-content: space-between;
  pointer-events: none;
`

const Tick = styled.span`
  font-family: var(--font-num, 'JetBrains Mono', monospace);
  font-variant-numeric: tabular-nums;
  font-size: 10px;
  color: var(--text-dim, #5B6270);
`

export default function Slider({ min: minValue, max: maxValue, value, onChange, disabled, range: [rangeMin, rangeMax] }: SliderProps) {
  const pct = ((value - rangeMin) / (rangeMax - rangeMin)) * 100

  const change = (newValue: number) => {
    const fixed = Math.max(minValue, Math.min(maxValue, newValue))
    if (fixed !== value) onChange(fixed)
  }

  return (
    <Wrap>
      <BarOuter>
        <BarWin style={{ width: `${pct}%` }} />
      </BarOuter>
      <Input
        type="range"
        value={value}
        disabled={disabled}
        min={rangeMin}
        max={rangeMax}
        onChange={(e) => change(Number(e.target.value))}
      />
      <Ticks>
        <Tick>0</Tick>
        <Tick>25</Tick>
        <Tick>50</Tick>
        <Tick>75</Tick>
        <Tick>100</Tick>
      </Ticks>
    </Wrap>
  )
}
