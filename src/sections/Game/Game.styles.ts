import styled, { css, keyframes } from 'styled-components'

const splashAnimation = keyframes`
  0% { opacity: 1; }
  30%, 75% { opacity: 1; }
  100% { opacity: 0; }
`

export const loadingAnimation = keyframes`
  0% { left: 0%; transform: translateX(-100%); }
  100% { left: 100%; transform: translateX(50%); }
`

export const Container = styled.div`
  width: 100%;
  position: relative;
  display: grid;
  gap: var(--s2);
`

export const Splash = styled.div`
  pointer-events: none;
  position: absolute;
  left: 0; top: 0;
  width: 100%; height: 100%;
  opacity: 0;
  animation: ${splashAnimation} .75s ease;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 5;
  background: var(--surface);
`

export const Screen = styled.div`
  position: relative;
  flex-grow: 1;
  background: var(--surface);
  border-radius: var(--r-card);
  border: 1px solid var(--border);
  overflow: hidden;
  transition: height .2s ease;
  height: 600px;
  @media (max-width: 700px) { height: 500px; }
`

export const IconButton = styled.button`
  background: none;
  border: none;
  padding: 0 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 16px;
  border-radius: var(--r-input);
  color: var(--text-mid);
  transition: color .15s, background .15s;
  &:hover { background: var(--surface-2); color: var(--text); }
`

export const StyledLoadingIndicator = styled.div<{$active: boolean}>`
  position: relative;
  height: 3px;
  width: 100%;
  overflow: hidden;
  border-radius: var(--r-full);
  background: var(--surface);
  &:after {
    content: " ";
    position: absolute;
    width: 25%; height: 100%;
    animation: ${loadingAnimation} ease infinite .5s;
    opacity: 0;
    background: var(--gold);
    transition: opacity .5s;
    ${(props) => props.$active && css`opacity: 1;`}
  }
`

export const Controls = styled.div`
  width: 100%;
  background: var(--surface);
  padding: var(--s4);
  color: var(--text);
  border-radius: var(--r-card);
  border: 1px solid var(--border);
  z-index: 6;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: var(--s4);
  @media (max-width: 800px) {
    flex-direction: column;
    gap: var(--s3);
    padding: var(--s3);
  }
  @media (min-width: 800px) {
    min-height: 72px;
  }
`

export const MetaControls = styled.div`
  position: absolute;
  bottom: 0; left: 0;
  width: 100%;
  padding: var(--s3);
  display: flex;
  align-items: center;
  gap: var(--s2);
  z-index: 6;
`

export const SettingControls = styled.div`
  & > button {
    all: unset;
    cursor: pointer;
    opacity: .3;
    transition: opacity .2s;
    padding: 5px;
    &:hover { opacity: 1; }
  }
`

const spinnerAnimation = keyframes`
  from { transform: rotate(0deg); }
  to   { transform: rotate(360deg); }
`

export const Spinner = styled.div`
  --spinner-size: 1em;
  --spinner-border: 2px;
  animation: ${spinnerAnimation} 1s ease infinite;
  border-top: var(--spinner-border) solid var(--text);
  border-right: var(--spinner-border) solid var(--text);
  border-bottom: var(--spinner-border) solid var(--text);
  border-left: var(--spinner-border) solid transparent;
  height: var(--spinner-size);
  aspect-ratio: 1/1;
  border-radius: 50%;
`
