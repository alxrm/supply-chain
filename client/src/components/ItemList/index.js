import React from 'react';
import times from 'lodash.times';
import styled from 'styled-components';

const ItemCard = styled.div`
  background-color: black;
  color: whitesmoke;
  padding: 32px;
  margin: 12px 0;
`;

export default (props) => (
  <div>
    {times(90).map(it =>
      <ItemCard key={it}>Item: {it}</ItemCard>
    )}
  </div>
);