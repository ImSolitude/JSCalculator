import React, { Component } from 'react';
import styled from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart } from "@fortawesome/free-solid-svg-icons";

const Link = styled.a`
  color: inherit;
  text-decoration: none;
`;

const StyledCredit = styled.h3`
  position: absolute;
  bottom: -40px;
  left: 0;
  color: rgba(255, 255, 255, 0.5);
  font-family: "Karla", sans-serif;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.08rem;
  font-size: 0.8rem;
`;

class Credit extends Component {
  render() {
    return (
      <StyledCredit>
        Made with{' '}
          <FontAwesomeIcon
            icon={faHeart}
            pulse
            style={{ color: "#f44336", opacity: "1" }}
          />{' '}
          by{' '}
          <Link
            href="http://imsolitude.github.io"
            style={{ color: "rgba(255, 255, 255, 1)" }}
          >
            muhammadj
          </Link>
      </StyledCredit>
    );
  }
}

export default Credit;