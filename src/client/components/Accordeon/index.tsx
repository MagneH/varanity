import React, { ReactElement, useEffect, useState } from 'react';
import Collapse from 'react-css-collapse';
import styled from 'styled-components';
import AddIcon from '@material-ui/icons/Add';
import RemoveIcon from '@material-ui/icons/Remove';
import { spacing } from '../Theme';

// Types
interface Props {
  label: string;
  isInitiallyOpen?: boolean;
  className?: string;
  children?: React.ReactNode;
}

export const Accordeon = ({ label, className, children, isInitiallyOpen }: Props): ReactElement => {
  useEffect(() => {
    setIsOpen(isInitiallyOpen);
  }, [isInitiallyOpen]);

  const [isOpen, setIsOpen] = useState(isInitiallyOpen);

  return (
    <Wrapper>
      <Label role="button" tabIndex={0} onClick={() => setIsOpen(!isOpen)}>
        {label}
        <IconWrap>{isOpen ? <RemoveIcon /> : <AddIcon />}</IconWrap>
      </Label>
      <Collapse isOpen={!!isOpen && isOpen}>
        <div className={className}>{children}</div>
      </Collapse>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  border-bottom: 1px solid
    ${({ theme }) =>
      theme && theme.accordeon && theme.accordeon.border ? theme.accordeon.border : 'red'};
`;

const Label = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: 16px;
`;

const IconWrap = styled.div`
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-left: ${spacing.space8};
  justify-self: flex-end;
`;
