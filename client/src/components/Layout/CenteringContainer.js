import 'react';
import styled from 'styled-components';

const CenteringContainer = styled.div`
  width: 100vw;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: ${({ bgColor = '#white' }) => bgColor};
`;

export default CenteringContainer;